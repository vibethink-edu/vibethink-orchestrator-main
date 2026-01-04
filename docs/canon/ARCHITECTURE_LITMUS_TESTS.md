# Architecture Litmus Tests

**Status**: CANON  
**Usage**: Mandatory before approving schema changes or new feature designs.  
**Purpose**: To detect subtle ontological drift that unit tests cannot catch.

---

## 🧪 Test 1: The Vendor Trap
**Question:**
"If two distinct vendors (e.g., Gmail and Outlook) provide the same function, do we create separate entities for them?"

**Canonical Answer:** **NO.**
**Why:** Vendors are metadata. The canonical entity is the functional abstraction (e.g., `Communication Signal`).
**Protects:** `WIT-001 (Closed Vocabulary)`

---

## 🧪 Test 2: The Medium Trap
**Question:**
"If a signal comes from a specific medium (e.g., a Spreadsheet or a Telegram Chat), does that define its entity type?"

**Canonical Answer:** **NO.**
**Why:** The medium is a container format. The entity matches the intent (e.g., `Knowledge Artifact` or `Communication Signal`).
**Protects:** `WIT-002 (Medium ≠ Canon)`

---

## 🧪 Test 3: The Inference Trap
**Question:**
"If an internal LLM concludes with 99% confidence that an event happened, can we record it as a canonical Fact?"

**Canonical Answer:** **NO.**
**Why:** Inferences are probabilistic metadata. Only authoritative signals or resolved events constitute Canonical Truth.
**Protects:** `WIT-005 (Inference ≠ Fact)`

---

## 🧪 Test 4: The UX Trap
**Question:**
"If the UI requires a specific view (e.g., 'Inbox', 'My Tasks'), does that entity need to exist in the database?"

**Canonical Answer:** **NO.**
**Why:** UX is a projection. The database stores the canonical reality (e.g., `Signal` with status `PENDING`), which the UI projects as "Inbox".
**Protects:** `WIT-006 (UX ≠ Ontology)`

---

## 🧪 Test 5: The Consensus Trap
**Question:**
"If multiple people mention a confirmation verbally, does the system automatically promote it to a Commitment?"

**Canonical Answer:** **NO.**
**Why:** Frequency and consensus increase confidence but do not replace the formal resolution process needed for Commitments.
**Protects:** `WIT-004 (Frequency ≠ Truth)`

---

## 🧪 Test 6: The Automation Trap
**Question:**
"If a workflow automates the ingestion of data, is that data automatically considered Canonical Truth?"

**Canonical Answer:** **NO.**
**Why:** Automation is a delivery mechanism, not a validation authority. All inputs start as Signals (Evidence), regardless of how automatically they arrived.
**Protects:** `WIT-003 (Evidence ≠ Truth)`

---

## 🧪 Test 7: The Department Trap
**Question:**
"If Sales needs to see 'Deals' and Ops needs to see 'Orders', do we create separate entities?"

**Canonical Answer:** **NO.**
**Why:** These are views/projections of a shared entity (e.g., `Interaction Event` or `Commitment Signal`). We do not fork the model for departments.
**Protects:** `WIT-007 (Department ≠ Model)`
