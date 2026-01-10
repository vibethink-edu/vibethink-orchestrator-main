# API Versioning Strategy

## Path Strategy
- URLs MUST be prefixed with `/v{major}`.
- Example: `GET /api/v1/resource`.
- Breaking changes require a new path prefix (e.g., `/v2`).

## Header Strategy
- Clients SHOULD send `Accept-Version` header if supported.
- Path versioning is the PRIMARY method.

## Deprecation
- Deprecated endpoints return `Warning` header.
- Sunset period: Minimum 3 months before removal in next Major.
- Documentation must explicitly mark "Deprecated" fields.

## Phase 1 (Enforced)
- Only `/v1` is currently active.
- No `/v2` exists.
