# FIT Index (Feature Implementation Tracks)

> **Status:** LIVE / UPDATED
> **Last Update:** 2026-01-10
> **Purpose:** Master directory of all specialized implementation tracks.

This index categorizes FITs by architectural layer. Use this to locate the Source of Truth for any module.

---

## 🌟 Business Verticals (The Products)

| FIT ID | Name | Status | Description |
| :--- | :--- | :--- | :--- |
| **[DTP-001](./FIT-DIGITAL-TWIN-PLATFORM-001.md)** | **Digital Twin Vertical** | 🟡 **DESIGNED** | Architecture for Celebrity/Expert Avatars (Video/Voice) reusing ViTo Core. **(New Star)** |
| **[DOC-001](./FIT-DOCUMENT-INTELLIGENCE-001.md)** | **Document Intelligence** | 🟢 **ACTIVE** | Clinical/Legal document scanning, OCR, and analysis pipeline. |
| **[CRM-001](./FIT-CRM-CORE-TRANSVERSAL-001.md)** | **CRM Core** | 🟢 **ACTIVE** | Base relationship management engine reused by all verticals. |

---

## ⚙️ ViTo Core Infrastructure (The Engine)

| FIT ID | Name | Status | Description |
| :--- | :--- | :--- | :--- |
| **[API-001](./FIT-API-KEY-MGMT-001-Phase-1.md)** | **API Key Management** | 🟢 **ACTIVE** | Multi-tenant secret vault and API key lifecycle. **Critical for Digital Twin.** |
| **[PER-001](./FIT-PERSISTENCE-ABSTRACTION-001.md)** | **Persistence Layer** | 🟢 **SEALED** | Abstract Data Access implementation details. |
| **[ORC-001](./FIT-ORCH-SCHEMA-001.md)** | **Orchestration Schema** | 🟢 **SEALED** | Base schema definitions for the orchestrator. |
| **[EXT-001](./FIT-EXTERNAL-CLIENT-ACCESS-001.md)** | **External Access** | 🟢 **ACTIVE** | Secure gateways for third-party clients. |

---

## 🧠 AI Brain & Memory (The Intelligence)

| FIT ID | Name | Status | Description |
| :--- | :--- | :--- | :--- |
| **[RAG-001](./FIT-RAG-PIPELINE-001.md)** | **RAG Pipeline** | 🟢 **ACTIVE** | Retrieval Augmented Generation core logic. |
| **[MEM-001](./FIT-WORKING-MEMORY-001.md)** | **Working Memory** | 🟢 **ACTIVE** | Short-term context handling for agents. |
| **[MEM-002](./FIT-MEMORY-WRITES-001.md)** | **Memory Persistence** | 🟢 **ACTIVE** | Long-term memory storage strategy. |
| **[EVA-001](./FIT-RAG-EVAL-001.md)** | **RAG Evaluation** | 🟡 **DRAFT** | Quality metrics for RAG responses. |

---

## 🔧 Compliance & Quality (The Guardrails)

| FIT ID | Name | Status | Description |
| :--- | :--- | :--- | :--- |
| **[DQL-001](./FIT-DATA-QUALITY-001.md)** | **Data Quality** | 🟢 **ACTIVE** | Rules for data hygiene and validation. |
| **[I18-001](./FIT_008_RICHTEXT_I18N_COMPLIANCE.md)** | **RichText i18n** | 🟢 **ACTIVE** | Internationalization standards for rich text. |
| **[ATR-001](./FIT_007_PROVIDER_ATTRIBUTION.md)** | **AI Attribution** | 🟢 **ACTIVE** | Tracking which model generated which content. |
| **[VOC-001](./FIT_ClosedVocabulary_001.md)** | **Closed Vocabulary** | 🟢 **SEALED** | Enforced terminology list. |

---

## 📊 Status Legend
*   🟢 **SEALED/ACTIVE:** Implementation complete or strictly defined. No changes allowed without PCR.
*   🟡 **DESIGNED/DRAFT:** Architecture ready, implementation pending.
*   🔴 **ARCHIVED:** Deprecated or superseded.

**Note:** Always check the specific FIT file for the granular "Phase" status.
