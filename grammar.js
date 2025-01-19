/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
//

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

/**
 * @param {RuleOrLiteral} rule
 * @param {string} separator
 */
const list_seq = (rule, separator, trailing_separator = false) =>
  trailing_separator
    ? seq(rule, repeat(seq(separator, rule)), optional(separator))
    : seq(rule, repeat(seq(separator, rule)));

module.exports = grammar({
  name: "nelua",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [[$.array_type, $.array_type]],

  rules: {
    source_file: ($) => seq(optional($.hash_bang), repeat($._statement)),

    hash_bang: (_) => /#[^#].*/,

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
      ),

    preproc_statement: ($) =>
      choice(
        seq("##", alias(/.*/, $.preproc_statement_content)),
        seq("##[[", alias(repeat(/./), $.preproc_statement_content), "]]"),
        seq("##[=[", alias(repeat(/./), $.preproc_statement_content), "]=]"),
        seq("##[==[", alias(repeat(/./), $.preproc_statement_content), "]==]"),
        seq(
          "##[===[",
          alias(repeat(/./), $.preproc_statement_content),
          "]===]",
        ),
      ),

    defer_statement: ($) => seq("defer", repeat($._statement), "end"),

    goto_statement: ($) => seq("goto", $.identifier),
    goto_location: ($) => seq("::", $.identifier, "::"),

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
          "do",
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

    variable_list: ($) => list_seq(seq($._variable), ","),

    _variable: ($) =>
      prec.left(
        2,
        seq(
          choice($.identifier, $.dot_variable, $.bracket_index_expression),
          optional(seq(":", $.type)),
          optional($.annotation),
        ),
      ),

    return_statement: ($) => seq("return", $.expression_list),

    function_definition: ($) =>
      prec(
        2,
        seq(
          "function",
          choice($.identifier, $.dot_variable, $.method_field),
          "(",
          optional(
            list_seq(
              seq(
                alias(choice($.identifier, $.vararg_expression), $.parameter),
                optional(seq(":", $.type)),
              ),
              ",",
            ),
          ),
          ")",
          optional(seq(":", optional(seq(":", $.return_type)))),
          optional($.annotation),
          optional($.function_body),
          "end",
        ),
      ),
    return_type: ($) => choice($.type, seq("(", list_seq($.type, ","), ")")),
    function_body: ($) => repeat1($._statement),

    expression_list: ($) => list_seq($._expression, ","),

    _expression: ($) =>
      choice(
        $.preproc_expression,
        $.identifier,
        $.string,
        $.number,
        $.nil,
        $.nilptr,
        $.boolean,
        $.binary_expression,
        $.unary_expression,
        $.vararg_expression,
        $.at_type,
        $.cast_type,
        $._table_constructor,
        $.parenthesized_expression,
        $.function_call,
        $.dot_field,
        $.bracket_index_expression,
      ),

    preproc_expression: ($) =>
      choice(
        seq("#[", alias(repeat(/./), $.preproc_expression_content), "]#"),
        seq("#|", alias(repeat(/./), $.preproc_expression_content), "|#"),
      ),

    parenthesized_expression: ($) => choice(seq("(", $._expression, ")")),

    function_call: ($) =>
      prec(
        3,
        seq(
          choice($.identifier, $.dot_field, $.method_field),
          choice(
            seq("(", optional($.expression_list), ")"),
            $.string,
            $._table_constructor,
          ),
        ),
      ),

    vararg_expression: () => "...",

    _table_constructor: ($) =>
      seq(
        "{",
        choice(
          alias(list_seq($._expression, ","), $.array),
          list_seq($.initializer, ","),
        ),
        "}",
      ),
    initializer: ($) =>
      prec.left(choice($._expression, seq($.identifier, "=", $._expression))),

    binary_expression: ($) =>
      choice(
        prec.left(seq($._expression, $._binary_op_left, $._expression)),
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
      prec(
        1,
        choice(
          $.identifier,
          $.bracket_index_expression,
          $.parenthesized_expression,
          $.function_call,
        ),
      ),
    _prefix_no_call_expression: ($) =>
      prec(
        2,
        choice(
          $.identifier,
          $.bracket_index_expression,
          $.parenthesized_expression,
        ),
      ),

    bracket_index_expression: ($) =>
      seq($._prefix_expression, "[", $._expression, "]"),
    dot_field: ($) => seq($._prefix_expression, ".", $.identifier),
    dot_variable: ($) =>
      prec(1, seq($._prefix_no_call_expression, ".", $.identifier)),
    method_field: ($) => seq($._prefix_expression, ":", $.identifier),

    identifier: () => /[a-zA-Z_][\w_]*/,

    annotation: ($) =>
      seq(
        "<",
        repeat1(seq(list_seq(choice($.identifier, $.function_call), ","))),
        ">",
      ),

    cast_type: ($) =>
      prec(
        1,
        seq(
          "(",
          $.at_type,
          ")",
          choice(
            $._table_constructor,
            $.string,
            seq("(", optional($._expression), ")"),
          ),
        ),
      ),
    at_type: ($) => seq("@", $.type),
    type: ($) =>
      prec.left(
        choice(
          $.identifier,
          prec(1, seq($.identifier, "(", list_seq($.type, ","), ")")),
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
        optional(list_seq(alias($._variable, $.parameter), ",")),
        ")",
        optional(
          seq(
            ":",
            alias(
              choice($.type, seq("(", list_seq($.type, ","), ")")),
              $.return_type,
            ),
          ),
        ),
      ),
    array_type: ($) =>
      seq(repeat1(seq("[", optional($._expression), "]")), $.type),
    record: ($) =>
      seq("record", "{", optional(list_seq($.record_field, ",", true)), "}"),
    record_field: ($) => prec.left(seq($.identifier, ":", $.type)),
    union: ($) =>
      seq("union", "{", optional(list_seq($.union_field, ",", true)), "}"),
    union_field: ($) => prec.left(seq($.identifier, ":", $.type)),
    enum: ($) =>
      seq(
        "enum",
        optional(seq("(", $.type, ")")),
        "{",
        list_seq($.enum_field, ",", true),
        "}",
      ),
    enum_field: ($) =>
      prec.left(seq($.identifier, optional(seq("=", $.number)))),

    string: ($) => choice($._singleline_string, $._multiline_string),

    _singleline_string: ($) =>
      choice(
        seq(
          '"',
          repeat(choice(token.immediate(prec(1, /[^"\\]/)), $.escape_sequence)),
          '"',
        ),
        seq(
          "'",
          repeat(choice(token.immediate(prec(1, /[^'\\]/)), $.escape_sequence)),
          "'",
        ),
      ),

    _multiline_string: ($) =>
      choice(
        seq("[[", repeat(choice(/[^\\]/, $.escape_sequence)), "]]"),
        seq("[=[", repeat(choice(/[^\\]/, $.escape_sequence)), "]=]"),
        seq("[==[", repeat(choice(/[^\\]/, $.escape_sequence)), "]==]"),
        seq("[===[", repeat(choice(/[^\\]/, $.escape_sequence)), "]===]"),
      ),

    nil: () => "nil",
    nilptr: () => "nilptr",

    boolean: ($) => choice($._false, $._true),
    _true: () => "true",
    _false: () => "false",

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

    number: (_) =>
      choice(
        /\d/,
        /\d+/,
        /[+-]?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/,
        /\d\d*\.\d+/,
        /0b[01]+/,
        /0x[0-9A-Fa-f]+/,
        /0x[0-9A-Fa-f]+\.[0-9A-Fa-f]+p[+-]?\d+/,
        /\d+_\a+/,
        /'[a-zA-z]'_\w+/,
      ),

    comment: ($) =>
      choice(
        seq("--", alias(/[^\r\n]*/, $.comment_body)),
        seq("--[[", alias(/[^⊙]*/, $.comment_body), "]]"),
        seq("--[=[", alias(/[^⊙]*/, $.comment_body), "]=]"),
        seq("--[==[", alias(/[^⊙]*/, $.comment_body), "]==]"),
        seq("--[===[", alias(/[^⊙]*/, $.comment_body), "]===]"),
      ),
  },
});
