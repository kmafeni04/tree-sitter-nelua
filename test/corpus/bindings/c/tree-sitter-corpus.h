#ifndef TREE_SITTER_CORPUS_H_
#define TREE_SITTER_CORPUS_H_

typedef struct TSLanguage TSLanguage;

#ifdef __cplusplus
extern "C" {
#endif

const TSLanguage *tree_sitter_corpus(void);

#ifdef __cplusplus
}
#endif

#endif // TREE_SITTER_CORPUS_H_
