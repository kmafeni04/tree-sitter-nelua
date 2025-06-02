/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  OR: 1, // or
  AND: 2, // and
  COMPARE: 3, // < > <= >= ~= ==
  BIT_OR: 4, // |
  BIT_NOT: 5, // ~
  BIT_AND: 6, // &
  BIT_SHIFT: 7, // << >> >>>
  CONCAT: 8, // ..
  PLUS: 9, // + -
  MULTI: 10, // * / // /// % %%%
  UNARY: 11, // not # - ~ $ &
  POWER: 12, // ^
};

const EXPR_PREC = {
  EXPR: 1,
  FUNC_CALL: 2,
  PREFIX: 2,
  TYPE: 2,
  CAST_TYPE: 2,
  VARIABLE: 2,
  SUB_TYPE: 3, // Allows subtypes to be recognized e.g sequence(hashmap(string, string))
  FUNC_DEF: 3,
  PREFIX_NO_CALL: 3,
};

/**
 * @param {RuleOrLiteral} rule
 * @param {string | RuleOrLiteral} separator
 */
const list_seq = (rule, separator, trailing_separator = false) =>
  trailing_separator
    ? seq(rule, repeat(seq(separator, rule)), optional(separator))
    : seq(rule, repeat(seq(separator, rule)));

module.exports = grammar({
  name: "nelua",

  externals: ($) => [
    $._block_comment_start,
    $._block_comment_char,
    $._block_comment_end,

    $._block_preproc_stmt_start,
    $._block_preproc_stmt_char,
    $._block_preproc_stmt_end,

    $._short_string_start,
    $._short_string_char,
    $._short_string_end,

    $._block_string_start,
    $._block_string_char,
    $._block_string_end,
  ],

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.array_type, $.array_type],
    [$._variable, $._prefix_expression],
    [$.type, $._prefix_expression],
  ],

  rules: {
    source_file: ($) => seq(optional($.hash_bang), repeat($._statement)),

    hash_bang: (_) => /#!.*/,

    _statement: ($) =>
      choice(
        $.preproc_statement,
        $.assignment_statement,
        $.return_statement,
        $.function_definition,
        $.function_call,
        $.declaration,
        $.do_block,
        $.if_statement,
        $.switch_statement,
        $.defer_statement,
        $.goto_statement,
        $.goto_location,
        $.return_statement,
        $.for_statement,
        $.while_statement,
        $.continue,
        $.repeat_statement,
        $.fallthrough,
        $.break,
        $.injection_statement,
        ";",
      ),

    preproc_statement: ($) =>
      choice(
        seq("##", alias(/.*/, $.preproc_statement_content)),
        seq(
          $._block_preproc_stmt_start,
          optional(
            alias(
              repeat1($._block_preproc_stmt_char),
              $.preproc_statement_content,
            ),
          ),
          $._block_preproc_stmt_end,
        ),
      ),

    defer_statement: ($) => seq("defer", repeat($._statement), "end"),

    goto_statement: ($) => seq("goto", $._identifier),
    goto_location: ($) => seq("::", $._identifier, "::"),

    continue: (_) => "continue",
    fallthrough: (_) => "fallthrough",
    break: (_) => "break",

    injection_statement: ($) => seq("in", $.expression_list),

    if_statement: ($) =>
      prec.left(
        seq(
          "if",
          $._expression,
          "then",
          repeat($._statement),
          repeat($.elseif),
          optional($.else),
          "end",
        ),
      ),
    elseif: ($) => seq("elseif", $._expression, "then", repeat($._statement)),
    else: ($) => seq("else", repeat($._statement)),

    switch_statement: ($) =>
      prec.left(
        seq(
          "switch",
          $._expression,
          optional("do"),
          repeat($.switch_case),
          optional($.switch_else),
          "end",
        ),
      ),
    switch_case: ($) =>
      prec.left(seq("case", $.expression_list, "then", repeat($._statement))),
    switch_else: ($) => prec.left(seq("else", repeat($._statement))),

    while_statement: ($) =>
      seq("while", $._expression, "do", repeat($._statement), "end"),

    repeat_statement: ($) =>
      seq("repeat", repeat($._statement), "until", $._expression),

    for_statement: ($) =>
      seq(
        "for",
        choice($.for_num, $.for_in),
        "do",
        repeat($._statement),
        "end",
      ),
    for_num: ($) =>
      seq(
        $._variable,
        "=",
        list_seq(
          seq(optional(alias($._comparison_op, $.exclusive_op)), $._expression),
          ",",
        ),
      ),
    for_in: ($) => seq($.variable_list, "in", $._expression),

    do_block: ($) => seq("do", repeat($._statement), "end"),

    declaration: ($) =>
      seq(
        choice("local", "global"),
        choice($.assignment_statement, $.function_definition, $.variable_list),
      ),

    assignment_statement: ($) => seq($.variable_list, "=", $.expression_list),

    variable_list: ($) =>
      list_seq(
        seq($._variable, optional(seq(":", $.type)), optional($.annotation)),
        ",",
      ),

    _variable: ($) =>
      prec.left(
        EXPR_PREC.VARIABLE,
        seq(
          optional(choice("$", "&")),
          choice(
            $._identifier,
            $.dot_variable,
            $.bracket_index_expression,
            $.cast_type,
            $.parenthesized_expression,
          ),
        ),
      ),

    return_statement: ($) =>
      prec.right(seq("return", optional($.expression_list))),

    function_definition: ($) =>
      prec(
        EXPR_PREC.FUNC_DEF,
        seq(
          "function",
          choice($._identifier, $.dot_variable, $.method_field),
          "(",
          optional(
            list_seq(
              seq(
                alias(choice($._identifier, $.vararg_expression), $.parameter),
                optional(seq(":", $.type)),
                optional($.annotation),
              ),
              ",",
            ),
          ),
          ")",
          optional(seq(":", $.return_type)),
          optional($.annotation),
          optional($.function_body),
          "end",
        ),
      ),
    return_type: ($) => choice($.type, seq("(", list_seq($.type, ","), ")")),
    function_body: ($) => repeat1($._statement),

    expression_list: ($) => list_seq($._expression, ","),

    _expression: ($) =>
      prec(
        EXPR_PREC.EXPR,
        choice(
          $._identifier,
          $.string,
          $.anon_function,
          $.number,
          $.nil,
          $.nilptr,
          $.boolean,
          $.binary_expression,
          $.unary_expression,
          $.vararg_expression,
          $.at_type,
          $.cast_type,
          $.curly_brace_expression,
          $.parenthesized_expression,
          $.function_call,
          $.dot_field,
          $.dot_variable,
          $.bracket_index_expression,
        ),
      ),

    preproc_expression: ($) =>
      choice(
        seq("#[", alias(repeat(/./), $.preproc_expression_content), "]#"),
        seq("#|", alias(repeat(/./), $.preproc_expression_content), "|#"),
      ),

    parenthesized_expression: ($) =>
      choice(seq("(", choice($._expression, $.do_block), ")")),

    anon_function: ($) =>
      seq(
        "function",
        "(",
        optional(
          list_seq(
            seq(
              alias(choice($._identifier, $.vararg_expression), $.parameter),
              optional(seq(":", $.type)),
            ),
            ",",
          ),
        ),
        ")",
        optional(seq(":", $.return_type)),
        optional($.function_body),
        "end",
      ),

    function_call: ($) =>
      prec(
        EXPR_PREC.FUNC_CALL,
        seq(
          choice(
            choice($._prefix_expression, $.method_field),
            alias(/[a-zA-Z_][\w_]*!/, $.preproc_expression),
          ),
          choice(
            seq("(", optional($.expression_list), ")"),
            $.string,
            $.curly_brace_expression,
          ),
        ),
      ),

    vararg_expression: () => "...",

    curly_brace_expression: ($) =>
      seq(
        "{",
        choice(
          list_seq($._expression, choice(",", ";")),
          list_seq(seq($._identifier, "=", $._expression), choice(",", ";")),
        ),
        "}",
      ),

    binary_expression: ($) =>
      choice(
        prec.left(1, seq($._expression, $._binary_op_left, $._expression)),
        prec.right(seq($._expression, $._binary_op_right, $._expression)),
      ),
    _binary_op_left: ($) =>
      choice(
        prec(PREC.OR, "or"),
        prec(PREC.AND, "and"),
        $._comparison_op,
        prec(PREC.BIT_OR, "|"),
        prec(PREC.BIT_NOT, "~"),
        prec(PREC.BIT_AND, "&"),
        prec(PREC.BIT_SHIFT, "<<"),
        prec(PREC.BIT_SHIFT, ">>"),
        prec(PREC.BIT_SHIFT, ">>>"),
        prec(PREC.PLUS, "+"),
        prec(PREC.PLUS, "-"),
        prec(PREC.MULTI, "*"),
        prec(PREC.MULTI, "/"),
        prec(PREC.MULTI, "//"),
        prec(PREC.MULTI, "///"),
        prec(PREC.MULTI, "%"),
        prec(PREC.MULTI, "%%%"),
      ),
    _comparison_op: (_) =>
      choice(
        prec(PREC.COMPARE, "<"),
        prec(PREC.COMPARE, "<="),
        prec(PREC.COMPARE, "=="),
        prec(PREC.COMPARE, "~="),
        prec(PREC.COMPARE, ">="),
        prec(PREC.COMPARE, ">"),
      ),
    _binary_op_right: () =>
      choice(prec(PREC.CONCAT, ".."), prec(PREC.POWER, "^")),

    unary_expression: ($) =>
      prec.left(
        PREC.UNARY,
        seq(choice("not", "#", "-", "~", "$", "&"), $._expression),
      ),

    _prefix_expression: ($) =>
      prec.right(
        EXPR_PREC.PREFIX,
        choice(
          $._identifier,
          $.bracket_index_expression,
          $.parenthesized_expression,
          $.dot_variable,
          $.cast_type,
          seq("(", $.at_type, ")"),
          $.dot_field,
          $.function_call,
        ),
      ),
    _prefix_no_call_expression: ($) =>
      prec(
        EXPR_PREC.PREFIX_NO_CALL,
        choice(
          $._identifier,
          $.bracket_index_expression,
          $.parenthesized_expression,
          $.dot_variable,
          $.cast_type,
          seq("(", $.at_type, ")"),
        ),
      ),

    bracket_index_expression: ($) =>
      seq($._prefix_expression, "[", $._expression, "]"),
    dot_field: ($) =>
      seq($._prefix_expression, ".", alias($._identifier, $.field)),
    dot_variable: ($) =>
      seq($._prefix_no_call_expression, ".", alias($._identifier, $.field)),
    method_field: ($) =>
      seq($._prefix_expression, ":", alias($._identifier, $.field)),

    // Not sure where `preproc_expression` should actually be so added it here
    _identifier: ($) =>
      choice(alias(/[a-zA-Z_][\w_]*/, $.identifier), $.preproc_expression),

    annotation: ($) =>
      seq(
        "<",
        repeat1(seq(list_seq(choice($._identifier, $.function_call), ","))),
        ">",
      ),

    cast_type: ($) =>
      prec(
        EXPR_PREC.CAST_TYPE,
        seq(
          "(",
          $.at_type,
          ")",
          choice(
            $.curly_brace_expression,
            $.string,
            seq("(", optional($._expression), ")"),
          ),
        ),
      ),
    at_type: ($) => seq("@", $.type),
    type: ($) =>
      prec.right(
        EXPR_PREC.TYPE,
        choice(
          $._identifier,
          $.dot_variable,
          prec(
            EXPR_PREC.SUB_TYPE,
            seq(
              $._identifier,
              "(",
              list_seq(choice($.type, $._expression), ","),
              ")",
            ),
          ),
          $.array_type,
          $.record,
          $.union,
          $.enum,
          seq("*", $.type),
          $.function_type,
        ),
      ),
    function_type: ($) =>
      seq(
        "function",
        "(",
        optional(
          list_seq(
            choice(
              prec(
                2, // Allows for this to be preferred over the second choice
                seq(
                  alias(
                    choice($._identifier, $.vararg_expression),
                    $.parameter,
                  ),
                  ":",
                  $.type,
                ),
              ),
              $.type,
            ),
            ",",
          ),
        ),
        ")",
        optional(seq(":", $.return_type)),
      ),
    array_type: ($) =>
      seq(
        repeat1(seq("[", optional(choice($._identifier, $.number)), "]")),
        $.type,
      ),
    record: ($) =>
      seq(
        "record",
        "{",
        optional(list_seq($.record_field, choice(",", ";"), true)),
        "}",
      ),
    record_field: ($) => prec.left(seq($._identifier, ":", $.type)),
    union: ($) =>
      seq(
        "union",
        "{",
        optional(list_seq($.union_field, choice(",", ";"), true)),
        "}",
      ),
    union_field: ($) => prec.left(seq($._identifier, ":", $.type)),
    enum: ($) =>
      seq(
        "enum",
        optional(seq("(", $.type, ")")),
        "{",
        list_seq($.enum_field, choice(",", ";"), true),
        "}",
      ),
    enum_field: ($) =>
      prec.left(seq($._identifier, optional(seq("=", $.number)))),

    string: ($) => choice($._qouted_string, $._block_string),

    _qouted_string: ($) =>
      seq(
        $._short_string_start,
        repeat(choice($._short_string_char, $.escape_sequence)),
        $._short_string_end,
      ),
    _block_string: ($) =>
      seq(
        $._block_string_start,
        repeat($._block_string_char),
        $._block_string_end,
      ),

    escape_sequence: () =>
      token.immediate(
        seq(
          "\\",
          choice(
            /[\nabfnrtv\\'"]/,
            /z\s*/,
            /[0-9]{1,3}/,
            /x[0-9a-fA-F]{2}/,
            /u\{[0-9a-fA-F]+\}/,
          ),
        ),
      ),

    nil: () => "nil",
    nilptr: () => "nilptr",

    boolean: ($) => choice($._false, $._true),
    _true: () => "true",
    _false: () => "false",

    number: ($) =>
      choice(
        seq(
          choice(
            /\d/,
            /\d+/,
            /[+-]?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/,
            /\d\d*\.\d+/,
            /0[bB][01]+/,
            /0[xX][0-9A-Fa-f]+/,
            /0[xX][0-9A-Fa-f]+\.[0-9A-Fa-f]+p[+-]?\d+/,
            /\d+_\a+/,
          ),
          optional(token.immediate(seq("_", /\w+/))),
        ),
        seq(alias($._qouted_string, $.char), token.immediate(seq("_", /\w+/))),
      ),
    comment: ($) =>
      choice(
        seq("--", alias(/[^\r\n]*/, $.comment_body)),
        seq(
          $._block_comment_start,
          optional(alias(repeat1($._block_comment_char), $.comment_body)),
          $._block_comment_end,
        ),
      ),
  },
});
