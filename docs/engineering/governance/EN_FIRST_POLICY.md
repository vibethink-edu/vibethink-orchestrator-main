# Governance Policy: Canonical Language (EN-First)

> **Status:** SEALED  
> **Effective Date:** 2026-01-08  
> **Authority:** Governance Auditor  
> **Enforcement:** Mandatory  

## 1. Policy Statement
English (EN) is established as the **sole authoritative language** for all canonical artifacts, engineering contracts, and system architecture definitions within the VibeThink Orchestrator (ViTo) ecosystem. In the event of a discrepancy between an English document and a translation, the English version takes absolute precedence.

## 2. Scope

This policy strictly applies to **Canonical Artifacts**, defined as:

- **Architecture Documentation**: `docs/architecture/**`
- **Engineering Standards**: `docs/engineering/**`, `docs/standards/**`
- **Governance & Protocols**: `docs/governance/**`, `docs/ai-coordination/**`
- **System Definitions**: `.github/**` (Workflows, Issue Templates)
- **Root Documentation**: `README.md`, `CONTRIBUTING.md`
- **Functional Invariants (FIT)**: All FIT documents.

## 3. Non-Scope Artifacts

This policy **does not** enforce English (though it is recommended) for:

- Inline Code Comments
- TODOs / FIXMEs
- Commit Messages (though conventional commits usually implies EN)
- GitHub Issues & Discussions
- Pull Request Comments
- Local Development Scripts (e.g., `.ps1` for specific locale usage)
- User-Facing Content (App Translations are governed by i18n policies, not this governance policy)

## 4. Naming & Structure Conventions

### 4.1 Canonical Files
Must be named in English, uppercase or kebab-case, with **no language suffix**.
*   ✅ `ARCHITECTURE.md`
*   ✅ `ci-cd-guide.md`
*   ❌ `ARQUITECTURA.md`
*   ❌ `ARCHITECTURE_EN.md`

### 4.2 Translations (Non-Canonical)
Translations are treated as "Drafts" or "Reference Copies" and must carry the language suffix.
*   ✅ `ARCHITECTURE_es.md`
*   ✅ `ci-cd-guide_pt.md`

## 5. Exceptions

Exceptions are permitted ONLY for:
1.  **Legal/Regulatory Requirements**: Documents required by local law to be in a specific language.
2.  **Explicit Declaration**: The document must usually contain a header stating: *"This document is legally binding in [Language] and takes precedence over the English translation."*

## 6. Audit & Compliance
AI Agents and Human Reviewers must verify that any update to a Canonical Artifact is performed primarily on the English version. Updates to translations are secondary and optional for immediate consistency.
