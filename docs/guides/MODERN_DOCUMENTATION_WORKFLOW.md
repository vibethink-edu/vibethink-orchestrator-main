# 📝 VibeThink Modern Documentation Workflow

> **Quick Reference Guide** - Keep this handy for daily development.

## 1. The Golden Rule: "Rolling Truth"
- **Docs live in the repo**, next to the code.
- If you code it, you document it (updates).
- Avoid "Stale" docs: Delete them if they are wrong. A missing doc is better than a lying doc.

## 2. When do I update `CHANGELOG.md`?
Update the **[Unreleased]** section at the top of `CHANGELOG.md` when:
- ✅ You merge a new Feature (`Added`).
- 🐛 You fix a bug affecting users (`Fixed`).
- ⚠️ You change existing behavior (`Changed`).
- 👮 You deprecate something (`Deprecated`).

**Don't** update for:
- Typo fixes, internal refactors (unless risky), or CI tweaks.

## 3. How to Version a Component?
We use **Independent Versioning**. When `apps/dashboard` is ready for release:
1. **Check**: Does it have changes in `CHANGELOG.md`?
2. **Bump**: Update `version` in `apps/dashboard/package.json` (e.g., `0.2.0` -> `0.3.0`).
3. **Release**: Move the `[Unreleased]` items in the Changelog to a new header `## [0.3.0] - YYYY-MM-DD`.
4. **Tag**: `git tag apps/dashboard@0.3.0`.

## 4. Vendor Updates (Shadcn / Bundui)
If you copy/paste a new component from a vendor:
1. **Don't** just paste and forget.
2. **Update**: `docs/references/VENDOR_VERSIONS.md`.
3. **Log**: "Updated Button component from Shadcn vX.Y.Z".
4. This keeps CodeRabbit (and auditors) happy about "External Code".

## 5. Decision Records (ADR/PDR)
- **Big Decision?** (e.g., "Changing DB", "New Auth System") -> Create a **PDR** in `docs/governance/decisions/`.
- **Small Decision?** (e.g., "Renaming a variable") -> Just do it.

## 6. Where goes what?
- **Architecture**: `docs/architecture/` (Technical Spec)
- **Governance**: `docs/standards/` (Rules, Policies, Versioning)
- **API**: `docs/api/` (Swagger, Interfaces)
- **History**: `docs/history/` (Old chaotic stuff - graveyard)

---
**Status**: ACTIVE
**Enforced By**: CodeRabbit & CI
