# Audit Worktree Sync Rule

**Status:** ACTIVE  
**Version:** v1.0  
**Effective Date:** 2026-01-09  
**Applies to:** All audits (technical, security, billing, governance)

---

## Rule

All audits MUST be performed on a worktree that is fully synchronized with `origin/main` at the time of the audit.

Audits performed on branches or worktrees that do not contain the latest commits from `origin/main` are considered **INVALID** and MUST be rejected.

## Rationale

An audit can only verify what is present in the audited worktree. If the audited branch is behind `origin/main`, canonical policies, standards, or critical fixes may not be visible to the auditor. This leads to false findings, confusion, and operational inefficiency.

## Enforcement

Before starting an audit, the auditor (or the engineer requesting the audit) MUST verify synchronization:

```bash
git fetch origin
git status
# Verify branch is up to date with origin/main
git log --oneline --decorate -5
```

If the local branch is behind `origin/main`, it **MUST** be updated (e.g., `git pull origin main`) before the audit process begins.

---

**Approved by**: Engineering Governance
