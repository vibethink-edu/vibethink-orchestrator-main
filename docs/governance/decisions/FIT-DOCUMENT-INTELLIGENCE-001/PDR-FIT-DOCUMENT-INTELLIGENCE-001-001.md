# PDR-FIT-DOCUMENT-INTELLIGENCE-001-001

**Date**: 2026-01-09  
**Author**: Chief Architect  
**FIT**: FIT-DOCUMENT-INTELLIGENCE-001  
**Phase**: 2  
**Status**: Accepted

## Context
The Document Intelligence service requires interacting with multiple external OCR providers (Google Vision, Textract) and potentially different persistence layers for reviews and items. Hardcoding these dependencies would violate the "Domain-Agnostic" and "No Vendor Lock-in" core principles of ViTo.

## Decision
We decided to implement the **Adapter Pattern** for both OCR processing and Review Persistence.
- **IOcrProvider**: Interface for OCR operations.
- **IReviewPersistenceAdapter**: Interface for storing review results.

We explicitly decouple the `ReviewService` and `ProcessingPipeline` from specific implementations, injecting dependencies via the `ModuleConfig`.

## Rationale
This approach allows:
1.  **Swappability**: Changing OCR providers requires no code changes in the core logic, only a new adapter.
2.  **Testability**: We can easily mock adapters for unit testing without making external calls.
3.  **Compliance**: Different tenants may require different storage backends or OCR providers based on jurisdiction.

## Consequences
- **Positive**: High flexibility, adherence to clean architecture/SOLID principles, simplified testing.
- **Negative**: Slight increase in initial complexity due to interface definition and wiring.

## Alternatives Considered
- **Hardcoded Integration**: Rejected due to vendor lock-in risk.
- **Abstract Base Classes**: Rejected in favor of Interfaces for purely structural contracts in TypeScript.

## Evidence
- Code: `src/modules/document-intelligence/contracts/` (Interfaces defined)
- Code: `src/modules/document-intelligence/index.ts` (Dependency Injection wiring)
