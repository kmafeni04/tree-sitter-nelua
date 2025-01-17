/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "nelua",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$._statement, $.function_call],
    [$.annotation, $.function_call],
    [$.identifier, $._expression],
    [$.type, $._expression],
    [$.expression_list, $.cast_type],
    [$.math_expression, $.cast_type],
    [$.concatenation_expression, $.cast_type],
    [$.expression_list, $.unary_expression],
    [$.expression_list, $.math_expression],
    [$.math_expression, $.math_expression],
    [$.expression_list, $.concatenation_expression],
    [$.concatenation_expression, $.concatenation_expression],
    [$.concatenation_expression, $.math_expression],
    [$.expression_list, $.expression_list],
    [$.comparison_expression, $.comparison_expression],
    [$.table_constructor, $.table_constructor],
    [$.type, $.dot_method],
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
        $.continue,
        $.repeat_statement,
        $.fallthrough,
        $.break,
        $.preproc_statement,
        $.global_declaration,
        $.local_declaration,
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

    local_declaration: ($) =>
      seq(
        "local",
        choice($.variable_list, $.function_declaration, $.assignment_statement),
      ),

    global_declaration: ($) =>
      seq(
        "global",
        choice($.variable_list, $.function_declaration, $.assignment_statement),
      ),

    return_statement: ($) =>
      prec.right(seq("return", optional($.expression_list))),

    defer_statement: ($) => seq("defer", repeat($._statement), "end"),

    goto_statement: ($) => seq("goto", $.identifier),
    goto_location: ($) => seq("::", $.identifier, "::"),

    continue: (_) => "continue",
    fallthrough: (_) => "fallthrough",
    break: (_) => "break",

    injection_statement: ($) => seq("in", $.expression_list),

    do_block: ($) => seq("do", optional(repeat($._statement)), "end"),

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
        choice($.identifier, $._typed_identifier),
        "=",
        $._expression,
        repeat1(seq(",", optional($._comparison_operator), $._expression)),
      ),
    for_in: ($) =>
      seq(
        choice($.identifier, $._typed_identifier),
        optional(seq(",", choice($.identifier, $._typed_identifier))),
        "in",
        $._expression,
      ),

    assignment_statement: ($) =>
      seq(
        choice($.variable_list, $.dot_expression),
        "=",
        optional(seq("(", $.at_type, ")")),
        choice($.expression_list, $.at_type),
      ),

    variable_list: ($) =>
      prec.left(
        seq(
          choice($.identifier, $._typed_identifier),
          repeat(seq(",", choice($.identifier, $._typed_identifier))),
          optional($.annotation),
        ),
      ),

    type: ($) =>
      prec.right(
        seq(
          repeat("*"),
          choice(
            seq("[", optional($._expression), "]", $.type),
            seq(
              "function",
              seq("(", optional(alias($._identifier_list, $.parameters)), ")"),
              optional(seq(":", $._type_list)),
            ),
            seq(
              alias($.identifier, "type"),
              optional(seq("(", $._type_list, ")")),
            ),
            $.record,
            $.union,
            $.enum,
          ),
        ),
      ),

    _type_list: ($) => prec.right(seq($.type, repeat(seq(",", $.type)))),

    record: ($) => seq("record", "{", optional($._record_field_list), "}"),
    _record_field_list: ($) =>
      seq($.record_field, repeat(seq(",", $.record_field)), optional(",")),
    record_field: ($) => seq($.identifier, ":", $.type),

    enum: ($) =>
      seq(
        "enum",
        optional(seq("(", $.type, ")")),
        "{",
        $.enum_field,
        repeat(seq(",", $.enum_field)),
        optional(","),
        "}",
      ),
    enum_field: ($) =>
      prec.left(seq($.identifier, optional(seq("=", $._expression)))),

    union: ($) => seq("union", "{", $._union_field_list, "}"),
    _union_field_list: ($) =>
      seq($.union_field, repeat(seq(",", $.union_field)), optional(",")),
    union_field: ($) => seq($.identifier, ":", $.type),

    at_type: ($) => seq("@", $.type),
    cast_type: ($) => seq("(", $.at_type, ")", $._expression),

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
        optional(choice($.identifier, $.dot_function_declaration)),
        choice(
          seq(
            "(",
            optional(alias($._identifier_list, $.parameters)),
            optional($.annotation),
            ")",
          ),
          "()",
        ),
        optional(
          seq(":", choice($.return_types, alias($.type, $.return_type))),
        ),
        optional($.annotation),
        optional($.function_body),
        "end",
      ),
    return_types: ($) => seq("(", $.type, repeat(seq(",", $.type)), ")"),
    dot_function_declaration: ($) =>
      seq(choice($.identifier), choice($.dot_field, $.dot_method)),

    function_body: ($) => repeat1($._statement),

    function_call: ($) =>
      seq(
        choice($.identifier, $.dot_expression, $.function_call),
        choice(
          seq("(", optional($.arguments), ")"),
          alias($.string, $.argument),
        ),
      ),
    arguments: ($) => alias($.expression_list, "arguments"),

    expression_list: ($) => seq($._expression, repeat(seq(",", $._expression))),
    _expression: ($) =>
      prec.right(
        choice(
          $.false,
          $.true,
          $.nil,
          $.nilptr,
          $.string,
          $.number,
          $.identifier,
          $.function_call,
          $.function_declaration,
          $.table_constructor,
          $.comparison_expression,
          $.unary_expression,
          $.math_expression,
          $.do_expression,
          $.concatenation_expression,
          $.preproc_expression,
          $.at_type,
          $.cast_type,
          $.dot_expression,
          seq("(", $._expression, ")"),
        ),
      ),

    do_expression: ($) => seq("(", "do", repeat($._statement), "end", ")"),

    dot_expression: ($) =>
      seq(
        choice($.identifier, $.function_call, seq("(", $._expression, ")")),
        repeat1(choice($.dot_field, $.dot_method, $.array_index)),
      ),
    dot_field: ($) => seq(".", $.identifier),
    dot_method: ($) => seq(":", $.identifier),
    array_index: ($) => seq("[", $._expression, "]"),

    preproc_expression: ($) =>
      choice(
        seq("#[", alias(repeat(/./), $.preproc_expression_content), "]#"),
        seq("#[", alias(repeat(/./), $.preproc_expression_content), "]#"),
        seq("#|", alias(repeat(/./), $.preproc_expression_content), "|#"),
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

    unary_expression: ($) => prec.left(seq($._unary_operator, $._expression)),
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

    table_constructor: ($) =>
      seq(
        optional(choice(seq("(", $.at_type, ")"), $.type)),
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

    _identifier_list: ($) =>
      seq(
        choice($.identifier, $._typed_identifier),
        repeat(seq(",", choice($.identifier, $._typed_identifier))),
      ),
    _typed_identifier: ($) => seq($.identifier, ":", $.type),
    identifier: ($) =>
      choice(
        /[a-zA-Z_][a-zA-Z0-9_]*/,
        $.preproc_expression,
        alias("...", $.varargs),
      ),

    false: (_) => "false",
    true: (_) => "true",
    nil: (_) => "nil",
    nilptr: (_) => "nilptr",

    string: ($) =>
      choice(
        seq('"', repeat(choice(/[^\\]/, $.escape_sequence)), '"'),
        seq("'", repeat(choice(/[^\\]/, $.escape_sequence)), "'"),
        seq("[[", repeat(choice(/[^\\]/, $.escape_sequence)), "]]"),
        seq("[=[", repeat(choice(/[^\\]/, $.escape_sequence)), "]=]"),
        seq("[==[", repeat(choice(/[^\\]/, $.escape_sequence)), "]==]"),
        seq("[===[", repeat(choice(/[^\\]/, $.escape_sequence)), "]===]"),
      ),
    number: (_) =>
      /(?:\d+(\.\d+)?([eE][-+]?\d+)?(_[a-zA-Z][a-zA-Z0-9]*)?)|(?:0b[01]+(_[a-zA-Z][a-zA-Z0-9]*)?)|(?:0x[\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?(_[a-zA-Z][a-zA-Z0-9]*)?)/,

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

    comment: ($) =>
      choice(
        seq("--", alias(/.*[^\r\\n]/, $.comment_body)),
        seq("--[[", alias(repeat(/./), $.comment_body), "]]"),
        seq("--[=[", alias(repeat(/./), $.comment_body), "]=]"),
        seq("--[==[", alias(repeat(/./), $.comment_body), "]==]"),
        seq("--[===[", alias(repeat(/./), $.comment_body), "]===]"),
      ),
  },
});
