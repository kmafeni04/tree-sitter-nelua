(hash_bang_line) @comment

(comment) @comment

; (identifier) @variable

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
  "end"
] @keyword

(string) @string

(self) @variable.builtin

(number) @constant

[(type) (return_type)] @type

(annotation
  ["<"">"] @punctuation.brakcet)
(annotation
  (function_call
    (argument) @string))

(annotation
  (identifier) @attribute)

["@"] @operator

(record
  "record" @type)

(enum
  "enum" @type)

(union
  "union" @type)

["local" "global" "return"] @keyword

["if" "then" "while" "repeat" "until" "for"] @keyword.control


(function_declaration
  [(identifier) "(" ")"] @function)

(function_declaration
  (dot_expression 
    [(dot_field (identifier)) "(" ")"] @function))

(parameters (identifier) @variable.parameter)

(function_call 
  [(identifier) "(" ")"] @function)

(function_call
  (dot_expression
    [(dot_field (identifier)) "(" ")"] @function))

(dot_field
    (identifier) @variable.other.member)

(dot_method
    (identifier) @function)

(builtin_function) @function.builtin

(lua_statement
  ["##[[" "]]" "##"] @keyword.directive)

(lua_expression
  ["#[" "]#" "#|" "|#"] @keyword.directive)

