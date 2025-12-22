# BundUI Migration Registry - Quick Reference

This file provides quick access to all BundUI Premium migrations.

## 📁 Registry Location

**Full Registry:** [bundui-migration-registry.md](bundui-migration-registry.md)

## 🗂️ Migrated Components

### ✅ Completed Migrations

1. **Crypto Dashboard v2** (2025-12-20)
   - Location: `/dashboard-bundui/crypto-v2`
   - Files: 6 components + 12 images
   - Status: Production ready

### 📋 Pending Migrations

- Sales Dashboard v2
- E-commerce Dashboard v2
- Analytics Dashboard v2
- CRM Dashboard v2
- Finance Dashboard v2
- Hotel Dashboard v2

## 🚀 Quick Start

To migrate a new component:

```bash
node scripts/migrate-bundui-component.js \
  "C:/IA Marcelo Labs/bundui/shadcn-ui-kit-dashboard/app/dashboard/(auth)/[component]" \
  "apps/dashboard/app/dashboard-bundui/[component]-v2"
```

## 📚 Documentation

- [Migration Registry](bundui-migration-registry.md) - Full details
- [Version Policy](bundui-version-policy.md) - When to migrate
- [Migration Lessons](bundui-migration-lessons.md) - How to migrate
- [Walkthrough](walkthrough.md) - Example migration

---

**Last Updated:** 2025-12-20
