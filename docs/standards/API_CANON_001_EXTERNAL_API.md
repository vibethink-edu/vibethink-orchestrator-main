# API-CANON-001: External API Standards
> **Canonical Standard** · Version 1.0.0 · Status: **ACTIVE**

## 1. Purpose and Scope
This standard defines the mandatory requirements for exposing **Entity-External APIs** within the ViTo ecosystem. An "External API" is any HTTP interface designed to be consumed by third-party clients, partners, or systems outside the immediate ViTo monorepo context.

**Scope:**
- All "Feature Implementation Teams" (FITs) exposing public/partner endpoints.
- All HTTP-based integration surfaces (REST/OpenAPI).

**Exclusions:**
- Internal gRPC/RPC services (service-to-service).
- Next.js Server Actions or internal UI-supporting APIs not meant for public consumption.

## 2. Minimal Deliverables
Every released External API must provide the following package in `docs/api/<version>/`:

| Artifact | File Path | Description |
| :--- | :--- | :--- |
| **OpenAPI Spec** | `docs/api/v<X>/openapi.yaml` | Valid OpenAPI 3.0+ specification acting as the source of truth. |
| **Consumer Guide** | `docs/api/v<X>/README.md` | Human-readable documentation for integration developers (Get Started, Auth, Examples). |
| **Changelog** | `docs/api/v<X>/CHANGELOG.md` | (Optional for v1) version history. |

## 3. Architecture & Design

### 3.1 Authentication & Security
- **Mechanism:** API Key in Header.
- **Header Name:** `x-api-key` (Canonical).
- **Transport:** HTTPS Mandatory (TLS 1.2+).
- **Format:** `pk_<env>_<random>` (e.g., `pk_prod_abc123`).

### 3.2 URL Structure & Environments
- **Production:** `https://api.vito.ai/<module>/v<X>/` (Canonical Placeholder).
- **Sandbox:** `https://api.sandbox.vito.ai/<module>/v<X>/` (Canonical Placeholder).
- **Versioning:** URL-based versioning (`/v1/`). Major validation changes require version bumps.

### 3.3 Data Formats
- **Request/Response:** `application/json` by default.
- **Binary:** `multipart/form-data` for file uploads.
- **Dates:** ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`).
- **Naming:** `snake_case` for JSON properties (API layer specific standard).

## 4. Operational Excellence

### 4.1 Error Handling
Errors must return structured JSON:
```json
{
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "The field 'file_size' exceeds limit.",
    "trace_id": "req_12345"
  }
}
```
**Mandatory Codes:** `400`, `401`, `403`, `404`, `429`, `500`.

### 4.2 Rate Limiting
- Headers must be returned:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## 5. Governance & PCR
This specific document (`API-CANON-001`) acts as the governing rule.
- **Phase Closure Report (PCR):** Must reference the existence of `docs/api/v<X>/` artifacts.
- **Validation:** Automated CI checks should validate `openapi.yaml` schema correctness.

## 6. Closure Checklist
To mark an API Phase as COMPLETE:
- [ ] `openapi.yaml` is valid and reflects code reality.
- [ ] `README.md` contains real `curl` examples tried against Sandbox.
- [ ] Security review signed off (Auth & Scopes).
- [ ] No "Magic Strings" in error messages; use constants.
