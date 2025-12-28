# 🔧 Scripts Directory

**Purpose:** Automation scripts for the VibeThink Orchestrator monorepo.

**Standard Compliance:** Follows `_vibethink-dev-kit` [FILE_PLACEMENT_QUICK_REFERENCE.md](https://github.com/mescallo-edu/vibethink-dev-kit/blob/main/knowledge/guides/FILE_PLACEMENT_QUICK_REFERENCE.md)

---

## 📋 Available Scripts

### 🌍 i18n & Translation Scripts

#### `audit-missing-translations-projects-v2.js` ⭐

**Purpose:** Identifies missing translation keys in the projects-v2 module across all languages.

**Usage:**
```bash
node scripts/audit-missing-translations-projects-v2.js
```

**Output:**
- **Console:** Summary by namespace and language
- **File:** `docs/testing/translation-audit-report.json`

**Example Output:**
```
📋 Namespace: projects (177 keys)
  ✅ ES: 100% (177/177)
  ✅ AR: 100% (177/177)
  ⚠️ FR: 96.0% (170/177) - 7 keys missing
  ⚠️ DE: 91.5% (162/177) - 15 keys missing

Total Missing Keys: 138
```

**When to Use:**
- Before translating (to know scope)
- After translating (to validate 100%)
- In CI/CD (to detect regressions)

---

#### `complete-missing-translations.js` ⭐ RECOMMENDED

**Purpose:** Translates ONLY missing keys using Anthropic Claude API (smart merge approach).

**Prerequisites:**
- `ANTHROPIC_API_KEY` in `.env`
- Audit report generated

**Usage:**
```bash
# 1. Add API key to .env
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." >> .env

# 2. Test API key
node scripts/test-anthropic-key.js

# 3. Run translation
node scripts/complete-missing-translations.js

# 4. Validate completion
node scripts/audit-missing-translations-projects-v2.js
```

**Features:**
- ✅ Smart merge (preserves existing translations)
- ✅ Batch processing (20 keys per API call)
- ✅ Rate limiting (1 second between batches)
- ✅ Context-aware prompts per language
- ✅ Handles nested JSON keys
- ✅ Preserves placeholders ({{count}}, {name}, etc.)

**Estimated Time:** 10-15 minutes for 138 keys
**Estimated Cost:** $0.50-$1.00 USD (Claude Sonnet 4.5)

**Documentation:** [I18N_TRANSLATION_STRATEGIES.md](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md)

---

#### `complete-missing-translations-zai.js`

**Purpose:** Template for translation using Z.AI Translation Agent.

**Prerequisites:**
- Z.AI SDK installed
- Function `translateKeysWithZAI()` implemented

**Status:** 🚧 Template (requires Z.AI adapter implementation)

**Usage:**
```bash
# 1. Implement translateKeysWithZAI() function
# See: https://docs.z.ai/guides/agents/translation

# 2. Run translation
node scripts/complete-missing-translations-zai.js
```

**Advantages vs Anthropic:**
- 30-50% more cost-effective
- Automatic rate limiting
- Built-in batch optimization
- No manual response parsing needed

**Documentation:** [I18N_TRANSLATION_STRATEGIES.md](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md#estrategia-3-traducción-con-zai-translation-agent-recomendada)

---

#### `test-anthropic-key.js`

**Purpose:** Validates that ANTHROPIC_API_KEY is functional.

**Usage:**
```bash
node scripts/test-anthropic-key.js
```

**Success Output:**
```
✅ SUCCESS! API key is valid.
Response: API key works!

✅ Ready to run translation script!
```

**Error Output:**
```
❌ FAILED! API key is invalid or expired.
Error: 401 token expired or incorrect

Please check your API key at: https://console.anthropic.com/
```

---

#### `translate-namespace.js`

**Purpose:** Translates a COMPLETE namespace to a specific language (full re-translation).

**Usage:**
```bash
node scripts/translate-namespace.js <namespace> <locale>

# Examples:
node scripts/translate-namespace.js projects es
node scripts/translate-namespace.js common fr
```

**⚠️ Warning:** Overwrites complete file (no merge).

**When to Use:**
- New language (file doesn't exist)
- New namespace
- Complete re-translation needed

**When NOT to Use:**
- Completing missing keys → Use `complete-missing-translations.js`

---

#### `translate-namespace-google.js`

**Purpose:** Similar to `translate-namespace.js` but using Google Translate API.

**Prerequisites:**
- `GOOGLE_TRANSLATE_API_KEY` in `.env`

**Usage:**
```bash
node scripts/translate-namespace-google.js <namespace> <locale>
```

**Advantages:**
- More cost-effective than Anthropic
- Faster

**Disadvantages:**
- Lower quality for UI text
- Less context-aware

---

#### Translation Workflow (Recommended)

```bash
# COMPLETE TRANSLATION WORKFLOW

# 1. Audit to identify missing keys
node scripts/audit-missing-translations-projects-v2.js
# Output: 138 keys missing

# 2. Add API key (if not exists)
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env

# 3. Test API key
node scripts/test-anthropic-key.js
# Output: ✅ SUCCESS!

# 4. Translate only missing keys (smart merge)
node scripts/complete-missing-translations.js
# Time: ~15 minutes
# Cost: ~$0.50-1.00

# 5. Validate 100% completion
node scripts/audit-missing-translations-projects-v2.js
# Output: Total Missing Keys: 0 ✅

# 6. Commit changes
git add apps/dashboard/src/lib/i18n/translations/
git commit -m "feat(i18n): Complete missing translations"
git push
```

**Total Time:** ~20 minutes
**Total Cost:** $0.50-$1.00 USD

---

### Development Scripts

#### `start-dashboard.ps1`
**Purpose:** Start the Pana Dashboard development server on port 3005.

**Usage:**
```powershell
.\scripts\start-dashboard.ps1
```

**Features:**
- ✅ Port conflict detection (checks if 3005 is in use)
- ✅ Clean startup with validation
- ✅ User-friendly error messages

**Port:** 3005 (consistent with dashboard configuration)

---

#### `stop-dashboard.ps1`
**Purpose:** Stop the Pana Dashboard development server and clean up processes.

**Usage:**
```powershell
.\scripts\stop-dashboard.ps1
```

**Features:**
- ✅ Kills process on port 3005
- ✅ Cleans up orphaned Node.js processes
- ✅ Safe force termination

---

### Validation Scripts

#### `validate-package-json-syntax.js`
**Purpose:** Validate package.json files for npm compatibility.

**Usage:**
```bash
node scripts/validate-package-json-syntax.js
```

**Features:**
- ✅ Detects `workspace:*` protocol usage (pnpm/yarn only)
- ✅ Validates version format compatibility
- ✅ Checks for missing required fields
- ✅ Color-coded output for errors and warnings
- ✅ Provides fix suggestions

**Exit Codes:**
- `0` - All package.json files are valid
- `1` - Found errors that need to be fixed

**Detects:**
- ❌ `workspace:*` protocol (incompatible with npm)
- ⚠️ Wildcard versions (`"*"`)
- ⚠️ File protocol usage
- ⚠️ Missing name or version fields

**Example Output:**
```
🔍 Validating package.json files...

Found 12 package.json files

✅ All package.json files are valid!
```

**When to Use:**
- Before committing changes to package.json
- After copying package.json from other projects
- When encountering `EUNSUPPORTEDPROTOCOL` errors
- During migration from pnpm/yarn to npm

**Related Documentation:**
- [PACKAGE_MANAGER_COMPATIBILITY.md](../docs/architecture/PACKAGE_MANAGER_COMPATIBILITY.md)
- [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md#incident-cannot-find-module-autoprefixer-build-error)

---

### UI Component Scripts

#### `update-shadcn.js`
**Purpose:** Update Shadcn UI components from official GitHub repository.

**Usage:**
```bash
# Update all components
npm run update:ui:all

# Update specific component
npm run update:ui

# List available components
npm run update:ui:list
```

**Documentation:** See [README-UPDATE-SHADCN.md](./README-UPDATE-SHADCN.md)

---

## 🛡️ Guardrails & Standards

### ✅ Script Placement Rules

According to `_vibethink-dev-kit` standards:

**✅ CORRECT Locations:**
- `scripts/` - Automation and workflow scripts (this directory)
- `dev-tools/automation/` - Development automation scripts
- `dev-tools/validation/` - Validation scripts
- `dev-tools/utilities/` - Utility scripts

**❌ FORBIDDEN Locations:**
- `apps/[app]/` - Scripts should NOT be in app directories
- Root directory - Only configuration files allowed
- `src/` - Not source code
- `docs/` - Not documentation

### 📝 Naming Conventions

**Format:** `verb-noun.ps1` or `verb-noun.js`

**Examples:**
- ✅ `start-dashboard.ps1`
- ✅ `stop-dashboard.ps1`
- ✅ `update-shadcn.js`
- ❌ `start.ps1` (too generic)
- ❌ `dashboardStart.ps1` (wrong case)

---

## 🚨 Violation Detection

If you find scripts in incorrect locations, run:

```bash
npm run validate:arch
```

This will detect:
- Scripts in app directories
- Scripts in root directory
- Scripts with incorrect naming

---

## 📚 Related Documentation

- [FILE_PLACEMENT_QUICK_REFERENCE.md](https://github.com/mescallo-edu/vibethink-dev-kit/blob/main/knowledge/guides/FILE_PLACEMENT_QUICK_REFERENCE.md)
- [DEV_KIT_ALIGNMENT.md](../docs/DEV_KIT_ALIGNMENT.md)
- [MONOREPO_BEST_PRACTICES.md](https://github.com/mescallo-edu/vibethink-dev-kit/blob/main/knowledge/architecture/05_BEST_PRACTICES/MONOREPO_BEST_PRACTICES.md)

---

## 🔄 Migration History

### 2025-12-16: Script Location Correction
- **Issue:** `start.ps1` and `stop.ps1` were in `apps/dashboard/`
- **Violation:** Scripts in app directory (forbidden by dev-kit standard)
- **Fix:** Moved to `scripts/` and renamed to `start-dashboard.ps1` and `stop-dashboard.ps1`
- **Guardrail:** Added validation rule to prevent future violations

---

---

## 📚 Key Documentation

### i18n & Translation
- [I18N Translation Strategies](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md) - **Complete guide** with lessons learned
- [I18N Multi-Department Architecture](../docs/architecture/I18N_MULTI_DEPARTMENT_ARCHITECTURE.md) - Architecture overview
- [Para Z.AI - Completar Traducciones](../PARA_Z_AI_COMPLETAR_TRADUCCIONES.md) - Handoff doc for Z.AI
- [Estado Push Exitoso](../ESTADO_PUSH_EXITOSO_2025-12-27.md) - Push status and current state
- [Resumen Handoff Z.AI](../RESUMEN_HANDOFF_Z_AI_2025-12-27.md) - Executive summary

### External References
- [Anthropic API Documentation](https://docs.anthropic.com/claude/docs/intro-to-claude)
- [Z.AI Translation Guide](https://docs.z.ai/guides/agents/translation)
- [Google Cloud Translation API](https://cloud.google.com/translate/docs)

---

## 💡 Lessons Learned (2025-12-27)

### 1. API Keys & Security
**❌ Problem:** API keys exposed in documentation files blocked GitHub push.

**✅ Solution:**
- Use `[REDACTED]` in documentation
- Never commit `.env` files
- Use pre-commit hooks to detect secrets

**Reference:** [I18N_TRANSLATION_STRATEGIES.md - Lección 1](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md#1-api-keys-y-seguridad)

---

### 2. Smart Merge vs Full Re-translation
**❌ Problem:** Re-translating all keys wastes API tokens and overwrites manual improvements.

**✅ Solution:**
- Audit first to identify exact missing keys
- Translate ONLY missing keys
- Merge with existing files (preserve manual work)

**Script:** `complete-missing-translations.js`

**Savings:**
- Tokens: ~70% less
- Time: ~65% faster
- Cost: ~70% cheaper

**Reference:** [I18N_TRANSLATION_STRATEGIES.md - Lección 2](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md#2-smart-merge-vs-full-re-translation)

---

### 3. Prompt Engineering for Quality
**Key Rules for Translation Prompts:**
1. Provide language-specific context (formal vs informal)
2. Explicitly list technical terms to preserve
3. Show examples of good/bad translations
4. Specify exact output format
5. Emphasize placeholder preservation

**Result:** Error rate reduced from 20% → <5%

**Reference:** [I18N_TRANSLATION_STRATEGIES.md - Lección 3](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md#3-prompt-engineering-para-traducciones)

---

### 4. Batch Processing & Rate Limiting
**❌ Problem:** 138 individual API calls = slow + expensive + rate limiting errors

**✅ Solution:**
- Batch 20 keys per API call
- Delay only between batches (not between keys)
- Result: 138 calls → 7 calls (95% reduction)

**Time saved:** 4 min → 30 sec (87.5% faster)

**Reference:** [I18N_TRANSLATION_STRATEGIES.md - Lección 4](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md#4-rate-limiting-y-batch-processing)

---

### 5. Audit-First Approach
**Workflow:**
```bash
# 1. Audit FIRST (know the scope)
node scripts/audit-missing-translations-projects-v2.js

# 2. Translate ONLY what's missing
node scripts/complete-missing-translations.js

# 3. Validate with audit AGAIN
node scripts/audit-missing-translations-projects-v2.js
# Should show: Total Missing Keys: 0
```

**Benefits:**
- No wasted translations
- Clear progress tracking
- Measurable results

**Reference:** [I18N_TRANSLATION_STRATEGIES.md - Lección 6](../docs/architecture/I18N_TRANSLATION_STRATEGIES.md#6-audit-first-approach)

---

## 🎯 Quick Reference

### Translation Decision Matrix

| Scenario | Recommended Script |
|----------|-------------------|
| Complete missing keys (smart merge) | `complete-missing-translations.js` ⭐ |
| New language (full translation) | `translate-namespace.js` |
| Test API key | `test-anthropic-key.js` |
| Check what's missing | `audit-missing-translations-projects-v2.js` |
| Use Z.AI Agent | `complete-missing-translations-zai.js` |
| Low budget | `translate-namespace-google.js` |

---

### Cost & Time Comparison

| Approach | Time | Cost (138 keys) | Quality |
|----------|------|-----------------|---------|
| **Manual** | 40-60h | $800-1,200 | ⭐⭐⭐⭐⭐ |
| **Anthropic Direct** | 10-15 min | $0.50-1.00 | ⭐⭐⭐⭐ |
| **Z.AI Agent** | 10-15 min | $0.30-0.70 | ⭐⭐⭐⭐ |
| **Google Translate** | 5-10 min | $0.10-0.30 | ⭐⭐⭐ |

---

**Last Updated:** 2025-12-27
**Maintained by:** VibeThink Team + Claude Sonnet 4.5
**Standard Version:** vibethink-dev-kit v1.0
