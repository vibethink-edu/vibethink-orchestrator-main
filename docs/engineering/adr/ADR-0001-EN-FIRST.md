# ADR-0001: Adoption of English-First Policy for Canonical Artifacts

> **Status:** SEALED  
> **Date:** 2026-01-08  
> **Deciders:** Governance Auditor, Chief Architect  

## Context
The ViTo project is a complex monorepo orchestrated by multiple AI agents (Claude, Gemini, OpenAI) and human engineers.
*   **Problem**: Mixed-language documentation (Spanglish) creates ambiguity, complicates context retrieval for LLMs, and fragments the "Source of Truth".
*   **Risk**: An AI might read an outdated Spanish draft and assume it's the current truth, ignoring a newer English definition.
*   **Need**: A deterministic rule to resolve conflicts between language versions.

## Decision
We will adopt an **English-First (EN-First)** policy for all Governance, Architecture, and Engineering documentation.

1.  **English is Canonical**: The English version of a file is the master record.
2.  **Suffix-Free English**: Main files (`DOC.md`) are English. Translations must have suffixes (`DOC_es.md`).
3.  **Governance Scope**: Applies to all files defining system behavior, rules, or architecture.

## Alternatives Considered

### 1. Spanish-First
*   **Pros**: Native language of the original creator.
*   **Cons**: Limits global collaboration; most AI models are optimized for English system prompts; non-standard in open source.

### 2. Multi-Canonical (Co-Equal)
*   **Pros**: Equality.
*   **Cons**: Synchronization hell. "Which version is true?" becomes a constant blocking question.

### 3. Localization-Agnostic
*   **Pros**: Flexibility.
*   **Cons**: Chaos.

## Consequences

### Positive
*   **Deterministic Context**: AI agents know exactly which file to trust.
*   **Searchability**: Unified terminology in English (e.g., "Pipeline" vs "Tubería/Flujo").
*   **Professional Standard**: Aligns with industry best practices for enterprise software.

### Negative
*   **Friction**: Non-native English speakers must write documentation in English (mitigated by AI translation tools).
*   **Maintenance**: Keeping translations in sync becomes a secondary task that may lag behind.

## Compliance
This ADR is sealed and effective immediately. All future documentation contributions must adhere to this standard.
