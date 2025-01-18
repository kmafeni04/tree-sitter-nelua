/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
//
// TODO: Fields, methods, indexing

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
 * @param {string} char
 */
const repeat_w_char = (rule, char) => {
  return seq(rule, repeat(seq(char, rule)));
};

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

    variable_list: ($) => repeat_w_char($._variable, ","),

    _variable: ($) =>
      seq(
        choice($.identifier, $.vararg_expression),
        optional(seq(":", $.type)),
      ),

    return_statement: ($) => seq("return", $.expression_list),

    function_definition: ($) =>
      seq(
        "function",
        $.identifier,
        "(",
        optional(repeat_w_char(alias($._variable, $.parameter), ",")),
        ")",
        optional(
          seq(
            ":",
            alias(
              choice($.type, seq("(", repeat_w_char($.type, ","), ")")),
              $.return_type,
            ),
          ),
        ),
        optional($.function_body),
        "end",
      ),
    function_body: ($) => repeat1($._statement),

    expression_list: ($) => repeat_w_char($._expression, ","),

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
        $.array,
        $.function_call,
        seq("(", $._expression, ")"),
      ),

    function_call: ($) =>
      seq($.identifier, "(", repeat_w_char($._expression, ","), ")"),

    vararg_expression: () => "...",

    array: ($) => seq("{", repeat_w_char($._expression, ","), "}"),

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

    identifier: () => /[a-zA-Z_]\w*/,

    at_type: ($) => seq("@", $.type),
    type: ($) =>
      prec.left(
        choice(
          $.identifier,
          seq($.identifier, "(", repeat_w_char($.type, ","), ")"),
          $.array_type,
          $.record,
          $.union,
          $.enum,
        ),
      ),
    array_type: ($) =>
      seq(repeat1(seq("[", optional($._expression), "]")), $.type),
    record: ($) =>
      seq("record", "{", optional(repeat_w_char($.record_field, ",")), "}"),
    record_field: ($) =>
      prec.left(seq($.identifier, ":", $.type, optional(","))),
    union: ($) =>
      seq("union", "{", optional(repeat_w_char($.union_field, ",")), "}"),
    union_field: ($) =>
      prec.left(seq($.identifier, ":", $.type, optional(","))),
    enum: ($) =>
      seq(
        "enum",
        optional(seq("(", $.type, ")")),
        "{",
        repeat_w_char($.enum_field, ","),
        "}",
      ),
    enum_field: ($) =>
      prec.left(seq($.identifier, optional(seq("=", $.number, optional(","))))),

    string: ($) => choice($._singleline_string, $._multiline_string),

    _singleline_string: ($) =>
      choice(
        seq('"', repeat(choice(/[^\\]/, $.escape_sequence)), '"'),
        seq("'", repeat(choice(/[^\\]/, $.escape_sequence)), "'"),
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
