# Pending Architectural Stash

**Status:** CANON  
**Owner:** Co-Architect Principal  
**Last Updated:** 2025-12-31

---

## 1. Why this Stash Exists

This document captures the "Architectural Dark Matter"—decisions, ideas, and risks that exist in conversations but have not yet been formalized in code or strict protocols.
**"If it’s not in GitHub, it doesn’t exist."**
This stash prevents implicit context loss during handoffs between AI sessions or human engineers. It acts as the "Freezer" for high-value ideas that are not yet "Production-Ready".

---

## 2. Classification Model

| Category | Definition | Handling Rule |
| :--- | :--- | :--- |
| **CANON** | Law. Immutable until amended. | Must be enforced by CI/Gate. |
| **DEFERRED** | Agreed definition, implementation paused. | Do not touch until triggered. |
| **BACKLOG** | Explicit tasks for "Carpenters" (Z/Agents). | Execute when resources allow. |

---

## 3. Stash Index

| ID | Topic | Category | Risk | Trigger | Owner | Evidence | Next Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **STASH-001** | Vector DB Strategy | DEFERRED | HIGH | Entity Memory Complete | Co-Architect | `PENDING_ARCHITECTURAL_DOMAINS.md` | POC pgvector vs Pinecone (Distance 1 check) |
| **STASH-002** | Operational Caching (Redis) | DEFERRED | MED | Realtime/Presence Req | Co-Architect | Chat logs (Implicit) | Audit Supabase Realtime limits vs Redis |
| **STASH-003** | Memory Taxonomy & Retention | DEFERRED | CRITICAL | Entity Memory Complete | Co-Architect | Chat logs (Privacy concern) | Define Episodic vs Semantic vs Transient retention |
| **STASH-004** | Bundui Premium Updates | CANON | MED | New Component Needed | Specialist | `packages/ui/src/components` | Define "Vendor Update" protocol (copy-paste vs git module) |
| **STASH-005** | Z "Carpenter" Protocol | CANON | LOW | Scale/Refactor Tasks | Principal | `docs/canon/AI_COLLABORATION...` | Formalize `docs/protocols/Z_CARPENTER_PROTOCOL.md` |
| **STASH-006** | Git Worktree Hygiene | CANON | LOW | Local Dev Friction | Developer | Failed checkouts logs | Document worktree pruning/usage in README |

---

## 4. Deferred Architectural Domains (Details)

### Vector DB & Embeddings (STASH-001)
- **Context:** We need semantic search for "Company DNA" and "Entity Memory".
- **Decision Pending:**
  - Option A: Supabase `pgvector` (Distance 0 compliant, less moving parts).
  - Option B: Specialized Vector DB (Pinecone/Weaviate).
- **Constraint:** Must not introduce Distance 1 vendor lock-in without adapter.

### Operational Memory / Caching (STASH-002)
- **Context:** High-frequency state (e.g., "User is typing", "Agent is thinking") shouldn't hit Postgres disk.
- **Decision Pending:** Use Supabase Realtime (managed) vs Redis (self-managed/hosted).
- **Rule:** No implicit state in Node.js process memory (violates statelessness).

### Memory Taxonomy (STASH-003)
- **Context:** Not all memory is equal.
  - *Episodic:* "User clicked X yesterday".
  - *Semantic:* "User prefers concise answers".
  - *Transient:* "Task ID 123 context for this session".
- **Requirement:** A retention policy MUST be defined before storing PII/sensitive data.

---

## 5. Backlog: Carpentry Tasks for Z (Highly Directed)

These are "shovel-ready" tasks suitable for a "Z" agent (Carpenter level):

1.  **Refactor Legacy Translations:**
    *   *Input:* `apps/dashboard/src/lib/i18n/translations`
    *   *Task:* Verify all keys match `en` source. Remove unused keys.
    *   *Constraint:* Must use `check-json-parse.mjs` to validate result.

2.  **Component Inventory:**
    *   *Input:* `packages/ui/src`
    *   *Task:* Create a Markdown table `docs/registry/COMPONENT_INVENTORY.md` listing component name, dependency (Radix/Bundui), and "Last Updated".

3.  **Worktree Cleanup Script:**
    *   *Input:* `git worktree list`
    *   *Task:* Create `scripts/prune-worktrees.ps1` to remove stale checks easily.

---

## 6. Continuity Hooks (How to resume)

To resume any item here:
1.  **Check Condition:** Is the Trigger met? (e.g., Is Entity Memory defined?)
2.  **Promote:** Move from `STASH` to `task.md` (Active).
3.  **Execute:** Follow standard Workflow (Plan → Canon → Code).

---

## 7. Done Criteria (for closing this stash)

This document itself is "Done" when:
- It effectively captures the implicit "mental RAM" of the Principal Architect.
- A new Architect can read this and say "I know what's missing".
- No major architectural risk is left undocumented.
