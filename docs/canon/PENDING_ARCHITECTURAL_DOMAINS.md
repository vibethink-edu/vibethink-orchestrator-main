# Pending Architectural Domains

**Status:** CANON (Deferred)  
**Owner:** Co-Architect Principal  
**Last updated:** 2025-12-31

---

## 1. Purpose

This document explicitly captures architectural domains that are **known but deferred**.
It serves as a "parking lot" for critical themes to prevent scope creep while ensuring they are not lost.
Future architects/AI MUST consult this document before proposing "new" ideas.

---

## 2. Deferred Domains (Next Phase Candidates)

These domains are critical but intentionally paused until Governance Infrastructure was complete.

### A. Entity Memory (Domain Core)
- **Scope:** Definition of core Business Entities (Project, Task, Client) and their relationships.
- **Dependency:** Supabase Boundary (Distance 0) - ✅ Ready.
- **Intent:** Defines "what" the system remembers, distinct from "how" it's stored.
- **Status:** **NEXT PRIORITY**

### B. Company DNA (Context Layer)
- **Scope:** Workspace-level configuration of tone, rules, and behavioral modifiers.
- **Dependency:** Entity Memory (needs a place to attach).
- **Intent:** Allows AI to "reason differently" per client/workspace.
- **Status:** **HIGH PRIORITY**

### C. Operational Services (Services Layer)
- **Scope:** Real implementation of data access logic behind the Supabase boundary.
- **Dependency:** Supabase Boundary (Distance 0) - ✅ Ready.
- **Intent:** Move logic from UI hooks to `src/services/`.
- **Status:** **PENDING IMPLEMENTATION**

---

## 3. Undecided / Open Questions

These topics were discussed but NO decision has been canonized.

### A. Vector DB Strategy
- **Question:** Do we use pgvector (Supabase) or external provider (Pinecone/Weaviate)?
- **Constraint:** Must fit within Distance 1 governance if external.
- **Current State:** Not decided.
- **Action:** Requires specific audit/POC.

### B. Realtime Engine
- **Question:** How do we handle presence/updates? Supabase Realtime vs specialized provider?
- **Constraint:** Distance 1 governance applies.
- **Current State:** Not decided.

### C. Workflow Engine
- **Question:** How do we orchestrate multi-step AI tasks? In-memory (State machines) vs Durable (Temporal/Inngest).
- **Constraint:** AI-first architecture preference (Reasoning layer).
- **Current State:** Spec exists for "Orchestrator", implementation TBD.

---

## 4. Anti-Patterns to Avoid

- **Premature Optimization:** Do not pick a Vector DB before defining Entity Memory.
- **UI-First Data Design:** Do not model entities based on what the UI shows. Model based on business truth.
- **Implicit Rules:** Do not implement "Company DNA" as hardcoded prompts. Must be data-driven.
