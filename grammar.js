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
        $.assignment_statement,
        $.return_statement,
        $.function_definition,
        $.function_call,
        $.declaration,
      ),

    declaration: ($) =>
      seq(
        choice("local", "global"),
        choice($.assignment_statement, $.function_definition, $.variable_list),
      ),

    assignment_statement: ($) => seq($.variable_list, "=", $.expression_list),

    variable_list: ($) => list_seq($._variable, ","),

    _variable: ($) =>
      prec.left(
        3,
        seq(
          choice($.identifier, $.dot_variable, $.bracket_index_expression),
          optional(seq(":", $.type)),
        ),
      ),

    return_statement: ($) => seq("return", $.expression_list),

    function_definition: ($) =>
      seq(
        "function",
        choice($.identifier, $.dot_field, $.method_field),
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
        optional($.function_body),
        "end",
      ),
    function_body: ($) => repeat1($._statement),

    expression_list: ($) => list_seq($._expression, ","),

    _expression: ($) =>
      choice(
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

    parenthesized_expression: ($) => choice(seq("(", $._expression, ")")),

    function_call: ($) =>
      prec(
        1,
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
    _binary_op_left: () =>
      choice(
        prec(PREC.OR, "or"),
        prec(PREC.AND, "and"),
        prec(PREC.COMPARE, "<"),
        prec(PREC.COMPARE, "<="),
        prec(PREC.COMPARE, "=="),
        prec(PREC.COMPARE, "~="),
        prec(PREC.COMPARE, ">="),
        prec(PREC.COMPARE, ">"),
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
    _binary_op_right: () =>
      choice(prec(PREC.CONCAT, ".."), prec(PREC.POWER, "^")),

    unary_expression: ($) =>
      prec.left(
        PREC.UNARY,
        seq(choice("not", "#", "-", "~", "$", "&"), $._expression),
      ),

    _prefix_expression: ($) =>
      prec(
        2,
        choice($.identifier, $.function_call, $.parenthesized_expression),
      ),
    _prefix_no_call_expression: ($) =>
      prec(
        1,
        choice(
          $.identifier,
          $.bracket_index_expression,
          $.parenthesized_expression,
        ),
      ),

    bracket_index_expression: ($) =>
      seq($._prefix_expression, "[", $._expression, "]"),
    dot_field: ($) => seq($._prefix_expression, ".", $.identifier),
    dot_variable: ($) => seq($._prefix_no_call_expression, ".", $.identifier),
    method_field: ($) => seq($._prefix_expression, ":", $.identifier),

    identifier: () => /[a-zA-Z_]\w*/,

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
          seq($.identifier, "(", list_seq($.type, ","), ")"),
          $.array_type,
          $.record,
          $.union,
          $.enum,
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
