import XCTest
@testable import AnchorOSNative

/// Phase 4f: parity tests for AnchorPatternsStore.decodePattern.
/// Verifies the PWA `UserPattern` JSON shape (nested trigger/followUpAction)
/// decodes to the flat native `AnchorUserPattern` used by
/// AnchorProactiveQuestionEngine.
final class AnchorPatternsStoreDecoderTests: XCTestCase {

    func test_decodeCommitmentCompletedWithCategory() throws {
        let dict: [String: Any] = [
            "id": "p1",
            "trigger": ["type": "commitment_completed", "category": "gym"],
            "followUpAction": ["type": "review_budget", "category": "health"],
            "frequency": 5,
            "confidence": 0.8,
            "lastOccurred": "2026-04-10T10:00:00Z"
        ]
        let p = try XCTUnwrap(AnchorPatternsStore.decodePattern(dict))
        XCTAssertEqual(p.id, "p1")
        XCTAssertEqual(p.triggerKind, .commitmentCompleted)
        XCTAssertEqual(p.triggerCategory, "gym")
        XCTAssertEqual(p.actionKind, .reviewBudget)
        XCTAssertEqual(p.actionCategory, "health")
        XCTAssertEqual(p.frequency, 5)
        XCTAssertEqual(p.confidence, 0.8, accuracy: 0.001)
    }

    func test_decodeTransactionRecordedWithPrefillCategory() throws {
        let dict: [String: Any] = [
            "id": "p2",
            "trigger": ["type": "transaction_recorded", "category": "food"],
            "followUpAction": [
                "type": "record_transaction",
                "prefill": ["category": "coffee", "amountCents": 500]
            ],
            "frequency": 10,
            "confidence": 0.9,
            "lastOccurred": "2026-04-15T08:00:00Z"
        ]
        let p = try XCTUnwrap(AnchorPatternsStore.decodePattern(dict))
        XCTAssertEqual(p.triggerKind, .transactionRecorded)
        XCTAssertEqual(p.actionKind, .recordTransaction)
        // Pulled from nested prefill, not top-level action dict.
        XCTAssertEqual(p.actionCategory, "coffee")
    }

    func test_decodeTimeOfDayPattern() throws {
        let dict: [String: Any] = [
            "id": "p3",
            "trigger": ["type": "time_of_day", "hour": 18],
            "followUpAction": ["type": "view_page"],
            "frequency": 3,
            "confidence": 0.5,
            "lastOccurred": "2026-04-15T18:00:00Z"
        ]
        let p = try XCTUnwrap(AnchorPatternsStore.decodePattern(dict))
        XCTAssertEqual(p.triggerKind, .timeOfDay)
        XCTAssertEqual(p.triggerHour, 18)
        XCTAssertNil(p.triggerCategory)
    }

    func test_decodeRejectsMissingTrigger() {
        let dict: [String: Any] = [
            "id": "p4",
            "followUpAction": ["type": "view_page"],
            "frequency": 1, "confidence": 0.1, "lastOccurred": ""
        ]
        XCTAssertNil(AnchorPatternsStore.decodePattern(dict))
    }

    func test_decodeRejectsUnknownTriggerType() {
        let dict: [String: Any] = [
            "id": "p5",
            "trigger": ["type": "bogus_trigger"],
            "followUpAction": ["type": "view_page"],
            "frequency": 1, "confidence": 0.1, "lastOccurred": ""
        ]
        XCTAssertNil(AnchorPatternsStore.decodePattern(dict))
    }

    func test_decodeRejectsMissingId() {
        let dict: [String: Any] = [
            "trigger": ["type": "app_opened"],
            "followUpAction": ["type": "view_page"],
            "frequency": 1, "confidence": 0.1, "lastOccurred": ""
        ]
        XCTAssertNil(AnchorPatternsStore.decodePattern(dict))
    }

    func test_decodeDefaultsNumericAndTimestampFields() throws {
        let dict: [String: Any] = [
            "id": "p6",
            "trigger": ["type": "app_opened"],
            "followUpAction": ["type": "view_page"]
        ]
        let p = try XCTUnwrap(AnchorPatternsStore.decodePattern(dict))
        XCTAssertEqual(p.frequency, 0)
        XCTAssertEqual(p.confidence, 0)
        XCTAssertEqual(p.lastOccurred, "")
    }
}
