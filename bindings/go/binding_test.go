package tree_sitter_your_language_name_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_your_language_name "github.com/tree-sitter/tree-sitter-YOUR_LANGUAGE_NAME/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_your_language_name.Language())
	if language == nil {
		t.Errorf("Error loading YourLanguageName grammar")
	}
}
