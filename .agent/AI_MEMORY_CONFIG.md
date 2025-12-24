# AI Agent Memory Configuration

**Purpose:** Ensure AI agents ALWAYS remember critical rules  
**Status:** 🔴 MANDATORY

---

## 📚 **Documents to ALWAYS Load**

These documents MUST be in AI agent's active memory:

### **1. i18n Rules (CRITICAL)**
- `docs/standards/ABSOLUTE_I18N_RULE.md`
- `docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md`
- `.agent/AI_MANDATORY_CHECKLIST.md`

### **2. AI Guides**
- `AI_AGENT_I18N_GUIDE.md` (artifact)
- `docs/guides/HOW_TO_VALIDATE_AND_FIX_I18N.md`

### **3. Project Standards**
- `docs/standards/I18N_QUALITY_ASSURANCE.md`
- `docs/standards/THIRD_PARTY_COMPONENT_ADAPTATION.md`

---

## 🔄 **How to Add to User Rules**

**File:** User's GEMINI.md or equivalent

**Add this section:**

```markdown
## 🌍 I18N MANDATORY RULES

### ABSOLUTE RULE: Zero Hardcoded Strings

**MINIMUM:** English (en) translation for EVERY string  
**NEVER:** Hardcoded strings in ANY component (own or third-party)

**Before ANY code change:**
1. Check for UI-visible text
2. Add to `en/*.json` if new
3. Use `t()` function
4. Validate: `npm run i18n:detect-hardcoded`

**Reference:**
- `docs/standards/ABSOLUTE_I18N_RULE.md`
- `.agent/AI_MANDATORY_CHECKLIST.md`
- `AI_AGENT_I18N_GUIDE.md`

**Enforcement:** CI/CD blocking
```

---

## 🤖 **AI Agent Behavior**

### **On Every Code Suggestion:**

```
1. Load AI_MANDATORY_CHECKLIST.md
2. Scan code for strings
3. If strings found:
   a. Check if in translation file
   b. If not, add to en/*.json
   c. Use t() in code
4. Validate before commit
```

### **On Every File Edit:**

```
IF file contains JSX/TSX:
  THEN check for hardcoded strings
  IF found:
    THEN suggest translation
```

### **On Every Commit:**

```
BEFORE suggesting commit:
  1. Run i18n:detect-hardcoded
  2. Run i18n:validate
  3. If fails, fix before commit
```

---

## 📋 **Quick Checklist**

```
☐ Read AI_MANDATORY_CHECKLIST.md
☐ Scan for strings
☐ Add to en/*.json
☐ Use t() function
☐ Validate
☐ Commit
```

---

## 🎯 **Success Criteria**

AI agent successfully remembers i18n rules when:
- ✅ Never suggests hardcoded strings
- ✅ Always uses t() for UI text
- ✅ Adds new strings to en/*.json
- ✅ Validates before commit
- ✅ Suggests wrappers for third-party components

---

**Last Updated:** 2025-12-23  
**Status:** 🔴 MANDATORY
