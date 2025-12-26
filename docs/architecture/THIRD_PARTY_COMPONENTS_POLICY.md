# Third-Party Components Policy

**Version:** 1.0.0  
**Last Updated:** 2025-12-25  
**Status:** ✅ Active

---

## 🎯 Purpose

This document defines the official policy for managing, organizing, and integrating third-party UI components, blocks, and libraries into the VibeThink ecosystem.

---

## 📚 Asset Library Repository

**Repository:** `vibethink-edu/vibethink-asset-library`  
**Purpose:** Centralized reference repository for all third-party assets  
**Access:** Private (Team only)

### Structure Principle: Organization by Provider

Each major provider gets its own root-level folder with subcategories inside:

```
vibethink-asset-library/
├── shadcn-ecosystem/          (shadcnuikit.com)
│   ├── shadcnuikit-components/
│   ├── shadcnuikit-blocks/
│   └── shadcnuikit-templates/
├── shadcnblocks/              (shadcnblocks.com)
│   ├── payload-cms/
│   ├── marketing/
│   ├── dashboard/
│   └── ecommerce/
├── bundui-premium/            (Purchased kit)
├── aceternity-ui/             (When acquired)
├── magic-ui/                  (When acquired)
└── xyflow-reference/          (Specialized library)
```

---

## 🔄 Workflow: From Asset Library to Production

### Phase 1: Discovery & Capture
When a developer finds a useful component from a third-party provider:

1. **Identify the Provider**
   - Determine if it's a new provider or existing one
   - Check if a folder exists in `vibethink-asset-library`

2. **Create Provider Structure** (if new)
   ```bash
   cd vibethink-asset-library
   mkdir provider-name
   cd provider-name
   # Create README.md with source URL, license, etc.
   ```

3. **Add the Component**
   - Copy the raw source code to the appropriate subfolder
   - Create a `README.md` documenting:
     - Source URL
     - License
     - Dependencies
     - Integration notes

### Phase 2: Integration into Orchestrator

**CRITICAL:** The Asset Library is READ-ONLY for reference. All development happens in `vibethink-orchestrator-main`.

1. **Compare & Extract**
   - Open both repos in the unified workspace
   - Locate the component in Asset Library
   - Copy to appropriate location in Orchestrator

2. **Adapt to VibeThink Standards**
   - Add i18n support (use `useTranslation` hook)
   - Replace hardcoded colors with VibeThink design tokens
   - Add TypeScript strict types
   - Follow VibeThink naming conventions

3. **Document Origin** (MANDATORY)
   Add a header comment to the file:
   ```typescript
   /**
    * @source VibeThink Asset Library: provider-name
    * @origin path/to/original/component.tsx
    * @version 1.0.0 (Imported: 2025-12-25)
    * @url https://provider.com/component
    * @adaptations i18n, design tokens, TypeScript
    */
   ```

4. **Update SYNC_STATUS.md**
   In the Asset Library provider folder, update the sync matrix:
   ```markdown
   | Component | Status | VibeThink Version | Adaptations |
   |-----------|--------|-------------------|-------------|
   | HeroSection | ✅ Integrated | v1.0 | i18n, tokens |
   ```

### Phase 3: Maintenance & Updates

When a provider releases updates:

1. **Update Asset Library First**
   - Pull/download new version to Asset Library
   - Update version in provider's README.md
   - Commit to Asset Library repo

2. **Review SYNC_STATUS.md**
   - Check which components are integrated in Orchestrator
   - Identify what changed in the update

3. **Selective Integration** (Manual Process)
   - Compare old vs. new version
   - Extract ONLY the improvements (bug fixes, performance)
   - Preserve VibeThink adaptations (i18n, types, styles)
   - Test thoroughly

4. **Never Overwrite Blindly**
   - Our components are hybrids (Provider DNA + VibeThink DNA)
   - Automated updates would destroy our work
   - Always manual review and cherry-pick improvements

---

## 📋 Documentation Standards

### Provider-Level README.md
Every provider folder MUST have a README.md with:

```markdown
# Provider Name

**Source:** https://provider.com
**License:** MIT / Commercial / etc.
**Last Updated:** YYYY-MM-DD

## Categories
- `category-1/` - Description
- `category-2/` - Description

## Integration Notes
- Key dependencies
- Common adaptations needed
- VibeThink-specific considerations
```

### Component-Level README.md
For complex components or blocks:

```markdown
# Component Name

**Source:** https://provider.com/component
**License:** Verify on site
**Captured:** YYYY-MM-DD

## Preview
[Screenshot or link]

## Dependencies
- framer-motion
- lucide-react

## Integration Checklist
- [ ] Replace colors with VibeThink tokens
- [ ] Add i18n support
- [ ] Convert to TypeScript strict
- [ ] Test in dark mode
```

### SYNC_STATUS.md
Each provider folder should have a sync status matrix:

```markdown
# Provider Name - Sync Status

**Version in Library:** X.X.X
**Last Updated:** YYYY-MM-DD

## Integration Matrix

| Component | Status | VibeThink Version | Notes |
|-----------|--------|-------------------|-------|
| Component1 | ✅ Integrated | v1.0 | Added i18n |
| Component2 | ⚠️ Partial | v0.5 | Only styles |
| Component3 | ❌ Not Integrated | - | Not needed yet |

## Pending Updates
- [ ] Review new features from vX.X
```

---

## 🚫 Anti-Patterns (What NOT to Do)

1. **❌ Developing in Asset Library**
   - Asset Library is for storage only
   - All development happens in Orchestrator

2. **❌ Mixing Providers**
   - Don't put multiple providers in one folder
   - Each provider gets its own root folder

3. **❌ Skipping Documentation**
   - Every component MUST have origin documented
   - No "mystery components" allowed

4. **❌ Blind Copy-Paste**
   - Always adapt to VibeThink standards
   - Never use components "as-is" from providers

5. **❌ Losing Track of Origin**
   - Always add `@source` headers
   - Always update SYNC_STATUS.md

---

## 🛠️ Tools & Workspace

### Unified Workspace
Use `VibeThink-Complete-Ecosystem.code-workspace` to work with both repos simultaneously:

```json
{
  "folders": [
    { "name": "⚡ VibeThink Orchestrator (MAIN)", "path": "vibethink-orchestrator-main" },
    { "name": "📚 Asset Library (Reference)", "path": "vibethink-asset-library" },
    { "name": "🛠️ Dev Kit", "path": "_vibethink-dev-kit" }
  ]
}
```

### AI Assistant Context
When using Cursor/Antigravity with the unified workspace:
- AI can see both repos simultaneously
- Ask: "Compare component X in Asset Library with our version in Orchestrator"
- Ask: "Extract component Y from Asset Library and adapt it for VibeThink"

---

## 📊 Quality Checklist

Before marking a component as "✅ Integrated":

- [ ] Origin documented in code header
- [ ] i18n support added (all text uses `useTranslation`)
- [ ] TypeScript strict types (no `any`)
- [ ] VibeThink design tokens (no hardcoded colors)
- [ ] Tested in light & dark mode
- [ ] Responsive design verified
- [ ] SYNC_STATUS.md updated in Asset Library
- [ ] Component works in production build

---

## 🔐 Security & Licensing

1. **Verify Licenses**
   - Check each provider's license before use
   - Document license in provider README
   - Ensure commercial use is allowed

2. **No Proprietary Code**
   - Only use components with compatible licenses
   - MIT, Apache 2.0, BSD are safe
   - Verify GPL compatibility if applicable

3. **Attribution**
   - Maintain attribution in code headers
   - Include in project credits if required by license

---

## 📞 Questions & Support

**For Developers:**
- Check Asset Library README first
- Review SYNC_STATUS.md for integration status
- Ask Architecture team before adding new providers

**For Architecture Team:**
- Maintain Asset Library organization
- Review integration quality
- Update this policy as needed

---

**Last Updated:** 2025-12-25  
**Maintained by:** VibeThink Architecture Team  
**Version:** 1.0.0
