import XCTest
import SwiftTreeSitter
import TreeSitterNelua

final class TreeSitterNeluaTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_nelua())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Nelua grammar")
    }
}
