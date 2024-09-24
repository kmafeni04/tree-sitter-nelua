/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  func: 5,
};

module.exports = grammar({
  name: "nelua",

  extras: ($) => [$.comment, /\s/],

  conflicts: ($) => [
    [$._statement, $._expression],
    [$.identifier, $._expression],
    [$.expression_list, $.unary_expression],
    [$.expression_list, $.math_expression],
    [$.math_expression, $.math_expression],
    [$.expression_list, $.concatenation_expression],
    [$.concatenation_expression, $.concatenation_expression],
    [$.concatenation_expression, $.math_expression],
    [$.expression_list, $.expression_list],
    [$.comparison_expression, $.comparison_expression],
    [$.type, $.dot_expression],
    [$.table_constructor, $.table_constructor],
    [$._expression, $.dot_expression],
    [$.variable_list, $._expression, $.dot_expression],
    [$.identifier, $.identifier],
    [$._expression, $.assignment_statement],
    [$._unary_operator, $._comparison_operator],
    [$.for_num, $.expression_list],
  ],

  rules: {
    source_file: ($) => seq(optional($.hash_bang_line), repeat($._statement)),

    hash_bang_line: (_) => /#[^#].*/,

    _statement: ($) =>
      choice(
        $.assignment_statement,
        $.variable_list,
        $.function_declaration,
        $.function_call,
        $.do_block,
        $.if_statement,
        $.switch_statement,
        $.defer_statement,
        $.goto_statement,
        $.goto_location,
        $.return_statement,
        $.for_statement,
        $.while_statement,
        $.continue_statement,
        $.repeat_statement,
        $.fallthrough_statement,
        $.break_statement,
        $.lua_statement,
        $.global_declaration,
        $.local_declaration,
        $.injection_statement,
      ),

    lua_statement: ($) =>
      choice(
        /##.*/,
        seq("##[[", alias(repeat(/./), $.lua_content), "]]"),
        seq("##[=[", alias(repeat(/./), $.lua_content), "]=]"),
        seq("##[==[", alias(repeat(/./), $.lua_content), "]==]"),
      ),

    local_declaration: ($) =>
      seq("local", choice($._statement, $.expression_list)),

    global_declaration: ($) =>
      seq("global", choice($._statement, $.expression_list)),

    return_statement: ($) =>
      seq("return", choice($._statement, $.expression_list)),

    defer_statement: ($) => seq("defer", repeat($._statement), "end"),

    goto_statement: ($) => seq("goto", $.identifier),
    goto_location: ($) => seq("::", $.identifier, "::"),

    continue_statement: (_) => "continue",
    fallthrough_statement: (_) => "fallthrough",
    break_statement: (_) => "break",

    injection_statement: ($) => seq("in", $.identifier),

    do_block: ($) => seq("do", optional(repeat($._statement)), "end"),

    if_statement: ($) =>
      prec.left(
        seq(
          "if",
          $._expression,
          "then",
          optional($._statement),
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
          $.expression_list,
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
        $.identifier,
        "=",
        $._expression,
        repeat1(seq(",", optional($._comparison_operator), $._expression)),
      ),
    for_in: ($) =>
      seq($.identifier, optional(seq(",", $.identifier)), "in", $._expression),

    assignment_statement: ($) =>
      seq(
        $.variable_list,
        "=",
        optional(seq("(", $.at_type, ")")),
        choice($.expression_list, $.at_type),
      ),

    variable_list: ($) =>
      prec.right(
        seq(
          choice($.identifier, $._typed_identifier),
          repeat(seq(",", choice($.identifier, $._typed_identifier))),
          optional($.annotation),
        ),
      ),

    type: ($) =>
      choice(
        seq(
          optional("*"),
          repeat(seq("[", optional($._expression), "]")),
          alias($.identifier, "type"),
        ),
        seq(
          "function",
          seq("(", optional(alias($._identifier_list, $.parameters)), ")"),
          optional(seq(":", alias($.type, $.return_type))),
        ),
        seq("span", "(", $.identifier, ")"),
        seq("type", "=", choice($.at_type, $.identifier)),
      ),
    at_type: ($) => seq("@", $.type),

    annotation: ($) =>
      seq(
        "<",
        repeat1(
          seq(
            choice($.identifier, $.function_call),
            optional(seq(",", choice($.identifier, $.function_call))),
          ),
        ),
        ">",
      ),

    function_declaration: ($) =>
      seq(
        "function",
        optional(
          seq($.identifier, repeat(seq(choice(":", "."), $.identifier))),
        ),
        seq(
          "(",
          optional(alias($._identifier_list, $.parameters)),
          optional($.annotation),
          ")",
        ),
        optional(seq(":", alias($.type, $.return_type))),
        optional($.annotation),
        $.function_body,
        "end",
      ),

    function_body: ($) => repeat1($._statement),

    function_call: ($) =>
      prec.left(
        PREC.func,
        choice(
          seq(
            choice($.identifier, $.builtin_function, $.function_call),
            choice(
              seq("(", optional($.arguments), ")"),
              alias($.string, $.argument),
            ),
          ),
          seq(
            $.identifier,
            repeat(seq(choice(".", ":"), $.identifier)),
            choice(
              seq("(", optional($.arguments), ")"),
              alias($.string, $.argument),
            ),
          ),
        ),
      ),
    arguments: ($) => alias($.expression_list, "arguments"),
    builtin_function: (_) =>
      choice(
        "require",
        "print",
        "panic",
        "error",
        "assert",
        "check",
        "likely",
        "unlikely",
        "ipairs",
        "mipairs",
        "next",
        "mnext",
        "pairs",
        "mpairs",
        "select",
        "tostring",
        "tostringview",
        "tonumber",
        "tointeger",
        "type",
        "new",
        "delete",
        "collectgarbage",
      ),

    expression_list: ($) =>
      prec.left(seq($._expression, repeat(seq(",", $._expression)))),
    _expression: ($) =>
      prec.right(
        choice(
          $.false,
          $.true,
          $.nil,
          $.string,
          $.number,
          $.identifier,
          $.function_call,
          $.function_declaration,
          $.record,
          $.table_constructor,
          $.comparison_expression,
          $.enum,
          $.dot_expression,
          $.union,
          $.unary_expression,
          $.math_expression,
          $.do_expression,
          $.concatenation_expression,
          $.lua_expression,
          $.at_type,
          seq("(", $._expression, ")"),
        ),
      ),

    do_expression: ($) => seq("(", "do", repeat($._statement), "end", ")"),

    lua_expression: ($) =>
      choice(
        seq("#[", alias(repeat(/./), $.lua_content), "]#"),
        seq("#|", alias(repeat(/./), $.lua_content), "|#"),
      ),

    concatenation_expression: ($) =>
      prec.left(
        seq(
          $._expression,
          "..",
          $._expression,
          repeat(seq("..", $._expression)),
        ),
      ),

    unary_expression: ($) => prec.right(seq($._unary_operator, $._expression)),
    _unary_operator: (_) => choice("-", "~", "#", "not", "&", "$"),

    comparison_expression: ($) =>
      prec.left(
        seq(
          $.expression_list,
          $._comparison_operator,
          $.expression_list,
          repeat(seq($._comparison_operator, $.expression_list)),
        ),
      ),
    _comparison_operator: (_) =>
      choice("~=", "==", "<=", ">=", "<", ">", "|", "&", "~", "and", "or"),

    math_expression: ($) =>
      prec.left(
        seq(
          $._expression,
          $._math_operator,
          $._expression,
          repeat(seq($._math_operator, $._expression)),
        ),
      ),
    _math_operator: ($) =>
      choice("+", "-", "*", "/", "//", "///", "^", ">>", ">>>"),

    record: ($) => seq("@", "record", "{", optional($._record_field_list), "}"),
    _record_field_list: ($) =>
      seq($.record_field, repeat(seq(",", $.record_field)), optional(",")),
    record_field: ($) =>
      seq(
        $.identifier,
        ":",
        choice($.type, seq("record", "{", optional($._record_field_list), "}")),
      ),

    enum: ($) =>
      seq(
        "@",
        "enum",
        "{",
        $.enum_field,
        repeat(seq(",", $.enum_field)),
        optional(","),
        "}",
      ),
    enum_field: ($) =>
      prec.left(seq($.identifier, optional(seq("=", $._expression)))),

    union: ($) => seq("@", "union", "{", $._union_field_list, "}"),
    _union_field_list: ($) =>
      seq($.union_field, repeat(seq(",", $.union_field)), optional(",")),
    union_field: ($) => seq($.identifier, ":", $.type),

    table_constructor: ($) =>
      seq(
        optional(seq("(", $.at_type, ")")),
        "{",
        optional(
          choice(
            $.expression_list,
            seq(
              $.assignment_statement,
              repeat(seq(",", $.assignment_statement)),
            ),
          ),
        ),
        "}",
      ),

    dot_expression: ($) =>
      seq(
        $.identifier,
        repeat(
          choice(
            seq(choice(".", ":"), choice($.identifier, $.function_call)),
            seq("[", $._expression, "]"),
          ),
        ),
      ),

    _identifier_list: ($) =>
      seq(
        choice($.identifier, $._typed_identifier),
        repeat(seq(",", choice($.identifier, $._typed_identifier))),
      ),
    _typed_identifier: ($) => seq($.identifier, ":", $.type),
    identifier: ($) =>
      choice(
        /[a-zA-Z_][a-zA-Z0-9_]*/,
        $.lua_expression,
        seq(
          /[a-zA-Z_][a-zA-Z0-9_]*/,
          repeat(
            choice(
              seq(".", /[a-zA-Z_][a-zA-Z0-9_]*/),
              seq("[", $._expression, "]"),
            ),
          ),
        ),
        alias("...", $.varargs),
        $.self,
      ),

    self: (_) => "self",

    false: (_) => "false",
    true: (_) => "true",
    nil: (_) => "nile",
    string: (_) =>
      choice(
        seq('"', repeat(/./), '"'),
        seq("'", repeat(/./), "'"),
        seq("[[", repeat(/./), "]]"),
      ),
    number: (_) =>
      /(?:\d+(\.\d+)?([eE][-+]?\d+)?(_[a-zA-Z][a-zA-Z0-9]*)?)|(?:0b[01]+(_[a-zA-Z][a-zA-Z0-9]*)?)|(?:0x[\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?(_[a-zA-Z][a-zA-Z0-9]*)?)/,

    comment: ($) =>
      choice(
        seq("--", alias(/.*/, $.comment_body)),
        seq("--[[", alias(repeat(/./), $.comment_body), "]]"),
        seq("--[=[", alias(repeat(/./), $.comment_body), "]=]"),
        seq("--[==[", alias(repeat(/./), $.comment_body), "]==]"),
      ),
  },
});
