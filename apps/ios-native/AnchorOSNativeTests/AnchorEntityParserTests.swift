import XCTest
@testable import AnchorOSNative

/// Parity tests for AnchorEntityParser vs
/// src/services/fabric/intentEntityParsers.ts.
final class AnchorEntityParserTests: XCTestCase {

    // MARK: parseAmount

    func test_parsesNairaSymbol() {
        XCTAssertEqual(AnchorEntityParser.parseAmount("₦500"), 500)
        XCTAssertEqual(AnchorEntityParser.parseAmount("₦1,234.50"), 1234.5)
    }

    func test_parsesDollarSymbol() {
        XCTAssertEqual(AnchorEntityParser.parseAmount("I spent $50"), 50)
    }

    func test_parsesBareNumbersWithTwoPlusDigits() {
        XCTAssertEqual(AnchorEntityParser.parseAmount("spent 500 today"), 500)
    }

    func test_rejectsSingleDigitBareNumbers() {
        XCTAssertNil(AnchorEntityParser.parseAmount("spent 5 today"))
    }

    func test_parsesCurrencyWord() {
        XCTAssertEqual(AnchorEntityParser.parseAmount("got 2000 naira"), 2000)
        XCTAssertEqual(AnchorEntityParser.parseAmount("earned 50 dollars"), 50)
    }

    // MARK: parseCategory

    func test_matchesCategoryKeyword() {
        XCTAssertEqual(AnchorEntityParser.parseCategory("I spent on food today"), "Food")
        XCTAssertEqual(AnchorEntityParser.parseCategory("paid electricity bill"), "Bills")
    }

    func test_fallsBackToFirstContentWord() {
        // "widget" is not a stopword, > 2 chars
        XCTAssertEqual(AnchorEntityParser.parseCategory("record widget"), "widget")
    }

    func test_extractContextCategoryKeywordOnly() {
        XCTAssertEqual(AnchorEntityParser.extractContextCategory("about food"), "Food")
        XCTAssertNil(AnchorEntityParser.extractContextCategory("what about widgets"))
    }
}
