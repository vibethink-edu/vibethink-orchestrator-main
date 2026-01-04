# FIT-001: Closed Vocabulary & Entity Purity

**Status**: ACTIVE  
**Enforcement**: MANUAL (Code Review) + LINT (Planned)  
**Related WIT**: WIT-001, WIT-002, WIT-006

---

## 🛑 The Failure Condition (RED)

This tests FAILS immediately if any **Architecture Decision Record (ADR)**, **Pull Request**, or **Database Schema** introduces a top-level entity named after:

1.  **An Application / Vendor**
    *   *Examples*: `Gmail`, `SlackMessage`, `NotionPage`, `SalesforceAccount`
2.  **A File Format / Medium**
    *   *Examples*: `Spreadsheet`, `PDFDocument`, `Email`, `VoiceNote`, `SMS`
3.  **A User Interface Metaphor**
    *   *Examples*: `Inbox`, `TodoList`, `KanbanCard`, `DashboardWidget`

---

## ✅ The Success Condition (GREEN)

This test PASSES only if the new entity is strictly mapped to one of the **Canonical Memory Types** OR **Approved World Entities**:
 
 **A. Canonical Memory Types (The Big 5)**
 1.  **Communication Signal**
 2.  **Interaction Event**
 3.  **Commitment Signal**
 4.  **Knowledge Artifact**
 5.  **Temporal Context**
 
 **B. Approved World Entities (MVP List)**
 1.  **Person**
 2.  **Organization**
 3.  **Case**
 4.  **Program**

---

## 🧪 Examples

### ❌ FAIL: Model Drift
```typescript
// REJECTED
interface SlackIntegration {
  channels: SlackChannel[]; // "Channel" is a vendor concept
  messages: SlackMessage[]; // "SlackMessage" is a vendor concept
}
```

### ✅ PASS: Canonical Mapping
```typescript
// APPROVED
interface ExternalSourceAdapter {
  source: 'SLACK'; // Vendor is metadata
  payload: CommunicationSignal; // Entity is Canon
}
```

### ❌ FAIL: Medium as Entity
```typescript
// REJECTED
class ExcelSheet implements Entity { ... }
```

### ✅ PASS: Medium as Format
```typescript
// APPROVED
class InventoryReport implements KnowledgeArtifact {
  format: 'SPREADSHEET'; // Format is metadata
  storageType: 'EXCEL';  // Vendor is metadata
}
```
