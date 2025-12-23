# Generic Table i18n System - Complete Documentation

**Date:** 2025-12-23  
**Status:** ✅ Production Ready  
**Applies to:** ANY table component in the application

---

## 🎯 Overview

This is a **GENERIC, REUSABLE** system for internationalizing ANY table component in the application. It provides:

- ✅ **Common table translations** (search, filter, columns, pagination, etc.)
- ✅ **Module-specific translations** (column headers, placeholders)
- ✅ **Status and priority labels**
- ✅ **7-language support** (EN, ES, AR, ZH, FR, PT, DE)
- ✅ **Zero hardcoded strings**

---

## 📁 File Structure

```
src/lib/i18n/translations/
├── en/
│   ├── common.json          ← Generic table translations
│   └── projects.json         ← Project-specific translations
├── es/
│   ├── common.json
│   └── projects.json
├── ar/
│   ├── common.json
│   └── projects.json
... (FR, PT, DE, ZH)
```

---

## 🔧 How to Use (Step by Step)

### Step 1: Add Generic Translations (Already Done)

**File:** `src/lib/i18n/translations/{lang}/common.json`

```json
{
  "table": {
    "common": {
      "search": "Search...",
      "filter": "Filter",
      "columns": "Columns",
      "actions": "Actions",
      "openMenu": "Open menu",
      "selectAll": "Select all",
      "selectRow": "Select row",
      "noResults": "No results.",
      "rowsSelected": "{{count}} of {{total}} row(s) selected.",
      "previous": "Previous",
      "next": "Next"
    },
    "status": {
      "active": "Active",
      "pending": "Pending",
      "completed": "Completed",
      "cancelled": "Cancelled"
    },
    "priority": {
      "low": "Low",
      "medium": "Medium",
      "high": "High",
      "urgent": "Urgent"
    }
  }
}
```

**✅ This is already done for all 7 languages!**

---

### Step 2: Add Module-Specific Translations

**File:** `src/lib/i18n/translations/{lang}/your-module.json`

```json
{
  "v2": {
    "table": {
      "columns": {
        "columnName1": "Column Name 1",
        "columnName2": "Column Name 2",
        "columnName3": "Column Name 3"
      },
      "placeholder": {
        "filterItems": "Filter items..."
      }
    }
  }
}
```

**Example (Projects):**
```json
{
  "v2": {
    "table": {
      "columns": {
        "projectName": "Project Name",
        "clientName": "Client Name",
        "startDate": "Start Date",
        "deadline": "Deadline",
        "status": "Status",
        "progress": "Progress"
      },
      "placeholder": {
        "filterProjects": "Filter projects..."
      }
    }
  }
}
```

---

### Step 3: Create Column Definitions with i18n

**Pattern:**

```tsx
import { useTranslation } from '@/lib/i18n';
import * as React from 'react';

// Generic i18n-enabled column definitions
const createColumns = (
  t: (key: string) => string,           // Module translations
  tCommon: (key: string) => string      // Common translations
): ColumnDef<YourType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={tCommon('table.common.selectAll')}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={tCommon('table.common.selectRow')}
      />
    )
  },
  {
    accessorKey: "name",
    header: t('v2.table.columns.columnName1'),
    cell: ({ row }) => row.getValue("name")
  },
  {
    accessorKey: "status",
    header: t('v2.table.columns.status'),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge>{tCommon(`table.status.${status}`)}</Badge>;
    }
  }
];
```

---

### Step 4: Use in Component

```tsx
export function YourTableComponent() {
  const { t } = useTranslation('your-module');
  const { t: tCommon } = useTranslation('common');
  
  // Create columns with translations
  const columns = React.useMemo(
    () => createColumns(t, tCommon),
    [t, tCommon]
  );
  
  // ... rest of component
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('sections.yourTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder={t('v2.table.placeholder.filterItems')}
          // ...
        />
        <Button>
          {tCommon('table.common.columns')}
        </Button>
        
        {/* Table */}
        <Table>
          {/* ... */}
          <TableCell>
            {tCommon('table.common.noResults')}
          </TableCell>
        </Table>
        
        {/* Pagination */}
        <div>
          {tCommon('table.common.rowsSelected', {
            count: selectedCount,
            total: totalCount
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📋 Translation Keys Reference

### Common Table Keys (Use `tCommon`)

| Key | Purpose | Example |
|-----|---------|---------|
| `table.common.search` | Search placeholder | "Search..." |
| `table.common.filter` | Filter button | "Filter" |
| `table.common.columns` | Columns button | "Columns" |
| `table.common.actions` | Actions label | "Actions" |
| `table.common.openMenu` | Open menu aria-label | "Open menu" |
| `table.common.selectAll` | Select all aria-label | "Select all" |
| `table.common.selectRow` | Select row aria-label | "Select row" |
| `table.common.noResults` | No results message | "No results." |
| `table.common.rowsSelected` | Rows selected text | "{{count}} of {{total}} row(s) selected." |
| `table.common.previous` | Previous button | "Previous" |
| `table.common.next` | Next button | "Next" |

### Status Keys (Use `tCommon`)

| Key | Value (EN) |
|-----|------------|
| `table.status.active` | "Active" |
| `table.status.inactive` | "Inactive" |
| `table.status.pending` | "Pending" |
| `table.status.completed` | "Completed" |
| `table.status.cancelled` | "Cancelled" |
| `table.status.cancel` | "Cancel" |
| `table.status.draft` | "Draft" |
| `table.status.published` | "Published" |

### Priority Keys (Use `tCommon`)

| Key | Value (EN) |
|-----|------------|
| `table.priority.low` | "Low" |
| `table.priority.medium` | "Medium" |
| `table.priority.high` | "High" |
| `table.priority.urgent` | "Urgent" |

---

## 🌍 Supported Languages

All translations are available in:

- 🇺🇸 **EN** - English
- 🇪🇸 **ES** - Spanish
- 🇸🇦 **AR** - Arabic
- 🇨🇳 **ZH** - Chinese
- 🇫🇷 **FR** - French
- 🇧🇷 **PT** - Portuguese
- 🇩🇪 **DE** - German

---

## ✅ Checklist for New Table

When creating a new table component:

- [ ] Add module-specific translations to `{module}.json` (all 7 languages)
- [ ] Create `createColumns(t, tCommon)` function
- [ ] Use `useTranslation('module')` and `useTranslation('common')`
- [ ] Replace ALL hardcoded strings with `t()` or `tCommon()`
- [ ] Use `tCommon('table.status.{status}')` for status badges
- [ ] Use `tCommon('table.common.rowsSelected')` for pagination
- [ ] Test in all 7 languages
- [ ] Run `npm run lang-quality -- --module=your-module`

---

## 🎯 Benefits

1. **Reusability:** Write once, use everywhere
2. **Consistency:** Same translations across all tables
3. **Maintainability:** Update once, applies to all tables
4. **Scalability:** Easy to add new languages
5. **Zero Hardcoding:** 100% compliant with i18n standards

---

## 📝 Example: Projects Table

**See:** `apps/dashboard/app/dashboard-bundui/projects-v2/components/table-recent-projects.tsx`

This is the reference implementation showing:
- ✅ `createColumns(t, tCommon)` pattern
- ✅ Status badge translation
- ✅ Pagination text translation
- ✅ All placeholders translated
- ✅ All aria-labels translated

---

## 🚀 Quick Start

**To create a new i18n table:**

```bash
# 1. Copy the pattern from table-recent-projects.tsx
# 2. Add your translations to module.json
# 3. Replace hardcoded strings with t() calls
# 4. Test in all languages
# 5. Done!
```

**No need to create new common translations - they're already there!**

---

**Last Updated:** 2025-12-23  
**Status:** ✅ Production Ready  
**Applies to:** ALL table components
