# Quick Reference: Working with AI Agents Safely

## 🎯 For Humans (You)

### When Asking AI to "Fix" Things:

#### ✅ DO:
```
"Audit the TypeScript errors in dashboard/page.tsx.
Propose 2-3 solutions but DON'T implement yet.
Wait for my approval."
```

#### ❌ DON'T:
```
"Fix all the errors"  ← Too vague, dangerous
```

---

### When AI Proposes Large Changes:

#### ✅ DO:
- Ask for incremental approach
- Request validation at each step
- Demand explanation of "why"

#### ❌ DON'T:
- Approve blindly
- Let AI delete >50 lines without review
- Skip validation steps

---

## 🤖 For AI Agents (Claude, Gemini, etc.)

### Before Making Changes:

1. **Investigate exhaustively**
   ```bash
   # Search ENTIRE monorepo
   find . -name "*Component*"
   
   # Check exports
   cat packages/*/src/index.ts | grep Component
   
   # Verify in git history
   git log --all -- "*Component*"
   ```

2. **Propose, don't execute**
   - Present 2-3 options
   - Explain pros/cons
   - Wait for approval

3. **Validate incrementally**
   - Change 1 file → validate
   - Change 2nd file → validate
   - Never batch >5 files

---

## 🚨 Red Flags (STOP and Ask)

- Deleting >50 lines
- Using @ts-ignore
- Changing build configs
- Modifying >10 files
- "Component not found" (search harder!)

---

## 📋 Checklists

### For Code Deletion:
- [ ] Confirmed code doesn't work
- [ ] Tried less destructive alternatives
- [ ] Got explicit approval
- [ ] Documented in TECH_DEBT.md

### For @ts-ignore:
- [ ] Investigated root cause
- [ ] No direct fix available
- [ ] Using @ts-expect-error instead
- [ ] Added detailed description

### For Large Refactors:
- [ ] Proposed plan approved
- [ ] Incremental validation
- [ ] Tests passing at each step
- [ ] Documented changes

---

**Remember:** Preserve > Perfect

It's better to have working code with wrappers than broken code with "clean" architecture.
