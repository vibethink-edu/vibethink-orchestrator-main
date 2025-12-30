# START_HERE

Rule of Gold: If it is not in GitHub, it does not exist.

This is the universal protocol for work in this repo. Follow it end-to-end.

## START (60s)
```bash
git fetch --prune origin
git status -sb
git branch --show-current
git switch -c <branch> origin/main
```

## WORK
- One task, one branch.
- Atomic commits only. No mixed concerns.
- Never use `git add .` or `git commit -a`.

## TEST (before PR)
Run the minimum checks required by your change scope.
```bash
# Example: use the project-defined scripts for your area
npm run test:ci
npm run i18n:validate
```
If a command is not applicable, state it in the PR.

## PR
- Open a PR from your branch.
- Use draft PR if WIP.
- PR must include: purpose, scope, tests run (or why not), risks.

## CI
- No merge on red.
- Fix or explain failures before review.

## END (2-5 min)
Publish everything you touched.
```bash
git status -sb
git push -u origin <branch>
```
If you cannot finish, use RESCUE (below).

## WIP + TTL
- Normal work: 7 days max.
- Hotfix: 48 hours max.
When TTL expires: push a rescue snapshot and update handoff docs.

## RESCUE snapshot (when WIP must be preserved)
```bash
git switch -c rescue/<topic>-YYYYMMDD
git push -u origin rescue/<topic>-YYYYMMDD
```
Document the snapshot in `docs/ai-coordination/SESSION_HANDOFF_CURRENT.md`.

## What NOT to do
- Work directly on `main`.
- Use `git add .` or commit unknown files.
- Leave valuable work only local.

## Links
- `docs/FOUNDATION/FOUNDATION_CANON.md`
- `docs/FOUNDATION/WORKTREES.md`
- `docs/FOUNDATION/LOCKS.md`
