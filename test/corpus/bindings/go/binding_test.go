package tree_sitter_corpus_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_corpus "github.com/tree-sitter/tree-sitter-corpus/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_corpus.Language())
	if language == nil {
		t.Errorf("Error loading Corpus grammar")
	}
}
