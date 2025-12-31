# FIT-008 — Rich Text i18n Compliance (TipTap)

**Status:** FIT (P1)  
**Last updated:** 2025-12-31

---

## Purpose

Garantizar que cualquier superficie de Rich Text (TipTap u otro) cumpla el protocolo i18n:
- cero strings hardcoded visibles al usuario
- placeholders/tooltips/empty states traducibles
- aria-labels localizables

---

## Scope

-Surfaces que usan `MinimalTiptapEditor` desde `@vibethink/ui`
-Modales y componentes de notas / editor

---

## Contract

### C1 — No Hardcoded UI Strings

Todo texto visible al usuario debe salir de `t()` o terminology.

**Incluye:**
- Dialog titles
- Buttons
- Placeholders
- Tooltips
- Empty states
- Command palette results
- aria-labels

### C2 — i18n Injection

El editor debe aceptar labels vía:
- props (dictionary/labels) o
- hook/context (t) o
- wrapper canonical (`@/ui/richtext/*`)

### C3 — Persist Format Disclosure

El formato persistido (HTML/JSON/Markdown) debe estar declarado en docs/canon.

---

## Verification (current)

- `rg` scan for hardcoded strings in richtext surfaces
- Manual UI check: cambiar idioma y verificar que toolbar/placeholders cambian

---

## Current Evidence (FAIL)

**Found 11 hardcoded strings in notes modal surface** using `MinimalTiptapEditor`:

**File:** `apps/dashboard/app/dashboard-bundui/notes/add-note-modal.tsx`

1. Line 49: `"Add Note"` (button text)
2. Line 66: `"Add Note"` (DialogTitle)
3. Line 72: `"Title"` (input placeholder)
4. Line 83: `"Enter note description..."` (editor placeholder)
5. Line 110: `"Add image"` (tooltip)
6. Line 123: `"Search tags..."` (command input placeholder)
7. Line 125: `"No labels found."` (CommandEmpty)
8. Line 166: `"Add tag"` (tooltip)
9. Line 174: `"Archive"` (tooltip)
10. Line 182: `"Delete"` (tooltip)
11. Line 186: `"Add Note"` (submit button)

**Additional concerns:**
- MinimalTiptapEditor **does NOT accept i18n labels via props** (no dictionary/labels parameter)
- Toolbar sections (SectionTwo, SectionFour) likely have hardcoded tooltips for Bold/Italic/etc.
- LinkBubbleMenu may have hardcoded "Edit link" / "Remove link" strings

**Persist format:** HTML (`output="html"` in add-note-modal.tsx line 82)
- ⚠️ Risk: HTML as source of truth (not documented, no sanitization visible)

---

## Actions Required (P1)

### Priority 1: Surface i18n (notes modal)
- Replace all 11 hardcoded strings with `t('notes.addNote')` etc.
- Add namespace `notes.json` with translations for 9 languages

### Priority 2: Editor Boundary Enhancement
- Extend `MinimalTiptapProps` to accept optional `labels` dictionary
- Pass labels to toolbar sections (SectionTwo, SectionFour, LinkBubbleMenu)
- Default to English if labels not provided (backward compatible)

### Priority 3: Canon Documentation
- Document persist format decision (HTML vs JSON vs Markdown)
- Add sanitization requirement if HTML is source of truth

---

## Outcome

- **Current Status:** ❌ FAIL
- **Target:** ✅ PASS after i18n refactor of notes modal + editor boundary enhancement

---

## Related

- `docs/canon/CRITICAL_DEPENDENCY_GOVERNANCE.md` (TipTap is Distance 1-2)
- `docs/registry/CRITICAL_PROVIDERS.md` (TipTap ecosystem: 11 packages)
- `docs/standards/THIRD_PARTY_COMPONENT_ADAPTATION.md` (i18n wrapper protocol)
