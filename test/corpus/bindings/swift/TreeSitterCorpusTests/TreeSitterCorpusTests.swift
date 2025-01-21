import XCTest
import SwiftTreeSitter
import TreeSitterCorpus

final class TreeSitterCorpusTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_corpus())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Corpus grammar")
    }
}
