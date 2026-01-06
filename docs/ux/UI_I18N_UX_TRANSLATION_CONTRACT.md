# UI i18n & UX Translation Contract

**Status**: ENFORCEABLE (Non-Canonical)  
**Scope**: UI/UX Text & Internationalization  
**Version**: 1.1.0

## 1. Core i18n Contract: `t()` → Terminal String

The translation function `t(key)` MUST always resolve to a **terminal string**.

- **Forbidden Types**: `object`, `array`, `number`, `boolean`.
- **Allowed Types**: `string` only.
- **Required**: Keys must be flat or strictly dot-notated to a final string value.
- **Invariant**: UI components must not perform logic on the returned value of `t()`, other than rendering.

## 2. UX Translation Rules

### A. Baseline Technical (`en`)
- `en` (English) serves as the **technical baseline** for validation of parity.
- **Note**: This does NOT imply authority over final product nomenclature or semantic UX in English; it is strictly the anchor for technical enforcement.

### B. Mandatory Rules (MUST)
- Use the `t()` function for all user-facing text.
- Provide a valid key following the module/component hierarchy.
- Ensure all new keys are first defined in the `en` locale.

### C. Recommended (SHOULD)
- Use namespaces to isolate translation bundles (e.g., `common:`, `auth:`).
- Keep translation keys descriptive but concise.

## 3. Fallback & Resilience UX

The fallback strategy varies strictly by environment to balance developer productivity and production robustness.

### Development Environment (Local/Staging)
- **Missing Keys**: MUST trigger a visible marker (e.g., `[MISSING: key.path]`) to ensure developer awareness.
- **Severity**: `WARN`.

### Production Environment
- **Fallback Chain**: `Locale` -> `en` -> `Placeholder`.
- **Prohibited**: Rendering the literal key (e.g., `auth.login.title`) is **EXPLICTLY FORBIDDEN**.
- **Mandatory Placeholder**: If `en` is also missing, a safe placeholder MUST be shown (e.g., `—`, `…`, or `[i18n-missing]`).
- **Telemetry**: Missing keys in production MUST trigger a telemetry event/logging for audit.

## 4. CI Severities & Enforcement

Automated validation against `tooling/i18n/i18n.contract.json` follows these rules:

### FAIL (Build-Breaking)
- Key used in code but absent in the `en` locale.
- `t()` call results in a non-string type (object, array, etc.).
- Critical syntax errors in translation files.

### WARN (Non-Blocking)
- Key present in `en` but missing in other supported locales (e.g., `es`).
- Unused keys detected in translation files.
- Namespace naming convention violations.

## 5. Dynamic & AI-Generated Text

- **System Generated**: Error codes MUST map to `t(error_code)`.
- **AI-Generated**: Data injected into strings MUST be handled via standard interpolation: `t('ai.greeting', { name: ai_provided_name })`.
- **Demarcation**: AI text MUST be clearly identified in the UI as per platform AI-UX guidelines.

## 6. Non-Goals (Scope Boundaries)

- **Copywriting**: Does NOT define tone or style, only technical delivery.
- **Library Enforcement**: Does NOT impose a specific library, but defines behavior for the abstraction layer.
- **Backend I18n**: Applies strictly to UI/UX; backend localizations follow persistence/API specs.

---
*Validated via `tooling/i18n/i18n.contract.json`*
