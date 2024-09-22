#include "tree_sitter/parser.h"

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 31
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 25
#define ALIAS_COUNT 0
#define TOKEN_COUNT 14
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 0
#define MAX_ALIAS_SEQUENCE_LENGTH 4
#define PRODUCTION_ID_COUNT 1

enum ts_symbol_identifiers {
  sym_hash_bang_line = 1,
  anon_sym_local = 2,
  anon_sym_global = 3,
  anon_sym_EQ = 4,
  anon_sym_COMMA = 5,
  sym_identifier = 6,
  sym_string = 7,
  sym_number = 8,
  anon_sym_DASH_DASH = 9,
  aux_sym_comment_token1 = 10,
  anon_sym_DASH_DASH_LBRACK_LBRACK = 11,
  aux_sym_comment_token2 = 12,
  anon_sym_RBRACK_RBRACK = 13,
  sym_source_file = 14,
  sym__statement = 15,
  sym_assignment_statement = 16,
  sym__expression_list = 17,
  sym__expression = 18,
  sym__identifier_list = 19,
  sym_comment = 20,
  aux_sym_source_file_repeat1 = 21,
  aux_sym__expression_list_repeat1 = 22,
  aux_sym__identifier_list_repeat1 = 23,
  aux_sym_comment_repeat1 = 24,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym_hash_bang_line] = "hash_bang_line",
  [anon_sym_local] = "local",
  [anon_sym_global] = "global",
  [anon_sym_EQ] = "=",
  [anon_sym_COMMA] = ",",
  [sym_identifier] = "identifier",
  [sym_string] = "string",
  [sym_number] = "number",
  [anon_sym_DASH_DASH] = "--",
  [aux_sym_comment_token1] = "comment_token1",
  [anon_sym_DASH_DASH_LBRACK_LBRACK] = "--[[",
  [aux_sym_comment_token2] = "comment_token2",
  [anon_sym_RBRACK_RBRACK] = "]]",
  [sym_source_file] = "source_file",
  [sym__statement] = "_statement",
  [sym_assignment_statement] = "assignment_statement",
  [sym__expression_list] = "_expression_list",
  [sym__expression] = "_expression",
  [sym__identifier_list] = "_identifier_list",
  [sym_comment] = "comment",
  [aux_sym_source_file_repeat1] = "source_file_repeat1",
  [aux_sym__expression_list_repeat1] = "_expression_list_repeat1",
  [aux_sym__identifier_list_repeat1] = "_identifier_list_repeat1",
  [aux_sym_comment_repeat1] = "comment_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym_hash_bang_line] = sym_hash_bang_line,
  [anon_sym_local] = anon_sym_local,
  [anon_sym_global] = anon_sym_global,
  [anon_sym_EQ] = anon_sym_EQ,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [sym_identifier] = sym_identifier,
  [sym_string] = sym_string,
  [sym_number] = sym_number,
  [anon_sym_DASH_DASH] = anon_sym_DASH_DASH,
  [aux_sym_comment_token1] = aux_sym_comment_token1,
  [anon_sym_DASH_DASH_LBRACK_LBRACK] = anon_sym_DASH_DASH_LBRACK_LBRACK,
  [aux_sym_comment_token2] = aux_sym_comment_token2,
  [anon_sym_RBRACK_RBRACK] = anon_sym_RBRACK_RBRACK,
  [sym_source_file] = sym_source_file,
  [sym__statement] = sym__statement,
  [sym_assignment_statement] = sym_assignment_statement,
  [sym__expression_list] = sym__expression_list,
  [sym__expression] = sym__expression,
  [sym__identifier_list] = sym__identifier_list,
  [sym_comment] = sym_comment,
  [aux_sym_source_file_repeat1] = aux_sym_source_file_repeat1,
  [aux_sym__expression_list_repeat1] = aux_sym__expression_list_repeat1,
  [aux_sym__identifier_list_repeat1] = aux_sym__identifier_list_repeat1,
  [aux_sym_comment_repeat1] = aux_sym_comment_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [sym_hash_bang_line] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_local] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_global] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COMMA] = {
    .visible = true,
    .named = false,
  },
  [sym_identifier] = {
    .visible = true,
    .named = true,
  },
  [sym_string] = {
    .visible = true,
    .named = true,
  },
  [sym_number] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_DASH_DASH] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_comment_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_DASH_DASH_LBRACK_LBRACK] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_comment_token2] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_RBRACK_RBRACK] = {
    .visible = true,
    .named = false,
  },
  [sym_source_file] = {
    .visible = true,
    .named = true,
  },
  [sym__statement] = {
    .visible = false,
    .named = true,
  },
  [sym_assignment_statement] = {
    .visible = true,
    .named = true,
  },
  [sym__expression_list] = {
    .visible = false,
    .named = true,
  },
  [sym__expression] = {
    .visible = false,
    .named = true,
  },
  [sym__identifier_list] = {
    .visible = false,
    .named = true,
  },
  [sym_comment] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_source_file_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym__expression_list_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym__identifier_list_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_comment_repeat1] = {
    .visible = false,
    .named = false,
  },
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
  [20] = 20,
  [21] = 21,
  [22] = 22,
  [23] = 23,
  [24] = 24,
  [25] = 25,
  [26] = 26,
  [27] = 27,
  [28] = 28,
  [29] = 29,
  [30] = 30,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(17);
      ADVANCE_MAP(
        '"', 2,
        '#', 18,
        ',', 22,
        '-', 4,
        '=', 21,
        ']', 6,
        'g', 13,
        'l', 14,
      );
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(0);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(25);
      END_STATE();
    case 1:
      if (lookahead == '\n') SKIP(1);
      if (lookahead == '-') ADVANCE(36);
      if (lookahead == ']') ADVANCE(38);
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') ADVANCE(37);
      if (lookahead != 0) ADVANCE(35);
      END_STATE();
    case 2:
      if (lookahead == '"') ADVANCE(24);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(2);
      END_STATE();
    case 3:
      if (lookahead == '-') ADVANCE(4);
      if (('\t' <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') SKIP(3);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(23);
      END_STATE();
    case 4:
      if (lookahead == '-') ADVANCE(27);
      END_STATE();
    case 5:
      if (lookahead == '[') ADVANCE(33);
      END_STATE();
    case 6:
      if (lookahead == ']') ADVANCE(39);
      END_STATE();
    case 7:
      if (lookahead == 'a') ADVANCE(11);
      END_STATE();
    case 8:
      if (lookahead == 'a') ADVANCE(12);
      END_STATE();
    case 9:
      if (lookahead == 'b') ADVANCE(8);
      END_STATE();
    case 10:
      if (lookahead == 'c') ADVANCE(7);
      END_STATE();
    case 11:
      if (lookahead == 'l') ADVANCE(19);
      END_STATE();
    case 12:
      if (lookahead == 'l') ADVANCE(20);
      END_STATE();
    case 13:
      if (lookahead == 'l') ADVANCE(15);
      END_STATE();
    case 14:
      if (lookahead == 'o') ADVANCE(10);
      END_STATE();
    case 15:
      if (lookahead == 'o') ADVANCE(9);
      END_STATE();
    case 16:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(26);
      END_STATE();
    case 17:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 18:
      ACCEPT_TOKEN(sym_hash_bang_line);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(18);
      END_STATE();
    case 19:
      ACCEPT_TOKEN(anon_sym_local);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(anon_sym_global);
      END_STATE();
    case 21:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 22:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 23:
      ACCEPT_TOKEN(sym_identifier);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(23);
      END_STATE();
    case 24:
      ACCEPT_TOKEN(sym_string);
      if (lookahead == '"') ADVANCE(24);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(2);
      END_STATE();
    case 25:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(16);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(25);
      END_STATE();
    case 26:
      ACCEPT_TOKEN(sym_number);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(26);
      END_STATE();
    case 27:
      ACCEPT_TOKEN(anon_sym_DASH_DASH);
      if (lookahead == '[') ADVANCE(5);
      END_STATE();
    case 28:
      ACCEPT_TOKEN(anon_sym_DASH_DASH);
      if (lookahead == '[') ADVANCE(31);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(32);
      END_STATE();
    case 29:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '-') ADVANCE(30);
      if (lookahead == '\t' ||
          lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(29);
      if (lookahead != 0 &&
          (lookahead < '\t' || '\r' < lookahead)) ADVANCE(32);
      END_STATE();
    case 30:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '-') ADVANCE(28);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(32);
      END_STATE();
    case 31:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '[') ADVANCE(34);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(32);
      END_STATE();
    case 32:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(32);
      END_STATE();
    case 33:
      ACCEPT_TOKEN(anon_sym_DASH_DASH_LBRACK_LBRACK);
      END_STATE();
    case 34:
      ACCEPT_TOKEN(anon_sym_DASH_DASH_LBRACK_LBRACK);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(32);
      END_STATE();
    case 35:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      END_STATE();
    case 36:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      if (lookahead == '-') ADVANCE(27);
      END_STATE();
    case 37:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      if (lookahead == '-') ADVANCE(36);
      if (lookahead == ']') ADVANCE(38);
      if (lookahead == '\t' ||
          (0x0b <= lookahead && lookahead <= '\r') ||
          lookahead == ' ') ADVANCE(37);
      if (lookahead != 0 &&
          (lookahead < '\t' || '\r' < lookahead)) ADVANCE(35);
      END_STATE();
    case 38:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      if (lookahead == ']') ADVANCE(39);
      END_STATE();
    case 39:
      ACCEPT_TOKEN(anon_sym_RBRACK_RBRACK);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 0},
  [3] = {.lex_state = 0},
  [4] = {.lex_state = 0},
  [5] = {.lex_state = 0},
  [6] = {.lex_state = 0},
  [7] = {.lex_state = 0},
  [8] = {.lex_state = 0},
  [9] = {.lex_state = 0},
  [10] = {.lex_state = 0},
  [11] = {.lex_state = 0},
  [12] = {.lex_state = 0},
  [13] = {.lex_state = 1},
  [14] = {.lex_state = 0},
  [15] = {.lex_state = 1},
  [16] = {.lex_state = 0},
  [17] = {.lex_state = 0},
  [18] = {.lex_state = 0},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 0},
  [21] = {.lex_state = 1},
  [22] = {.lex_state = 1},
  [23] = {.lex_state = 0},
  [24] = {.lex_state = 3},
  [25] = {.lex_state = 0},
  [26] = {.lex_state = 29},
  [27] = {.lex_state = 3},
  [28] = {.lex_state = 0},
  [29] = {(TSStateId)(-1)},
  [30] = {(TSStateId)(-1)},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [sym_comment] = STATE(0),
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym_hash_bang_line] = ACTIONS(1),
    [anon_sym_local] = ACTIONS(1),
    [anon_sym_global] = ACTIONS(1),
    [anon_sym_EQ] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [sym_string] = ACTIONS(1),
    [sym_number] = ACTIONS(1),
    [anon_sym_DASH_DASH] = ACTIONS(3),
    [anon_sym_DASH_DASH_LBRACK_LBRACK] = ACTIONS(5),
    [anon_sym_RBRACK_RBRACK] = ACTIONS(1),
  },
  [1] = {
    [sym_source_file] = STATE(28),
    [sym__statement] = STATE(12),
    [sym_assignment_statement] = STATE(19),
    [sym_comment] = STATE(1),
    [aux_sym_source_file_repeat1] = STATE(4),
    [ts_builtin_sym_end] = ACTIONS(7),
    [sym_hash_bang_line] = ACTIONS(9),
    [anon_sym_local] = ACTIONS(11),
    [anon_sym_global] = ACTIONS(11),
    [anon_sym_DASH_DASH] = ACTIONS(3),
    [anon_sym_DASH_DASH_LBRACK_LBRACK] = ACTIONS(5),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 8,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(13), 1,
      ts_builtin_sym_end,
    STATE(2), 1,
      sym_comment,
    STATE(5), 1,
      aux_sym_source_file_repeat1,
    STATE(12), 1,
      sym__statement,
    STATE(19), 1,
      sym_assignment_statement,
    ACTIONS(11), 2,
      anon_sym_local,
      anon_sym_global,
  [26] = 8,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(15), 1,
      ts_builtin_sym_end,
    STATE(2), 1,
      aux_sym_source_file_repeat1,
    STATE(3), 1,
      sym_comment,
    STATE(12), 1,
      sym__statement,
    STATE(19), 1,
      sym_assignment_statement,
    ACTIONS(11), 2,
      anon_sym_local,
      anon_sym_global,
  [52] = 8,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(15), 1,
      ts_builtin_sym_end,
    STATE(4), 1,
      sym_comment,
    STATE(5), 1,
      aux_sym_source_file_repeat1,
    STATE(12), 1,
      sym__statement,
    STATE(19), 1,
      sym_assignment_statement,
    ACTIONS(11), 2,
      anon_sym_local,
      anon_sym_global,
  [78] = 7,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(17), 1,
      ts_builtin_sym_end,
    STATE(12), 1,
      sym__statement,
    STATE(19), 1,
      sym_assignment_statement,
    ACTIONS(19), 2,
      anon_sym_local,
      anon_sym_global,
    STATE(5), 2,
      sym_comment,
      aux_sym_source_file_repeat1,
  [102] = 5,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(24), 1,
      anon_sym_COMMA,
    STATE(6), 2,
      sym_comment,
      aux_sym__expression_list_repeat1,
    ACTIONS(22), 3,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
  [121] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(29), 1,
      anon_sym_COMMA,
    STATE(6), 1,
      aux_sym__expression_list_repeat1,
    STATE(7), 1,
      sym_comment,
    ACTIONS(27), 3,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
  [142] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(29), 1,
      anon_sym_COMMA,
    STATE(7), 1,
      aux_sym__expression_list_repeat1,
    STATE(8), 1,
      sym_comment,
    ACTIONS(31), 3,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
  [163] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(9), 1,
      sym_comment,
    ACTIONS(22), 4,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
      anon_sym_COMMA,
  [179] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(10), 1,
      sym_comment,
    ACTIONS(33), 4,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
      anon_sym_COMMA,
  [195] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(8), 1,
      sym__expression,
    STATE(11), 1,
      sym_comment,
    STATE(18), 1,
      sym__expression_list,
    ACTIONS(35), 2,
      sym_string,
      sym_number,
  [215] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(12), 1,
      sym_comment,
    ACTIONS(37), 3,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
  [230] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(39), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(41), 1,
      aux_sym_comment_token2,
    ACTIONS(43), 1,
      anon_sym_RBRACK_RBRACK,
    STATE(13), 1,
      sym_comment,
    STATE(15), 1,
      aux_sym_comment_repeat1,
  [249] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(45), 1,
      anon_sym_EQ,
    ACTIONS(47), 1,
      anon_sym_COMMA,
    STATE(14), 1,
      sym_comment,
    STATE(16), 1,
      aux_sym__identifier_list_repeat1,
  [268] = 5,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(39), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(49), 1,
      aux_sym_comment_token2,
    ACTIONS(52), 1,
      anon_sym_RBRACK_RBRACK,
    STATE(15), 2,
      sym_comment,
      aux_sym_comment_repeat1,
  [285] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(47), 1,
      anon_sym_COMMA,
    ACTIONS(54), 1,
      anon_sym_EQ,
    STATE(16), 1,
      sym_comment,
    STATE(17), 1,
      aux_sym__identifier_list_repeat1,
  [304] = 5,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(56), 1,
      anon_sym_EQ,
    ACTIONS(58), 1,
      anon_sym_COMMA,
    STATE(17), 2,
      sym_comment,
      aux_sym__identifier_list_repeat1,
  [321] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(18), 1,
      sym_comment,
    ACTIONS(61), 3,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
  [336] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(19), 1,
      sym_comment,
    ACTIONS(63), 3,
      ts_builtin_sym_end,
      anon_sym_local,
      anon_sym_global,
  [351] = 5,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(9), 1,
      sym__expression,
    STATE(20), 1,
      sym_comment,
    ACTIONS(35), 2,
      sym_string,
      sym_number,
  [368] = 6,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(39), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(41), 1,
      aux_sym_comment_token2,
    ACTIONS(65), 1,
      anon_sym_RBRACK_RBRACK,
    STATE(13), 1,
      aux_sym_comment_repeat1,
    STATE(21), 1,
      sym_comment,
  [387] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(39), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(22), 1,
      sym_comment,
    ACTIONS(67), 2,
      aux_sym_comment_token2,
      anon_sym_RBRACK_RBRACK,
  [401] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    STATE(23), 1,
      sym_comment,
    ACTIONS(56), 2,
      anon_sym_EQ,
      anon_sym_COMMA,
  [415] = 5,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(69), 1,
      sym_identifier,
    STATE(24), 1,
      sym_comment,
    STATE(25), 1,
      sym__identifier_list,
  [431] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(71), 1,
      anon_sym_EQ,
    STATE(25), 1,
      sym_comment,
  [444] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(39), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(65), 1,
      aux_sym_comment_token1,
    STATE(26), 1,
      sym_comment,
  [457] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(73), 1,
      sym_identifier,
    STATE(27), 1,
      sym_comment,
  [470] = 4,
    ACTIONS(3), 1,
      anon_sym_DASH_DASH,
    ACTIONS(5), 1,
      anon_sym_DASH_DASH_LBRACK_LBRACK,
    ACTIONS(75), 1,
      ts_builtin_sym_end,
    STATE(28), 1,
      sym_comment,
  [483] = 1,
    ACTIONS(77), 1,
      ts_builtin_sym_end,
  [487] = 1,
    ACTIONS(79), 1,
      ts_builtin_sym_end,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 26,
  [SMALL_STATE(4)] = 52,
  [SMALL_STATE(5)] = 78,
  [SMALL_STATE(6)] = 102,
  [SMALL_STATE(7)] = 121,
  [SMALL_STATE(8)] = 142,
  [SMALL_STATE(9)] = 163,
  [SMALL_STATE(10)] = 179,
  [SMALL_STATE(11)] = 195,
  [SMALL_STATE(12)] = 215,
  [SMALL_STATE(13)] = 230,
  [SMALL_STATE(14)] = 249,
  [SMALL_STATE(15)] = 268,
  [SMALL_STATE(16)] = 285,
  [SMALL_STATE(17)] = 304,
  [SMALL_STATE(18)] = 321,
  [SMALL_STATE(19)] = 336,
  [SMALL_STATE(20)] = 351,
  [SMALL_STATE(21)] = 368,
  [SMALL_STATE(22)] = 387,
  [SMALL_STATE(23)] = 401,
  [SMALL_STATE(24)] = 415,
  [SMALL_STATE(25)] = 431,
  [SMALL_STATE(26)] = 444,
  [SMALL_STATE(27)] = 457,
  [SMALL_STATE(28)] = 470,
  [SMALL_STATE(29)] = 483,
  [SMALL_STATE(30)] = 487,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = false}}, SHIFT(26),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(21),
  [7] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 0, 0, 0),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [11] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [13] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 2, 0, 0),
  [15] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 1, 0, 0),
  [17] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0),
  [19] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(24),
  [22] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym__expression_list_repeat1, 2, 0, 0),
  [24] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__expression_list_repeat1, 2, 0, 0), SHIFT_REPEAT(20),
  [27] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__expression_list, 2, 0, 0),
  [29] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [31] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__expression_list, 1, 0, 0),
  [33] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__expression, 1, 0, 0),
  [35] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [37] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 1, 0, 0),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(21),
  [41] = {.entry = {.count = 1, .reusable = false}}, SHIFT(22),
  [43] = {.entry = {.count = 1, .reusable = false}}, SHIFT(29),
  [45] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__identifier_list, 1, 0, 0),
  [47] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [49] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2, 0, 0), SHIFT_REPEAT(22),
  [52] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2, 0, 0),
  [54] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__identifier_list, 2, 0, 0),
  [56] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym__identifier_list_repeat1, 2, 0, 0),
  [58] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__identifier_list_repeat1, 2, 0, 0), SHIFT_REPEAT(27),
  [61] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assignment_statement, 4, 0, 0),
  [63] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__statement, 1, 0, 0),
  [65] = {.entry = {.count = 1, .reusable = false}}, SHIFT(30),
  [67] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 1, 0, 0),
  [69] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [71] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [73] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [75] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [77] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 3, 0, 0),
  [79] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 2, 0, 0),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef TREE_SITTER_HIDE_SYMBOLS
#define TS_PUBLIC
#elif defined(_WIN32)
#define TS_PUBLIC __declspec(dllexport)
#else
#define TS_PUBLIC __attribute__((visibility("default")))
#endif

TS_PUBLIC const TSLanguage *tree_sitter_nelua(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
