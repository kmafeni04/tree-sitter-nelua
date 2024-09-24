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
  (identifier) @attribute
)

["@"] @operator

(record
  "record" @type)

(enum
  "enum" @type)

(union
  "union" @type)

["local" "global" "return"] @keyword

(function_declaration
  [(identifier) "(" ")"] @function)

(parameters (identifier) @variable.parameter)

["if" "then" "while" "repeat" "until" "for"] @keyword.control

(function_call) @function
(builtin_function) @function.builtin
