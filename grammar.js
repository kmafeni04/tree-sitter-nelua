/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "nelua",

  extras: ($) => [$.comment, /\s/],

  rules: {
    source_file: ($) => seq(optional($.hash_bang_line), repeat($._statement)),

    hash_bang_line: (_) => /#.*/,

    _statement: ($) => choice($.assignment_statement),

    assignment_statement: ($) =>
      seq(
        choice("local", "global"),
        $._identifier_list,
        "=",
        $._expression_list,
      ),

    _expression_list: ($) =>
      seq($._expression, repeat(seq(",", $._expression))),
    _expression: ($) => choice($.string, $.number),

    _identifier_list: ($) => seq($.identifier, repeat(seq(",", $.identifier))),
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    string: (_) => /\".*\"/,
    number: (_) => /\d+(\.\d+)?/,

    comment: ($) =>
      choice(seq("--", /[^\r\n]*/), seq("--[[", repeat(/./), "]]")),
  },
});
