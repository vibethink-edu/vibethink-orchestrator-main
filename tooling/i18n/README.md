# i18n Tooling & Validation

This directory contains the machine-readable definitions for the UI i18n & UX Translation Contract.

## 📁 Structure

- `i18n.contract.json`: Machine-readable rules for validation scripts.

## 🛠️ Validation Logic

The contract defined here is intended to be used by CI/CD pipelines to enforce:

1. **Key Parity**: Ensures all keys present in the source locale (`en`) are also present in other supported locales.
2. **Terminal Enforcement**: Validates that no translation key resolves to an object (non-terminal node).
3. **Hierarchy Integrity**: Ensures keys follow the predefined namespace and module structure.
4. **Fallback Integrity**: Validates that the fallback chain is correctly configured in the application runtime.

## 🚀 How to Validate

*(Conceptual - To be implemented in CI)*

```bash
# Example of how an agent or script would validate
node scripts/validate-i18n.mjs --contract tooling/i18n/i18n.contract.json
```

---
*Note: This is a quality enforcement layer. It does not replace the Core Canon.*
