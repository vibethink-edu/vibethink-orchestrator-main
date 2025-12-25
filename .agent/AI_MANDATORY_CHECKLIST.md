# AI AGENT MANDATORY CHECKLIST - NEVER FORGET

**THIS FILE IS READ BY AI AGENTS BEFORE ANY CODE CHANGE**

---

## 🔴 **CRITICAL RULES - ZERO TOLERANCE**

### **Rule #1: ZERO Hardcoded Strings**

```
BEFORE writing ANY code with UI text:
☐ Is there text visible to users? → MUST use t()
☐ Is it a third-party component? → Check if wrapper needed
☐ Are there placeholders? → MUST translate
☐ Are there labels? → MUST translate
☐ Are there error messages? → MUST translate
☐ Are there tooltips/aria-labels? → MUST translate
```

**MINIMUM:** English (en) translation  
**NEVER:** Hardcoded strings

---

### **Rule #2: Validation BEFORE Commit**

```
BEFORE suggesting git commit:
☐ Run: npm run i18n:detect-hardcoded
☐ Run: npm run i18n:validate
☐ Verify: All new strings in en/*.json
☐ Verify: AI context added (if new module)
```

---

### **Rule #3: Component Pattern**

```tsx
// ❌ WRONG - NEVER DO THIS
export function MyComponent() {
  return <button>Save</button>;
}

// ✅ CORRECT - ALWAYS DO THIS
import { useTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useTranslation('common');
  return <button>{t('actions.save')}</button>;
}
```

---

## 📋 **Pre-Code Checklist**

Before suggesting ANY code change:

1. **Read these files:**
   - [ ] `docs/standards/ABSOLUTE_I18N_RULE.md`
   - [ ] `AI_AGENT_I18N_GUIDE.md`
   - [ ] Module's `.context.json` (if exists)

2. **Check for strings:**
   - [ ] Any text in JSX?
   - [ ] Any string props?
   - [ ] Any template literals?

3. **If strings found:**
   - [ ] Add to `en/*.json`
   - [ ] Use `t()` function
   - [ ] Add AI context (if new)

4. **Validate:**
   - [ ] No hardcoded strings
   - [ ] Translation keys exist
   - [ ] Proper hook usage

---

## 🚨 **Red Flags - STOP and FIX**

If you see ANY of these, STOP and suggest fix:

```tsx
// 🚨 RED FLAG #1: Hardcoded text in JSX
<button>Click me</button>

// 🚨 RED FLAG #2: Hardcoded placeholder
<input placeholder="Enter name" />

// 🚨 RED FLAG #3: Hardcoded label
<label>Username</label>

// 🚨 RED FLAG #4: Hardcoded error
throw new Error("Something went wrong");

// 🚨 RED FLAG #5: Third-party with hardcoded text
<Button>Submit</Button>  // If Button is from library
```

**Action:** Suggest translation immediately

---

## 🎯 **Quick Reference**

### **Common Patterns**

```tsx
// Buttons
const { t } = useTranslation('common');
<button>{t('actions.save')}</button>

// Placeholders
<input placeholder={t('common.search')} />

// Labels
<label>{t('form.username')}</label>

// Error messages
const { t } = useTranslation('errors');
throw new Error(t('errors.generic'));

// Third-party components
import { Button } from '@/components/ui/button';
const { t } = useTranslation('common');
<Button>{t('actions.submit')}</Button>
```

### **Translation File Locations**

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── common.json       ← Generic UI strings
│   ├── errors.json       ← Error messages
│   ├── module.json       ← Module-specific
│   └── module.context.json ← AI context
```

### **Validation Commands**

```bash
# Detect hardcoded strings
npm run i18n:detect-hardcoded

# Validate translations
npm run i18n:validate

# Both
npm run i18n:check
```

---

## 📝 **Template for New Strings**

When adding new strings:

**1. Add to `en/module.json`:**
```json
{
  "section": {
    "key": "English text"
  }
}
```

**2. Add to `en/module.context.json`:**
```json
{
  "strings": {
    "section.key": {
      "context": "What this is for",
      "uiLocation": "Where it appears",
      "characterLimit": 30,
      "tone": "professional",
      "examples": {
        "en": "English text",
        "es": "Texto en español"
      }
    }
  }
}
```

**3. Use in component:**
```tsx
const { t } = useTranslation('module');
<div>{t('section.key')}</div>
```

---

## 🔄 **Workflow**

```
1. User requests feature
   ↓
2. AI reads this checklist
   ↓
3. AI identifies strings
   ↓
4. AI adds to en/*.json
   ↓
5. AI uses t() in code
   ↓
6. AI validates (no hardcoded)
   ↓
7. AI suggests commit
```

---

## 🎓 **Remember**

- **MINIMUM:** English (en) for every string
- **NEVER:** Hardcoded strings anywhere
- **ALWAYS:** Use `t()` function
- **VALIDATE:** Before every commit

---

**Last Updated:** 2025-12-23  
**Status:** 🔴 MANDATORY - READ BEFORE ANY CODE CHANGE  
**Enforcement:** Automated + AI Agent
