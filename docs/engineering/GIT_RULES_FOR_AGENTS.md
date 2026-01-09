# GIT OPERATIONAL RULES FOR AI AGENTS

**Status:** MANDATORY
**Scope:** Any AI Agent with Write/Execute permissions in the repository.

---

### 1. General Principles
*   **DETERMINISM:** All Git operations MUST result in a predictable state of the working tree.
*   **ATOMICITY:** Each commit MUST represent a single logical change.
*   **VISIBILITY:** Agents MUST always verify the repository state before and after any modification.

### 2. Mandatory Rites

#### A. Entry Rite (Pre-Action)
1.  The Agent **MUST** execute `git status` to detect existing locks or untracked debris.
2.  The Agent **MUST** execute `git pull --rebase` to align with the remote HEAD.
3.  **BLOCKING RULE:** If `git status` reveals unexpected modifications or untracked files unrelated to the current task, the Agent **MUST NOT** proceed without reporting the inconsistency.

#### B. Exit Rite (Post-Action)
1.  The Agent **MUST** execute `git status` to review the impact of its workspace changes.
2.  The Agent **MUST** use granular indexing: `git add <file_path>`.
3.  **PROHIBITION:** The Agent **MUST NOT** execute `git add .` or `git add -A`.
4.  The Agent **MUST** prepare a commit message following the project's canon: `[context]: [action]`.
5.  **TIMEOUT RULE:** If a Git command hangs for >30s, the Agent **MUST** terminate the process and report a system blockage.

### 3. Commit Scoped Rules
*   **MUST NOT** combine implementation and documentation in a single commit unless they are fundamentally inseparable.
*   **MUST NOT** include vendors, binaries, or build artifacts unless explicitly requested.
*   **MUST** verify that no `.lock` files remain in the `.git/` directory before concluding the session.

### 4. Failure Handling
*   If a merge conflict occurs during `pull --rebase`, the Agent **MUST** stop and request human intervention.
*   If the working tree remains "dirty" (untracked/unstaged files) after the intended task, the Agent **MUST** justify the residue or clean it before exit.

---
*Enforced by Engineering Governance. Reference: docs/engineering/GIT_RULES_FOR_AGENTS.md*
