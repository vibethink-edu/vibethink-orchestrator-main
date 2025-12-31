# Architectural Working Rules

**Status:** CANON  
**Owner:** Co-Architect Principal  
**Last updated:** 2025-12-31

---

## 1. Purpose of These Rules

This document formalizes the implicit agreement between Architects and the Platform. It exists to prevent architectural drift, cognitive load overload, and premature optimization. It defines **how we think about ViTo**, not just how we code it.

Its primary goal is to ensure that future contributors (human or AI) respect the "Operational Brain" philosophy without needing oral history or implicit context.

---

## 2. Scope

### What These Rules Govern
- The lifecycle of an architectural idea (Thought → Decision → Execution).
- The use of AI collaborators and their memory limitations.
- The boundary between "Product" (UX) and "Platform" (Architecture).
- The treatment of third-party dependencies and assets.

### What They Do Not Govern
- Code style (linting handles this).
- Specific technology choices (ADRs handle this).
- Day-to-day project management (Jira/Linear handles this).

---

## 3. Canonical Working Rules

### R1: Simplicity as a Gatekeeper
> **"If a decision cannot be explained in one sentence, it is not ready."**
Complex architectures hide bugs and fragilities. If you cannot articulate the "why" and "how" simply, you do not understand the problem well enough to solve it. Pause and simplify.

### R2: Canon Over Conversation
> **"No architectural truth may exist only in chat."**
LLM memory is ephemeral. If a decision is made in conversation, it is effectively lost unless it is immediately committed to `docs/canon/` or `docs/fits/`. Chat is for reasoning; Canon is for truth.

### R3: The "Deferred" State
> **"Deferred is not forgotten; it is protected."**
Marking a domain as "Pending" or "Deferred" is an active architectural decision, not a failure. It protects the domain from half-baked implementation. Do not touch deferred domains without explicit approval to open that phase.

### R4: UX Is Projection, Not Truth
> **"UI changes do not justify architectural changes."**
The User Experience is a transient projection of the underlying system state. Architecture dictates Truth; UX displays it. Never compromise the integrity of the Data/Memory layer to make a UI feature easier to implement.

### R5: Third-Party Containment
> **"External assets are guests, not residents."**
Bundui Premium, UI kits, and libraries must be treated as external entities. They live in explicit directories, are wrapped in boundaries (Distance model), and never dictate internal domain logic.

---

## 4. Decision-Making Rules

### Thinking Phase
- **Diverge first:** Explore multiple options (Thin vs Thick, Build vs Buy).
- **Consult Canon:** Check `CRITICAL_DEPENDENCY_GOVERNANCE.md` and `PENDING_ARCHITECTURAL_DOMAINS.md` before proposing.
- **Rule of 3:** If you see the same pattern 3 times, proposing a standard is mandatory.

### Deciding Phase
- **Evidence-based:** Decisions must be backed by file paths and line numbers, not assumptions.
- **Explicit Trade-offs:** Every "Yes" to a feature is a "No" to simplicity. State the cost.
- **reversible Preferred:** Favor decisions that are easy to reverse (e.g., Interface-first) over hard locks (e.g., Deep vendor coupling).

### Executing Phase
- **Plan First:** Write `implementation_plan.md` before changing code.
- **Atomic Commits:** One idea, one commit.
- **Verify Immediately:** Run FITs immediately after changes.

---

## 5. Change & Evolution Rules

- **Canon is Living:** It is better to update a Canon doc than to ignore it. If code diverts, Canon must be updated or Code fixed.
- **Add to Stash:** If an idea is good but not for "Now", add it to `PENDING_ARCHITECTURAL_DOMAINS.md` or a `brain/backlog.md`. Never just "drop" it.
- **Governance First:** Do not add a new dependency (Distance 0-1) without a corresponding Governance update (Regulation/FIT).

---

## 6. What Is Explicitly Forbidden

- **Premature Modeling:** Defining database schemas for features that don't exist yet.
- **Hidden Memory:** Creating stateful logic outside of the governed Memory Layer.
- **Zombie Code:** Commented-out code blocks "just in case". Delete them; Git remembers.
- **Mock-Production Mix:** Mixing mock data logic with production logic in the same file without clear separation.
- **Magic Strings:** Hardcoding business logic or i18n strings in UI components.

---

## 7. Relationship to Canon, FITs, and Deferred Domains

| Artifact | Role | Example |
| :--- | :--- | :--- |
| **Canon Rules** | The "Constitution" (This Doc) | "No truth in chat" |
| **Domain Canon** | The "Laws" | `CRITICAL_DEPENDENCY_GOVERNANCE.md` |
| **FITs** | The "Police/Tests" | `FIT-007` (Provenance) |
| **Pending** | The "Future Roadmap" | `PENDING_ARCHITECTURAL_DOMAINS.md` |

This document governs *how* we interact with all the above.

---

## 8. How These Rules Are Enforced

- **Self-Correction:** AI collaborators must verify their own plans against these rules.
- **PR Review:** Human architects verify that changes respect "Simplicity" and "Canon First".
- **Audit:** Periodic audits check for "Hidden Memory" or "Magic Strings".
- **Refusal to Implement:** An Architect (Human or AI) is empowered to refuse an implementation request if it violates these rules, requiring a "Governance Override" to proceed.
