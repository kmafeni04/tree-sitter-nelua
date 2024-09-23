(hash_bang_line) @comment

(comment) @comment

(identifier) @variable

[
  "="
] @operator

[
  "."
  ","
  ":"
] @punctuation.delimiter

[
  "{"
  "}"
] @punctuation.bracket

[
  "function"
  "defer"
  "in"
  "do"
  "end"
] @keyword

(string) @string

(number) @constant

["local" "global" "return"] @keyword

(function_declaration
  [(identifier) "(" ")"] @function
  (parameters) @variable.parameter
  [(identifier) "(" ")"] @function
)

["if" "then" "while" "repeat" "until" "for"] @keyword.control

(function_call) @function
