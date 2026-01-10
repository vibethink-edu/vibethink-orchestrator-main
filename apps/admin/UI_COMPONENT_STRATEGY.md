# Admin Console - UI Component Strategy

> **CRITICAL RULE:** Do NOT reinvent UI components for Admin Console.  
> **ALWAYS copy from `apps/dashboard/app/dashboard-bundui`**

---

## 🔄 UI Team Workflow

**How UI improvements flow from Bundui to Admin:**

1. **UI Team** (Marcelo + Designers) improves components in `dashboard-bundui`
2. **UI Team notifies:** "Hey, we made improvements to [component]"
3. **Dev Team** (Antigravity/Engineers) copies updated component to Admin
4. **If technical issues arise:** Dev Team reports back to UI Team
5. **UI Team fixes** in `dashboard-bundui` (not in Admin)
6. **Dev Team re-syncs** corrected version to Admin

**Why this matters:**
- ✅ UI Team maintains design control
- ✅ No UI work is lost
- ✅ Admin always has latest/best version
- ✅ Clear feedback loop

---

## 🎯 Philosophy

The `dashboard-bundui` directory contains **production-ready, battle-tested UI components** that have been refined through multiple iterations. Admin Console must inherit this work **without modification** to maintain consistency and avoid rework.

---

## 📋 Component Inheritance Map

| Admin Component | Source (Bundui) | Status |
|-----------------|-----------------|--------|
| `AdminSidebar` | `sidebar-bundui/app-sidebar.tsx` | ✅ Copied |
| `AdminHeader` | `header-bundui/index.tsx` | ✅ Copied |
| `ThemeSwitch` | `header-bundui/theme-switch.tsx` | ✅ Copied |
| `UserMenu` | `header-bundui/user-menu.tsx` | ✅ Adapted |
| `TenantsTable` | `crm-v2/components/leads.tsx` | ✅ Adapted |
| `TenantDetail` | `crm-v2/components/lead-detail.tsx` | ⏳ Pending |
| `Timeline` | `projects-v2/components/timeline.tsx` | ⏳ Pending |
| `PolicyEditor` | *(Custom - no Bundui equivalent)* | ⏳ To Build |

---

## 🚫 What NOT to Do

1. ❌ **Do NOT create custom header/sidebar from scratch**
   - Always copy from Bundui first
   - Only adapt labels/routes, never structure

2. ❌ **Do NOT simplify Bundui components**
   - If Bundui has theme switch, Admin gets theme switch
   - If Bundui has notifications, Admin gets notifications (even if unused initially)

3. ❌ **Do NOT skip CSS/styling details**
   - Copy exact class names, spacing, colors
   - Use same CSS variables (`--sidebar-width`, `--header-height`, etc.)

---

## ✅ Correct Workflow

### Step 1: Identify Need
"Admin needs a user profile menu"

### Step 2: Find Bundui Equivalent
```bash
# Search in Bundui
apps/dashboard/app/dashboard-bundui/
  └── components/
      └── layout/
          └── header-bundui/
              └── user-menu.tsx  ← Found it!
```

### Step 3: Copy Entire File
```bash
cp apps/dashboard/.../user-menu.tsx apps/admin/components/layout/UserMenu.tsx
```

### Step 4: Minimal Adaptation
Only change:
- Import paths (if needed)
- Labels (e.g., "Vito Escallón" → "Admin User")
- Routes (e.g., `/dashboard` → `/admin`)

**Do NOT change:**
- Structure
- Styling
- Component composition
- CSS classes

---

## 📚 Bundui Component Library

### Layout Components
- `apps/dashboard/app/dashboard-bundui/layout.tsx` (Main layout structure)
- `apps/dashboard/src/shared/components/bundui-premium/components/layout/`
  - `sidebar-bundui/` (Sidebar with navigation)
  - `header-bundui/` (Header with controls)
  - `footer/` (Footer - not used in Admin)

### Data Display
- `apps/dashboard/app/dashboard-bundui/crm-v2/components/`
  - `leads.tsx` (Table with sorting/filtering)
  - `lead-detail.tsx` (Detail view with tabs)
  - `kanban.tsx` (Kanban board)

### Forms & Inputs
- `apps/dashboard/app/dashboard-bundui/api-keys/components/`
  - `ApiKeyForm.tsx` (Form with validation)

### Visualizations
- `apps/dashboard/app/dashboard-bundui/projects-v2/components/`
  - `timeline.tsx` (Activity timeline)
  - `project-card.tsx` (Card layout)

---

## 🔄 When Bundui Gets Updated

If Bundui components are improved:

1. **Identify changes** in Bundui
2. **Copy updated version** to Admin
3. **Re-apply minimal adaptations** (labels, routes)
4. **Test** in Admin Console
5. **Commit** with message: `chore(admin): sync [Component] from Bundui`

---

## 🎨 Theming Inheritance

Admin Console uses the **same theme system** as Bundui:

- `globals.css` variables (already copied)
- `next-themes` for dark/light mode
- Tailwind config (shared via `@vibethink/ui`)

**No custom theming for Admin.** If it works in Bundui, it works in Admin.

---

## 📝 Documentation Requirements

When copying a Bundui component:

1. Add comment at top of file:
   ```typescript
   /**
    * Copied from: apps/dashboard/app/dashboard-bundui/[path]
    * Last synced: 2026-01-10
    * Adaptations: [list minimal changes]
    */
   ```

2. Update this file's Component Inheritance Map

3. If component has dependencies, copy those too

---

## 🚀 Future: Shared Component Library

**Long-term goal:** Move Bundui components to `packages/ui` so both Dashboard and Admin import from same source.

**For now:** Copy-paste is acceptable to move fast.

---

**Approved By:** Marcelo  
**Enforced By:** All developers & AI agents  
**Review:** Every PR touching Admin UI
