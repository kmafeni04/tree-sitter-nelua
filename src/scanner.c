#include "tree_sitter/alloc.h"
#include "tree_sitter/parser.h"
#include <stdbool.h>
#include <string.h>

typedef enum { NOT_SET, BLOCK_STR, SHORT_STR, PREPROC, COMMENT } StateType;

typedef struct {
  uint32_t opening_eqs;
  StateType state_type;
  char opening_quote;
} State;

void *tree_sitter_nelua_external_scanner_create() {
  return ts_calloc(1, sizeof(State));
}
void tree_sitter_nelua_external_scanner_destroy(void *payload) {
  ts_free(payload);
}

static inline void consume(TSLexer *lexer) { lexer->advance(lexer, false); }
static inline void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

enum TokenType {
  BLOCK_COMMENT_START,
  BLOCK_COMMENT_CHAR,
  BLOCK_COMMENT_END,

  BLOCK_PREPROC_STMT_START,
  BLOCK_PREPROC_STMT_CHAR,
  BLOCK_PREPROC_STMT_END,

  SHORT_STRING_START,
  SHORT_STRING_CHAR,
  SHORT_STRING_END,

  BLOCK_STRING_START,
  BLOCK_STRING_CHAR,
  BLOCK_STRING_END,
};

#define EXPECT(char)                                                           \
  do {                                                                         \
    if (lexer->lookahead != char) {                                            \
      return false;                                                            \
    }                                                                          \
    consume(lexer);                                                            \
  } while (0)
static inline uint32_t consume_eqs(TSLexer *lexer) {
  uint32_t result = 0;
  while (!lexer->eof(lexer) && lexer->lookahead == '=') {
    consume(lexer);
    result += 1;
  }
  return result;
}

static void consume_rest_of_line(TSLexer *lexer) {
  while (!lexer->eof(lexer)) {
    switch (lexer->lookahead) {
    case '\n':
    case '\r':
      return;
    default:
      consume(lexer);
    }
  }
}

static inline void reset_state(State *state) {
  *state = (State){
      .opening_eqs = 0,
      .state_type = NOT_SET,
      .opening_quote = 0,
  };
}

unsigned tree_sitter_nelua_external_scanner_serialize(void *payload,
                                                      char *buffer) {
  memcpy(buffer, payload, sizeof(State));
  return sizeof(State);
}

void tree_sitter_nelua_external_scanner_deserialize(void *payload,
                                                    const char *buffer,
                                                    unsigned length) {
  if (length < sizeof(State))
    return;
  memcpy(payload, buffer, sizeof(State));
}

static bool scan_block_end(State *state, TSLexer *lexer, enum TokenType ttype) {
  EXPECT(']');

  uint32_t eqs = consume_eqs(lexer);
  if (state->opening_eqs == eqs && lexer->lookahead == ']') {
    consume(lexer);
    lexer->result_symbol = ttype;
    reset_state(state);
    return true;
  }
  lexer->mark_end(lexer);
  return false;
}

static bool scan_preproc_stmt_start(State *state, TSLexer *lexer) {
  EXPECT('#');
  EXPECT('#');
  EXPECT('[');
  reset_state(state);
  uint32_t eqs = consume_eqs(lexer);
  EXPECT('[');
  state->state_type = PREPROC;
  lexer->result_symbol = BLOCK_PREPROC_STMT_START;
  state->opening_eqs = eqs;
  return true;
}

static bool scan_preproc_stmt_char(State *state, TSLexer *lexer) {
  if (scan_block_end(state, lexer, BLOCK_PREPROC_STMT_END)) {
    return true;
  }
  consume(lexer);
  lexer->result_symbol = BLOCK_PREPROC_STMT_CHAR;
  return true;
}

static bool scan_comment_start(State *state, TSLexer *lexer) {
  EXPECT('-');
  EXPECT('-');
  EXPECT('[');
  reset_state(state);
  uint32_t eqs = consume_eqs(lexer);
  EXPECT('[');
  state->state_type = COMMENT;
  lexer->result_symbol = BLOCK_COMMENT_START;
  state->opening_eqs = eqs;
  return true;
}

static bool scan_comment_char(State *state, TSLexer *lexer) {
  if (scan_block_end(state, lexer, BLOCK_COMMENT_END)) {
    return true;
  }
  consume(lexer);
  lexer->result_symbol = BLOCK_COMMENT_CHAR;
  return true;
}

static bool scan_multiline_string_start(State *state, TSLexer *lexer) {
  EXPECT('[');
  reset_state(state);
  uint32_t eqs = consume_eqs(lexer);
  EXPECT('[');
  state->state_type = BLOCK_STR;
  lexer->result_symbol = BLOCK_STRING_START;
  state->opening_eqs = eqs;
  return true;
}

static bool scan_multiline_string_char(State *state, TSLexer *lexer) {
  if (scan_block_end(state, lexer, BLOCK_STRING_END)) {
    return true;
  }
  consume(lexer);
  lexer->result_symbol = BLOCK_STRING_CHAR;
  return true;
}

static bool scan_short_string_start(State *state, TSLexer *lexer) {
  if ((lexer->lookahead == '"') || (lexer->lookahead == '\'')) {
    state->opening_quote = (char)lexer->lookahead;
    state->state_type = SHORT_STR;
    consume(lexer);
    lexer->result_symbol = SHORT_STRING_START;
    return true;
  }
  return false;
}

static bool scan_short_string_end(State *state, TSLexer *lexer) {
  if (state->state_type == SHORT_STR &&
      lexer->lookahead == state->opening_quote) {
    consume(lexer);
    lexer->result_symbol = SHORT_STRING_END;
    reset_state(state);
    return true;
  }
  return false;
}

static bool scan_short_string_char(State *state, TSLexer *lexer) {
  if (scan_short_string_end(state, lexer)) {
    return true;
  }
  if (state->state_type == SHORT_STR && state->opening_quote > 0 &&
      lexer->lookahead != state->opening_quote && lexer->lookahead != '\n' &&
      lexer->lookahead != '\r' && lexer->lookahead != '\\') {
    consume(lexer);
    lexer->result_symbol = SHORT_STRING_CHAR;
    return true;
  }
  lexer->mark_end(lexer);
  return false;
}

static inline bool is_ascii_whitespace(uint32_t chr) {
  switch (chr) {
  default:
    return false;
  case '\n':
  case '\r':
  case ' ':
  case '\t':
    return true;
  }
}

bool tree_sitter_nelua_external_scanner_scan(void *payload, TSLexer *lexer,
                                             const bool *valid_symbols) {
  State *state = payload;
  // printf("State type %d\n",state->state_type);
  if (lexer->eof(lexer))
    return false;

  if (state->state_type == BLOCK_STR) {
    return scan_multiline_string_char(state, lexer);
  }

  if (state->state_type == SHORT_STR) {
    return scan_short_string_char(state, lexer);
  }

  if (state->state_type == PREPROC) {
    return scan_preproc_stmt_char(state, lexer);
  }

  if (state->state_type == COMMENT) {
    return scan_comment_char(state, lexer);
  }

  while (is_ascii_whitespace(lexer->lookahead))
    skip(lexer);

  if (valid_symbols[SHORT_STRING_START] &&
      scan_short_string_start(state, lexer))
    return true;

  if (valid_symbols[BLOCK_STRING_START] &&
      scan_multiline_string_start(state, lexer))
    return true;

  if (valid_symbols[BLOCK_PREPROC_STMT_START] &&
      scan_preproc_stmt_start(state, lexer))
    return true;

  return (valid_symbols[BLOCK_COMMENT_START] &&
          scan_comment_start(state, lexer));
}
