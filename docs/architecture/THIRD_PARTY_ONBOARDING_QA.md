# Third-Party Component Onboarding QA Checklist

**Version:** 1.0.0  
**Last Updated:** 2025-12-25  
**Purpose:** Validate if a third-party component is compatible with VibeThink's technology stack before integration.

---

## 🎯 Overview

Before adding any third-party component to the Asset Library or integrating it into the Orchestrator, it MUST pass this QA checklist. This prevents wasting time on incompatible components.

---

## ✅ Pre-Integration Checklist

### 1. Technology Stack Compatibility

#### React Version
- [ ] **React 19 Compatible?**
  - Component works with React 19.x (our standard)
  - OR: Component explicitly supports React 18.x with clear upgrade path
  - ❌ REJECT if: Only works with React 16.x or older

#### TypeScript Support
- [ ] **TypeScript Native?**
  - Component is written in TypeScript
  - OR: Has official TypeScript definitions (@types)
  - ⚠️ WARNING if: No types (requires manual typing)
  - ❌ REJECT if: Incompatible with TypeScript strict mode

#### Next.js Compatibility
- [ ] **Next.js 15 Compatible?**
  - Works with Next.js App Router (our architecture)
  - No reliance on Pages Router only features
  - Compatible with Server Components (or clearly client-only)
  - ❌ REJECT if: Requires Pages Router exclusively

#### Styling System
- [ ] **Tailwind CSS Compatible?**
  - Uses Tailwind CSS (preferred)
  - OR: Uses CSS-in-JS that doesn't conflict with Tailwind
  - OR: Uses plain CSS that can be converted to Tailwind
  - ⚠️ WARNING if: Uses styled-components (adds bundle size)
  - ❌ REJECT if: Requires incompatible CSS framework (Bootstrap, Material-UI base styles)

---

### 2. Architecture Compatibility

#### Component Structure
- [ ] **Modular & Composable?**
  - Component can be used standalone
  - Doesn't require entire library to function
  - Can be extracted as single file(s)
  - ❌ REJECT if: Tightly coupled to framework we don't use

#### State Management
- [ ] **State Management Compatible?**
  - Uses React hooks (useState, useEffect, etc.)
  - OR: No state management (pure component)
  - ⚠️ WARNING if: Uses Redux (we don't use Redux)
  - ❌ REJECT if: Requires incompatible state library (MobX, Recoil)

#### Dependencies
- [ ] **Reasonable Dependencies?**
  - Dependencies are actively maintained
  - No deprecated packages
  - Total bundle size impact < 100KB (uncompressed)
  - ⚠️ WARNING if: 100-500KB impact
  - ❌ REJECT if: > 500KB or includes duplicate dependencies

---

### 3. VibeThink-Specific Requirements

#### Internationalization (i18n)
- [ ] **i18n Adaptable?**
  - All user-facing text is in variables/props (not hardcoded)
  - OR: Text is clearly identifiable for extraction
  - ✅ BONUS if: Already supports i18next
  - ⚠️ WARNING if: Some hardcoded text (requires manual extraction)
  - ❌ REJECT if: Text is deeply embedded in logic (impossible to translate)

#### Design Tokens
- [ ] **Design Token Compatible?**
  - Colors are in CSS variables or props
  - OR: Colors are clearly defined in one place
  - Spacing uses standard units (rem, px)
  - ⚠️ WARNING if: Colors scattered across files
  - ❌ REJECT if: Colors are magic numbers throughout code

#### Dark Mode
- [ ] **Dark Mode Support?**
  - Supports dark mode out of the box
  - OR: Uses CSS variables that can be themed
  - ⚠️ WARNING if: Requires manual dark mode implementation
  - ❌ REJECT if: Hardcoded light colors that break dark mode

#### Accessibility (a11y)
- [ ] **Accessible?**
  - Semantic HTML (proper tags)
  - Keyboard navigation support
  - ARIA labels where needed
  - ⚠️ WARNING if: Missing some a11y features (we can add)
  - ❌ REJECT if: Fundamentally inaccessible (div soup, no keyboard support)

---

### 4. Legal & Licensing

#### License Compatibility
- [ ] **License Allows Commercial Use?**
  - MIT, Apache 2.0, BSD (✅ SAFE)
  - ISC, Unlicense (✅ SAFE)
  - ⚠️ WARNING if: GPL (requires legal review)
  - ❌ REJECT if: Proprietary license without commercial rights

#### Attribution Requirements
- [ ] **Attribution Documented?**
  - License requirements are clear
  - Attribution method is documented
  - We can comply with license terms

---

### 5. Quality & Maintenance

#### Code Quality
- [ ] **Clean Code?**
  - Code is readable and well-structured
  - No obvious bugs or anti-patterns
  - Follows modern React best practices
  - ⚠️ WARNING if: Messy but functional (we can refactor)
  - ❌ REJECT if: Spaghetti code or security issues

#### Maintenance Status
- [ ] **Actively Maintained?**
  - Last update within 6 months
  - OR: Stable/complete (no updates needed)
  - Active community or support
  - ⚠️ WARNING if: Last update 6-12 months ago
  - ❌ REJECT if: Abandoned (2+ years no updates) with known issues

#### Documentation
- [ ] **Documented?**
  - Has usage examples
  - Props/API are documented
  - OR: Code is self-explanatory
  - ⚠️ WARNING if: Minimal docs (we can figure it out)
  - ❌ REJECT if: No docs and code is unclear

---

## 📊 Scoring System

### Pass Criteria
- **All ✅ Required items:** MUST pass
- **⚠️ Warnings:** Max 3 warnings allowed
- **❌ Rejects:** ANY reject = component is rejected

### Decision Matrix

| Score | Decision | Action |
|-------|----------|--------|
| All ✅, 0-1 ⚠️ | **APPROVED** | Add to Asset Library, integrate freely |
| All ✅, 2-3 ⚠️ | **CONDITIONAL** | Add to Asset Library, document warnings |
| Any ❌ | **REJECTED** | Do not add, find alternative |

---

## 🔍 Example Evaluation

### Example: Hero Section from shadcnblocks.com

```markdown
✅ React 19 Compatible
✅ TypeScript Native
✅ Next.js 15 Compatible
✅ Tailwind CSS (perfect match)
✅ Modular (single component)
✅ React hooks only
✅ Small dependencies (<50KB)
⚠️ i18n: Some hardcoded text (extractable)
✅ Design tokens: Uses CSS variables
✅ Dark mode: Fully supported
✅ Accessible: Semantic HTML + ARIA
✅ MIT License
✅ Clean code
✅ Active maintenance
✅ Well documented

Score: 13/14 ✅, 1 ⚠️
Decision: APPROVED ✅
```

### Example: Old jQuery Plugin

```markdown
❌ React 19: Not React-based
❌ TypeScript: No types
❌ Next.js: Requires DOM manipulation
⚠️ Tailwind: Uses inline styles
❌ Modular: Requires entire jQuery
...

Score: Multiple ❌
Decision: REJECTED ❌
```

---

## 🛠️ Integration Checklist (After Approval)

Once a component passes QA, follow this integration checklist:

### Phase 1: Add to Asset Library
- [ ] Create provider folder (if new provider)
- [ ] Add component source code
- [ ] Create README.md with QA results
- [ ] Document license and attribution
- [ ] Note any warnings from QA

### Phase 2: Adapt for VibeThink
- [ ] Extract all hardcoded text
- [ ] Add i18n support (useTranslation)
- [ ] Replace colors with design tokens
- [ ] Add TypeScript strict types (if needed)
- [ ] Test in dark mode
- [ ] Verify accessibility
- [ ] Add source header comment

### Phase 3: Quality Assurance
- [ ] Component builds without errors
- [ ] Component works in dev mode
- [ ] Component works in production build
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

### Phase 4: Documentation
- [ ] Update SYNC_STATUS.md in Asset Library
- [ ] Add usage examples in Orchestrator
- [ ] Document any VibeThink-specific adaptations
- [ ] Update component inventory

---

## 📝 QA Report Template

Use this template when evaluating a new component:

```markdown
# QA Report: [Component Name]

**Provider:** [Provider Name]
**Source:** [URL]
**Evaluated by:** [Your Name]
**Date:** YYYY-MM-DD

## Technology Stack
- React 19: ✅/⚠️/❌
- TypeScript: ✅/⚠️/❌
- Next.js 15: ✅/⚠️/❌
- Tailwind CSS: ✅/⚠️/❌

## Architecture
- Modular: ✅/⚠️/❌
- State Management: ✅/⚠️/❌
- Dependencies: ✅/⚠️/❌

## VibeThink Requirements
- i18n Adaptable: ✅/⚠️/❌
- Design Tokens: ✅/⚠️/❌
- Dark Mode: ✅/⚠️/❌
- Accessibility: ✅/⚠️/❌

## Legal
- License: ✅/⚠️/❌
- Attribution: ✅/⚠️/❌

## Quality
- Code Quality: ✅/⚠️/❌
- Maintenance: ✅/⚠️/❌
- Documentation: ✅/⚠️/❌

## Final Decision
**Status:** APPROVED / CONDITIONAL / REJECTED

**Warnings:**
- [List any warnings]

**Notes:**
- [Additional notes]

**Recommended Actions:**
- [What needs to be done during integration]
```

---

## 🚨 Common Rejection Reasons

### Top reasons components get rejected:

1. **React Version Incompatibility**
   - Component only works with old React versions
   - Uses deprecated lifecycle methods

2. **Styling Conflicts**
   - Requires Bootstrap or Material-UI base
   - Inline styles that can't be overridden

3. **Bundle Size**
   - Adds 1MB+ to bundle
   - Includes entire icon library for one icon

4. **Licensing Issues**
   - No commercial use allowed
   - Unclear or restrictive license

5. **Maintenance**
   - Abandoned with known security issues
   - Incompatible with modern tooling

---

## 📞 Questions?

**For Developers:**
- Use this checklist BEFORE adding to Asset Library
- Document QA results in component README
- Ask Architecture team if unsure about any criteria

**For Architecture Team:**
- Review QA reports for CONDITIONAL approvals
- Update this checklist as stack evolves
- Maintain list of approved/rejected components

---

**Last Updated:** 2025-12-25  
**Maintained by:** VibeThink Architecture Team  
**Version:** 1.0.0
