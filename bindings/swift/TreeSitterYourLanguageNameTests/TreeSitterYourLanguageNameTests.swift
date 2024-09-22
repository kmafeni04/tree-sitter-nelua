import XCTest
import SwiftTreeSitter
import TreeSitterYourLanguageName

final class TreeSitterYourLanguageNameTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_your_language_name())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading YourLanguageName grammar")
    }
}
