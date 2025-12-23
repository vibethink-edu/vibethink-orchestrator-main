# AI Agent Context - Master Reference Index

**Version:** 1.0.0  
**Status:** ✅ MASTER REFERENCE  
**Last Updated:** 2025-12-23  
**Purpose:** Central index for ALL AI agents - NO isolated decisions

---

## 🎯 Purpose

This is the **MASTER REFERENCE** that ALL AI agents MUST consult. Every decision, standard, and process is indexed here to ensure NO AI agent operates in isolation.

---

## 📚 Complete Documentation Index

### 1. Standards (MANDATORY)

#### GLOBAL_MULTILINGUAL_STANDARD.md
**Location:** `docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md`  
**Status:** ✅ MANDATORY  
**AI Agents MUST know:**
- 7 languages are MANDATORY (EN, ES, AR, ZH, FR, PT, DE)
- ZERO TOLERANCE for hardcoded strings
- English is fallback language
- Auto-translation workflow required
- UTF-8 encoding everywhere

**When to reference:**
- Creating ANY new UI element
- Adding ANY user-facing text
- Implementing ANY new module
- Reviewing ANY code

---

#### THIRD_PARTY_COMPONENT_ADAPTATION.md
**Location:** `docs/standards/THIRD_PARTY_COMPONENT_ADAPTATION.md`  
**Status:** ✅ MANDATORY  
**AI Agents MUST know:**
- 5-phase adaptation workflow
- Wrapper pattern strategy
- Patch-package usage
- Testing requirements (all 7 languages)

**When to reference:**
- Integrating shadcn/ui components
- Adding bundui components
- Using ANY third-party library with UI
- Updating external dependencies

---

#### PLAN_BASED_FEATURE_ACCESS.md
**Location:** `docs/standards/PLAN_BASED_FEATURE_ACCESS.md`  
**Status:** ✅ MANDATORY  
**AI Agents MUST know:**
- 4 subscription tiers (Free, Starter, Pro, Enterprise)
- Feature access matrix
- Feature-locked messages (7 languages)
- Server-side validation required

**When to reference:**
- Implementing ANY new feature
- Discussing features with user
- Suggesting upgrades
- Validating user access

---

#### WEB_TAGGING_COMPLETE_REFERENCE.md
**Location:** `docs/standards/WEB_TAGGING_COMPLETE_REFERENCE.md`  
**Status:** ✅ COMPLETE REFERENCE  
**AI Agents MUST know:**
- Google Analytics 4 setup
- All meta tags (SEO, OG, Twitter)
- Structured data (Schema.org)
- Multilingual hreflang (7 languages)
- PWA manifest configuration

**When to reference:**
- Creating ANY new page
- Implementing SEO
- Setting up analytics
- Configuring meta tags
- **NEVER ask user about these topics**

---

#### I18N_QUALITY_ASSURANCE.md
**Location:** `docs/standards/I18N_QUALITY_ASSURANCE.md`  
**Status:** ✅ MANDATORY  
**AI Agents MUST know:**
- Quality rules per module
- AI context requirement for EVERY string
- Translation context schema
- Context file structure (.context.json)
- Quality metrics and scoring

**When to reference:**
- Creating translation files
- Adding new strings
- Reviewing translation quality
- Implementing i18n

---

### 2. Architecture

#### CONTEXTUAL_MEMORY_SYSTEM.md
**Location:** `docs/architecture/CONTEXTUAL_MEMORY_SYSTEM.md`  
**Status:** ✅ DESIGN SPECIFICATION  
**AI Agents MUST know:**
- User "digital shadow" concept
- 9 data sources to capture
- User profile schema
- AI context injection
- Privacy & GDPR compliance

**When to reference:**
- Implementing user tracking
- Building user profiles
- Personalizing experience
- Storing user preferences

---

### 3. Guides

#### ENTERPRISE_I18N_CONFIGURATION.md
**Location:** `docs/guides/ENTERPRISE_I18N_CONFIGURATION.md`  
**Status:** ✅ REFERENCE GUIDE  
**AI Agents MUST know:**
- 4 configuration levels (Global, Org, Team, User)
- Database schema for org settings
- Custom terminology per organization
- Translation override hierarchy

**When to reference:**
- Implementing org-level settings
- Customizing translations
- Managing glossaries
- Enterprise features

---

### 4. Processes

#### LANG_QUALITY_VALIDATION.md
**Location:** `docs/processes/LANG_QUALITY_VALIDATION.md`  
**Status:** ✅ MANDATORY PROCESS  
**AI Agents MUST know:**
- 5 quality levels (0-5)
- 5 validation dimensions
- Quality scoring system
- Certification process
- Commands: `npm run lang-quality`

**When to reference:**
- Validating module quality
- Certifying modules
- Checking translation completeness
- Running quality checks

---

## 🤖 AI Agent Decision Matrix

### When User Asks About...

| Topic | AI Agent MUST | Reference Document |
|-------|---------------|-------------------|
| **Languages** | State 7 languages are mandatory | GLOBAL_MULTILINGUAL_STANDARD.md |
| **Hardcoded strings** | Reject immediately, cite zero tolerance | GLOBAL_MULTILINGUAL_STANDARD.md |
| **Third-party components** | Follow 5-phase workflow | THIRD_PARTY_COMPONENT_ADAPTATION.md |
| **Feature access** | Check plan requirements | PLAN_BASED_FEATURE_ACCESS.md |
| **SEO/Meta tags** | Use complete reference, NEVER ask | WEB_TAGGING_COMPLETE_REFERENCE.md |
| **Translation quality** | Run validation, check score | I18N_QUALITY_ASSURANCE.md, LANG_QUALITY_VALIDATION.md |
| **User preferences** | Reference contextual memory | CONTEXTUAL_MEMORY_SYSTEM.md |
| **Org settings** | Check enterprise guide | ENTERPRISE_I18N_CONFIGURATION.md |

---

## 🚫 AI Agent MUST NEVER

1. **Ask about supported languages**
   - Answer: 7 languages (EN, ES, AR, ZH, FR, PT, DE)
   - Reference: GLOBAL_MULTILINGUAL_STANDARD.md

2. **Accept hardcoded strings**
   - Answer: Zero tolerance, must use t()
   - Reference: GLOBAL_MULTILINGUAL_STANDARD.md

3. **Ask about meta tags**
   - Answer: Use WEB_TAGGING_COMPLETE_REFERENCE.md
   - Reference: WEB_TAGGING_COMPLETE_REFERENCE.md

4. **Implement features without plan check**
   - Answer: Check PLAN_BASED_FEATURE_ACCESS.md first
   - Reference: PLAN_BASED_FEATURE_ACCESS.md

5. **Skip translation context**
   - Answer: Every string needs AI context
   - Reference: I18N_QUALITY_ASSURANCE.md

6. **Forget user preferences**
   - Answer: Check contextual memory system
   - Reference: CONTEXTUAL_MEMORY_SYSTEM.md

---

## 📋 Quick Reference Checklist

**Before ANY code change, AI Agent MUST check:**

- [ ] Does it involve user-facing text? → Check GLOBAL_MULTILINGUAL_STANDARD.md
- [ ] Does it use third-party components? → Check THIRD_PARTY_COMPONENT_ADAPTATION.md
- [ ] Does it add a feature? → Check PLAN_BASED_FEATURE_ACCESS.md
- [ ] Does it add a page? → Check WEB_TAGGING_COMPLETE_REFERENCE.md
- [ ] Does it add translations? → Check I18N_QUALITY_ASSURANCE.md
- [ ] Does it track user data? → Check CONTEXTUAL_MEMORY_SYSTEM.md
- [ ] Is it for an organization? → Check ENTERPRISE_I18N_CONFIGURATION.md

---

## 🔄 Update Protocol

**When ANY standard is updated:**

1. Update the source document
2. Update this master index
3. Update AI agent prompts
4. Notify all active agents
5. Update version number
6. Commit with clear message

**Version History:**
- v1.0.0 (2025-12-23): Initial master index created

---

## 🎯 AI Agent Responsibilities

### Every AI Agent MUST:

1. **Read this index FIRST** before any task
2. **Reference appropriate docs** for every decision
3. **NEVER operate in isolation** - always check standards
4. **Update context** when learning new user preferences
5. **Validate quality** before marking work complete
6. **Follow processes** exactly as documented
7. **Never ask repetitive questions** - answers are in docs

---

## 📊 Current Implementation Status

### Modules Validated

| Module | Quality Score | Level | Status |
|--------|---------------|-------|--------|
| navigation | 95% | 5 | ✅ Certified |
| projects | 90% | 4 | ✅ Certified |

**Run validation:** `npm run lang-quality --all`

---

## 🔗 Related Files

### Translation Files
- `apps/dashboard/src/lib/i18n/translations/*/navigation.json`
- `apps/dashboard/src/lib/i18n/translations/*/projects.json`
- `apps/dashboard/src/lib/i18n/translations/*/navigation.context.json`

### Scripts
- `scripts/lang-quality.js` - Quality validation
- `scripts/validate-i18n-completeness.ts` - Completeness check

### Configuration
- `apps/dashboard/src/lib/i18n/types.ts` - Locale types
- `apps/dashboard/src/lib/i18n/config.ts` - i18n config
- `apps/dashboard/src/lib/i18n/locale-config.ts` - Locale settings

---

## 💡 AI Agent Best Practices

### DO:
- ✅ Consult this index before EVERY task
- ✅ Reference specific documents for decisions
- ✅ Follow established patterns
- ✅ Validate quality before completion
- ✅ Update user context continuously
- ✅ Use established commands and tools

### DON'T:
- ❌ Make isolated decisions
- ❌ Ask questions answered in docs
- ❌ Skip quality validation
- ❌ Ignore plan requirements
- ❌ Forget user preferences
- ❌ Create inconsistent patterns

---

## 🚀 Quick Commands

```bash
# Validate language quality
npm run lang-quality --module=navigation
npm run lang-quality --all

# Check translation completeness
npm run validate:i18n --module=navigation

# Run all validations
npm run validate:all
```

---

## 📞 Escalation Path

**If AI Agent encounters:**

1. **Unclear requirement** → Check this index first
2. **Missing documentation** → Create issue, document decision
3. **Conflicting standards** → Escalate to CTO
4. **New pattern needed** → Document, get approval, update index
5. **User asks for exception** → Reference standard, explain why

---

## ✅ Certification

**This master index certifies that:**
- All standards are documented
- All processes are defined
- All AI agents have access
- No decisions are isolated
- Everything is traceable

**Approved by:** Marcelo Escallón (CTO)  
**Date:** 2025-12-23  
**Version:** 1.0.0  
**Status:** ✅ ACTIVE - ALL AI AGENTS MUST FOLLOW

---

**🎯 REMEMBER: This is the SINGLE SOURCE OF TRUTH for all AI agents. NO isolated decisions allowed.**
