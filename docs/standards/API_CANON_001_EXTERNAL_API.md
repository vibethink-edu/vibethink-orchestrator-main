# API-CANON-001: External API Documentation Standard

**Version**: 1.0.0
**Effective Date**: 2026-01-09
**Owner**: ViTo Platform Architecture Team
**Status**: APPROVED

---

## 1. Purpose

This standard defines the mandatory requirements for all external APIs exposed by the ViTo platform to third-party integrators, clients, or partner systems.

**Scope**: Any API endpoint accessible outside the ViTo internal network or service mesh, including:
- REST APIs consumed by client applications
- Webhook callback endpoints
- Integration APIs for EHR, accounting, or custom systems
- Developer-facing SDKs or CLIs

**Out of Scope**: Internal microservice-to-microservice communication (governed separately).

---

## 2. Core Principles

### 2.1 OpenAPI as Law
- All external APIs **MUST** have an OpenAPI 3.0+ specification
- The OpenAPI spec is the **source of truth** for API contracts
- Code, documentation, and tests must remain strictly consistent with the OpenAPI spec
- Any endpoint not documented in OpenAPI is considered unsupported

### 2.2 API-First Design
- OpenAPI specification must be created **before** implementation
- Breaking changes require new API version
- Backwards compatibility is mandatory within the same major version

### 2.3 Consumer Experience
- APIs must be self-service and consumable without human support
- Authentication, error handling, and rate limits must be clearly documented
- Executable examples (curl, SDK snippets) are mandatory

---

## 3. Technical Requirements

### 3.1 OpenAPI Specification

**Location**: `docs/api/v{major}/openapi.yaml`

**Mandatory Sections**:
- `info`: Title, description, version, contact
- `servers`: Production and sandbox URLs
- `security`: Authentication scheme(s)
- `paths`: All endpoints with request/response schemas
- `components`:
  - `schemas`: All request/response data models
  - `responses`: Reusable error responses (400, 401, 403, 404, 429, 500)
  - `securitySchemes`: Authentication method details

**Example**:
```yaml
openapi: 3.0.3
info:
  title: ViTo Module API
  version: 1.0.0
  contact:
    email: platform@vibethink.com
servers:
  - url: https://api.vibethink.com/v1
  - url: https://sandbox.api.vibethink.com/v1
security:
  - ApiKeyAuth: []
components:
  securitySchemes:
    ApiKeyAuth:
      type: http
      scheme: bearer
      bearerFormat: API_KEY
```

### 3.2 Authentication

**Standard**: API Key (Bearer token) is the default authentication method.

**Header Format**:
```
Authorization: Bearer {API_KEY}
```

**API Key Structure**:
- Prefix: `vito_sk_` (secret key) or `vito_pk_` (publishable key)
- Length: Minimum 32 characters after prefix
- Storage: Must be stored securely (never in code or logs)

**Alternative methods** (OAuth2, JWT) require explicit architectural approval.

### 3.3 Error Response Format

**All error responses MUST follow this structure**:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "additional context (optional)"
    }
  }
}
```

**Standard Error Codes**:
- `invalid_request`: Malformed request (400)
- `unauthorized`: Missing or invalid API key (401)
- `forbidden`: Insufficient scopes/permissions (403)
- `not_found`: Resource does not exist (404)
- `rate_limit_exceeded`: Rate limit hit (429)
- `internal_error`: Server-side failure (500)

### 3.4 Rate Limiting

**Headers**: All API responses MUST include rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1736428800
```

**Default Limits**:
- Sandbox: 10 requests/minute
- Production: 60 requests/minute (configurable per integration)

**429 Response**: When rate limit exceeded, return:
```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit: 60 requests per minute"
  }
}
```

### 3.5 Versioning

**URL-based versioning**: `/v{major}` in path (e.g., `/v1/documents/ingest`)

**Versioning Rules**:
- **Major version** (v1 → v2): Breaking changes allowed
- **Minor updates**: Backwards-compatible changes (new optional fields, new endpoints)
- **Patch updates**: Bug fixes, no API surface changes

**Breaking changes**:
- Removing an endpoint
- Removing a required field
- Changing field data types
- Renaming fields
- Changing HTTP status codes

**Non-breaking changes**:
- Adding new endpoints
- Adding optional request fields
- Adding new response fields
- Adding new error codes

### 3.6 Multi-Tenant Isolation

**Tenant Context**: All API keys are scoped to a single tenant.

**Enforcement**:
- API key → tenant_id mapping enforced at authentication layer
- All database queries MUST include tenant_id filter
- Row-Level Security (RLS) policies required for all tenant-scoped tables

**Tenant Leakage Prevention**:
- Never expose tenant_id in API responses (use opaque IDs)
- Log tenant context for all requests
- Fail-fast on missing tenant context

---

## 4. Documentation Requirements

### 4.1 Consumer README

**Location**: `docs/api/v{major}/README.md`

**Mandatory Sections**:
1. **Overview**: What the API does (2-3 sentences)
2. **Authentication**: How to obtain and use API keys
3. **Quick Start**: 3 executable curl examples
4. **Error Handling**: Table of error codes with examples
5. **Rate Limits**: Current limits and how to request increases
6. **Versioning Policy**: How breaking changes are communicated

**Target Audience**: Third-party developers integrating with ViTo for the first time.

**Tone**: Direct, executable, no marketing fluff.

### 4.2 API Reference

**Format**: Generated from OpenAPI spec using tools like Redoc, Swagger UI, or Stoplight.

**Hosting**: Publicly accessible at `https://docs.vibethink.com/api/v{major}`

**Automatic Sync**: API reference must auto-update when OpenAPI spec changes.

### 4.3 Changelog

**Location**: `docs/api/v{major}/CHANGELOG.md`

**Format**:
```markdown
## [1.2.0] - 2026-02-15
### Added
- New endpoint: `POST /documents/items/{item_id}/approve`
- Support for `webhook_url` in ingest request

### Fixed
- Job status now correctly shows `review_required` when items flagged
```

**Update Policy**: Changelog MUST be updated with every API release.

---

## 5. Testing and Validation

### 5.1 Contract Testing
- All endpoints MUST have integration tests validating OpenAPI conformance
- Use tools like Dredd, Schemathesis, or Portman
- Tests run on every deployment

### 5.2 Example Requests
- Every endpoint MUST have at least one working curl example in README
- Examples must use realistic data (not "foo", "bar", "test123")
- Examples tested in CI/CD pipeline

### 5.3 Postman/Insomnia Collection
- Optional but recommended: Provide importable collection
- Auto-generated from OpenAPI spec preferred

---

## 6. Governance and Compliance

### 6.1 API Review Process

**Required for**:
- New external APIs
- Breaking changes to existing APIs
- Changes to authentication or rate limiting

**Reviewers**:
- Platform Architect (mandatory)
- Security Team (for auth/permission changes)
- Product Owner (for breaking changes)

**Approval Gate**: APIs cannot be deployed to production without documented OpenAPI spec + README.

### 6.2 Deprecation Policy

**Timeline**:
- Announce deprecation: Minimum 90 days before removal
- Update docs: Mark endpoint as deprecated in OpenAPI
- Migration guide: Provide alternative endpoint documentation
- Sunset: Remove endpoint after grace period

**Communication Channels**:
- Email to all integration owners
- Changelog entry
- API response warning header: `Sunset: Sat, 31 Dec 2026 23:59:59 GMT`

### 6.3 Monitoring and Alerting

**Required Metrics**:
- Request volume per endpoint
- Error rates (grouped by error code)
- Latency (p50, p95, p99)
- Rate limit violations
- Authentication failures

**Alerting Thresholds**:
- Error rate > 5% for 5 minutes
- p95 latency > 2 seconds
- Rate limit violations > 100/hour (investigate abuse)

---

## 7. Security Requirements

### 7.1 Authentication
- API keys MUST be transmitted over HTTPS only
- Keys MUST be revocable via admin UI
- Key rotation supported (overlapping validity period)

### 7.2 Authorization
- Scope-based permissions (e.g., `document:write`, `document:read`)
- Principle of least privilege: Default to minimal scopes

### 7.3 Input Validation
- All request bodies validated against OpenAPI schema
- Reject requests with unknown fields (strict mode)
- Validate file uploads (type, size, content)

### 7.4 Rate Limiting
- Per-API-key rate limiting enforced
- Exponential backoff recommended in client documentation
- DDoS protection at CDN layer

### 7.5 Audit Logging
- Log all API requests with:
  - Timestamp
  - Tenant ID
  - API key prefix (NOT full key)
  - Endpoint path
  - HTTP status
  - Response time
- Retain logs for 90 days minimum

---

## 8. Examples

### 8.1 Minimal OpenAPI Spec

```yaml
openapi: 3.0.3
info:
  title: ViTo Example API
  version: 1.0.0
  contact:
    email: platform@vibethink.com

servers:
  - url: https://api.vibethink.com/v1

security:
  - ApiKeyAuth: []

paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: Service healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"

components:
  securitySchemes:
    ApiKeyAuth:
      type: http
      scheme: bearer
      bearerFormat: API_KEY

  schemas:
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string

  responses:
    Unauthorized:
      description: Invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

### 8.2 Minimal README.md

```markdown
# ViTo Example API v1

API for XYZ functionality.

## Authentication

Include your API key in the `Authorization` header:

```bash
curl https://api.vibethink.com/v1/health \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY"
```

## Quick Start

```bash
# Health check
curl https://api.vibethink.com/v1/health \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY"
```

## Error Handling

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `unauthorized` | 401 | Invalid API key |
| `rate_limit_exceeded` | 429 | Too many requests |

## Rate Limits

- Sandbox: 10 requests/minute
- Production: 60 requests/minute

## Versioning

Current version: **v1**. Breaking changes will be released as v2.
```

---

## 9. Enforcement

**Compliance Checkpoints**:
1. Pre-deployment: Automated check for `docs/api/v{major}/openapi.yaml` and `README.md`
2. Code review: Architecture team validates OpenAPI completeness
3. Post-deployment: Automated contract tests validate spec accuracy

**Non-Compliance**:
- APIs without OpenAPI spec: **Deployment blocked**
- APIs without README: **Deployment blocked**
- Breaking changes without version bump: **Deployment blocked**

---

## 10. References

- OpenAPI Specification: https://spec.openapis.org/oas/v3.0.3
- HTTP Bearer Authentication (RFC 6750): https://tools.ietf.org/html/rfc6750
- REST API Design Best Practices: https://restfulapi.net/

---

## 11. Changelog

### [1.0.0] - 2026-01-09
- Initial release of API-CANON-001 standard
- Establishes OpenAPI as law principle
- Defines authentication, error response, and rate limiting requirements
- Mandates consumer README documentation
