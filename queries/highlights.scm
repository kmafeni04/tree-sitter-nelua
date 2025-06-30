(hash_bang) @comment

(ERROR) @error

(comment) @comment

(boolean) @constant.builtin.boolean

[(nil) (nilptr)] @constant.builtin

(vararg_expression) @constant

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
  "<<"
  ">>"
  ">>>"
] @operator

[
  "."
  ","
  ":"
  ";"
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

(char) @string

(number) @constant

[(type) (return_type)] @type

(type (identifier) @type)

["@"] @operator

(parameter
  ((identifier) @variable.parameter
  (#eq? @variable.parameter "self")))

(parameter (identifier) @variable.parameter
  (#match? @variable.parameter "^[A-Z][A-Z_0-9]*$"))

((identifier) @variable.builtin
 (#eq? @variable.builtin "self"))

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z_0-9]*$"))

(variable_list
  (identifier) @variable)

(annotation
  ["<"">"] @punctuation.brakcet)

(annotation
  (identifier) @attribute)

(record
   (record_field
     (identifier) @variable.other.member))

(enum
   (enum_field
     (identifier) @variable))

(union
   (union_field
     (identifier) @variable.other.member))

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

(function_definition
  (identifier) @function)

(parameter (identifier) @variable.parameter)

(function_call
  (identifier) @function.builtin
  (#any-of? @function.builtin 
  "require" "print" "panic" "error" "assert" "check" "likely" "unlikely"
  "ipairs" "mipairs" "next" "mnext" "pairs" "mpairs" "select" "tostring"
  "tostringview" "tonumber" "tointeger" "type" "new" "delete" "collectgarbage"))

(function_call
  (identifier) @function)

(function_call
  (preproc_expression) @function)

(dot_field
    field: (field (identifier) @variable.other.member))

(dot_variable
    field: (field (identifier) @variable.other.member))

(method_field
    field: (field (identifier) @function.method))

(goto_location "::" @keyword.directive)

(preproc_statement) @keyword.directive

(preproc_expression
  ["#[" "]#" "#|" "|#"] @keyword.directive)

(escape_sequence) @constant.character.escape

(macro_function) @function.macro

(identifier) @variable
