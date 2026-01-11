# 🛡️ PROTECTED VENDOR REFERENCE (BUNDUI)

This directory (`dashboard-bundui`) contains the **Golden Standard** UI reference derived from the Bundui Premium template.

## ⛔ PROTECTION RULES

1.  **DO NOT REFACTOR** this code to share components with other apps (`admin`, `candidate`) if it implies modifying this directory.
2.  **DO NOT UNIFY** styles by stripping inline classes or changing logic here. This code is the source of truth.
3.  **ONLY TOUCH** this code for:
    *   Critical bug fixes (e.g., compile errors, hydration mismatches).
    *   Updating to a newer version of the Bundui vendor template.
    *   Replacing deprecated dependencies (like removed icons).

## Manten uno solo (Single Source of Truth)
This directory IS the truth for UI/UX. Other apps should aspire to look like this, but this implementation must remain pure to ensure we always have a working reference.
