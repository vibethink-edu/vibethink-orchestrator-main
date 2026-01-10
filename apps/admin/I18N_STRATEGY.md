# Admin Console - Internationalization Strategy

> **Decision Date:** 2026-01-10  
> **Status:** APPROVED  
> **Scope:** `apps/admin` (Internal Staff Tool)

---

## 📋 Decision Summary

**Admin Console will support 2 languages:**
- **English** (Primary/Default)
- **Spanish** (Secondary)

**Client Dashboard (`apps/dashboard`) will support 9 languages** as defined in existing mocks.

---

## 🎯 Rationale

### Why English-First for Admin?

1. **International Team Growth**
   - VibeThink is expanding globally
   - New hires may not speak Spanish
   - English is the lingua franca of tech operations

2. **Documentation & Support**
   - Most technical documentation is in English
   - Error messages, logs, and stack traces are in English
   - Easier to search for solutions online

3. **Consistency with Industry Standards**
   - Admin panels typically default to English (AWS, GCP, Stripe, etc.)
   - Reduces cognitive load for engineers switching between tools

### Why Include Spanish?

1. **Current Team Composition**
   - Majority of current staff is Spanish-speaking
   - Reduces friction during onboarding
   - Maintains team productivity

2. **Regional Compliance**
   - Some audit/legal requirements may prefer Spanish documentation
   - Easier to explain actions to non-technical stakeholders

3. **Low Implementation Cost**
   - Only 2 languages to maintain (vs 9 for clients)
   - Translation files are small (~200 keys)

---

## 🌍 Language Matrix

| Application | Audience | Languages | Default | Switcher Location |
|-------------|----------|-----------|---------|-------------------|
| `apps/admin` | VibeThink Staff | EN, ES | **EN** | Sidebar Footer |
| `apps/dashboard` | Clients | 9 languages* | ES/EN (tenant pref) | Header Dropdown |

*9 Languages for Clients:
1. Spanish (ES)
2. English (EN)
3. Portuguese (PT)
4. French (FR)
5. German (DE)
6. Italian (IT)
7. Japanese (JA)
8. Korean (KO)
9. Chinese Simplified (ZH)

---

## 🛠️ Implementation Approach

### Admin Console (Current)

**Phase 1 (MVP):** Hardcoded English labels
- Fastest path to production
- No i18n library overhead
- Easy to migrate later

**Phase 2 (Post-MVP):** Add `next-intl` with 2 locales
- Create `messages/en.json` and `messages/es.json`
- Add language switcher in sidebar footer
- Store preference in localStorage

**File Structure:**
```
apps/admin/
├── messages/
│   ├── en.json  (default)
│   └── es.json
├── i18n/
│   └── request.ts
└── components/
    └── LanguageSwitcher.tsx
```

### Client Dashboard (Existing)

Already implemented with 9 languages using `next-intl` and dynamic routing.

---

## 📝 Translation Keys (Admin - Sample)

```json
{
  "nav": {
    "tenants": "Tenants",
    "identitySearch": "Identity Search",
    "auditLog": "Audit Log",
    "platformHealth": "Platform Health"
  },
  "tenants": {
    "title": "Tenants",
    "provision": "Provision Tenant",
    "suspend": "Suspend Tenant",
    "status": {
      "active": "Active",
      "suspended": "Suspended"
    }
  },
  "admin": {
    "user": "Admin User",
    "role": {
      "super": "SUPER_ADMIN",
      "ops": "OPS",
      "support": "SUPPORT"
    },
    "logout": "Logout"
  }
}
```

---

## 🚫 What We're NOT Doing

1. **NOT using 9 languages in Admin**
   - Overkill for internal tool
   - Maintenance burden (9x translation updates)
   - No business value (staff speaks EN/ES)

2. **NOT using automatic translation**
   - Quality matters for operations
   - Legal/compliance terms need precision
   - Human translation only

3. **NOT supporting RTL languages in Admin**
   - No Arabic/Hebrew for staff tool
   - Simplifies layout logic
   - Can add later if needed

---

## 🔄 Migration Path (Phase 1 → Phase 2)

When ready to add Spanish to Admin:

1. Install `next-intl` (already in `package.json`)
2. Create `messages/en.json` and `messages/es.json`
3. Replace hardcoded strings with `t('key')` calls
4. Add `<LanguageSwitcher />` to sidebar footer
5. Test with both locales
6. Update `TROUBLESHOOTING.md` if issues arise

**Estimated Effort:** 2-3 hours

---

## 📊 Metrics to Track

- **Admin:** Language preference distribution (EN vs ES)
- **Dashboard:** Language usage by tenant (all 9 languages)
- **Support Tickets:** Language-related issues

---

## 🔗 Related Documents

- `apps/admin/TROUBLESHOOTING.md` (i18n setup issues)
- `apps/dashboard/i18n/` (9-language implementation reference)
- `docs/standards/STACK_DECISIONS.md` (next-intl rationale)

---

**Approved By:** Marcelo (Product Owner)  
**Implemented By:** Antigravity AI  
**Review Date:** Quarterly (or when team composition changes)
