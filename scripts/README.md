# 🔧 Scripts Directory

**Purpose:** Automation scripts for the VibeThink Orchestrator monorepo.

**Standard Compliance:** Follows `_vibethink-dev-kit` [FILE_PLACEMENT_QUICK_REFERENCE.md](https://github.com/mescallo-edu/vibethink-dev-kit/blob/main/knowledge/guides/FILE_PLACEMENT_QUICK_REFERENCE.md)

---

## 📋 Available Scripts

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

**Last Updated:** 2025-12-16  
**Maintained by:** VibeThink Team  
**Standard Version:** vibethink-dev-kit v1.0
