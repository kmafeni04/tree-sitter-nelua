(hash_bang_line) @comment

(comment) @comment

[(true) (false)] @constant.builtin.boolean

(nil) @constant.builtin


[
  "="
] @operator

[
  "and"
  "or"
  "not"
] @keyword.control

[
  ".."
  "-"
  "~"
  "#"
  "*"
  "&"
  "$"
  "~="
  "=="
  "<="
  ">="
  "<"
  ">"
  "|"
  "&"
  "~"
  "+"
  "-"
  "*"
  "/"
  "//"
  "///"
  "^"
  ">>"
  ">>>"
] @operator

[
  "."
  ","
  ":"
] @punctuation.delimiter

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  "function"
  "defer"
  "in"
  "do"
  "return" 
  (break)
  "in"
  "defer"
  "goto"
  (continue)
  (fallthrough)
  "end"
] @keyword

(string) @string

(number) @constant

[(type) (return_type)] @type

(annotation
  ["<"">"] @punctuation.brakcet)

(annotation
  (identifier) @attribute)

["@"] @operator

((identifier) @variable.builtin
 (#eq? @variable.builtin "self"))

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z_0-9]*$"))

(record
  "record" @type)

(enum
  "enum" @type)

(union
  "union" @type)

["local" "global" "return"] @keyword

[
  "if"
  "else"
  "elseif"
  "then"
  "while"
  "repeat"
  "until"
  "for"
  "switch"
  "case"
] @keyword.control

(escape_sequence) @constant.character.escape

(function_declaration
  [(identifier) "(" ")"] @function)

(function_declaration
  (dot_expression 
    [(dot_field (identifier)) "(" ")"] @function))

(parameters (identifier) @variable.parameter)

(function_call 
  [(identifier) "(" ")"] @function)

(function_call
  (argument) @string)

(function_call
  (dot_expression
    [(dot_field (identifier)) "(" ")"] @function))

(dot_field
    (identifier) @variable.other.member)

(dot_method
    (identifier) @function.method)

(builtin_function) @function.builtin

(lua_statement
  ["##[[" "]]" "##"] @keyword.directive)

(lua_expression
  ["#[" "]#" "#|" "|#"] @keyword.directive)

