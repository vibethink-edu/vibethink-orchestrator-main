# Document Intelligence API v1
> **Developer Guide** · Version 1.0.0

## What this API does
The **Document Intelligence API** enables your application to programmatically submit documents (PDFs, Images) for automated structured data extraction. It converts unstructured documents into typed JSON data (e.g., medication lists, invoices, forms) using ViTo's proprietary extraction pipelines.

## Authentication & Access
This API uses **API Keys** for authentication. You must include your key in the `x-api-key` header of every request.

```bash
x-api-key: pk_prod_1234567890
```

### Obtaining an API Key
To obtain credentials for Production or Sandbox:
1. Contact the **ViTo Platform Engineering Team** or your Account Manager.
2. Request a key with the `documents:write` scope.
3. Store the key securely (e.g., in AWS Secrets Manager).

> **Security Note:** Never expose your API Key in client-side code (browsers, mobile apps). Always call this API from your backend server.

## Base URLs
| Environment | URL | Description |
| :--- | :--- | :--- |
| **Production** | `https://api.vito.ai/document-intelligence/v1` | Live environment with billing enabled. |
| **Sandbox** | `https://api.sandbox.vito.ai/document-intelligence/v1` | Free testing environment. Data is not retained. |

## Integration Models
### Polling (Current)
Version 1 supports **polling** for job status.
1. Submit document -> Receive `job_id`.
2. Poll `GET /documents/{job_id}` every 2-5 seconds.
3. When status is `completed`, call `GET /documents/{job_id}/items`.

> **Note:** Webhooks are not supported in v1. Please use the polling pattern with exponential backoff.

## Main Use Cases

### 1. Ingest a Document
Upload a file to start a processing job. This operation is asynchronous.

**Endpoint:** `POST /documents`

**Example Request:**
```bash
curl -X POST https://api.sandbox.vito.ai/document-intelligence/v1/documents \
  -H "x-api-key: pk_sandbox_123" \
  -F "file=@/path/to/invoice.pdf" \
  -F "document_profile_id=b3f9c6d0-1234-4567-890a-b1234567890c" \
  -F "external_reference=my_ref_001"
```

**Response (201 Created):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### 2. Check Job Status
Poll the status of your job until it reaches `completed` or `review_required`.

**Endpoint:** `GET /documents/{job_id}`

**Example Request:**
```bash
curl -X GET https://api.sandbox.vito.ai/document-intelligence/v1/documents/550e8400-e29b-41d4-a716-446655440000 \
  -H "x-api-key: pk_sandbox_123"
```

### 3. Retrieve Results
Get the extracted items once the job is complete.

**Endpoint:** `GET /documents/{job_id}/items`

**Example Request:**
```bash
curl -X GET https://api.sandbox.vito.ai/document-intelligence/v1/documents/550e8400-e29b-41d4-a716-446655440000/items \
  -H "x-api-key: pk_sandbox_123"
```

## Error Handling

| Status | Code | Meaning | Remediation |
| :--- | :--- | :--- | :--- |
| **400** | `INVALID_REQUEST` | Malformed request or missing fields. | Check your parameters and file format. |
| **401** | `UNAUTHORIZED` | Missing or invalid API Key. | Verify your `x-api-key` header. |
| **403** | `FORBIDDEN` | Insufficient permissions/scope. | Contact support to enable `documents:write`. |
| **404** | `JOB_NOT_FOUND` | Creation failed or ID is wrong. | Check the `job_id`. |
| **413** | `PAYLOAD_TOO_LARGE` | File exceeds limit (50MB). | Compress or split the document. |
| **415** | `UNSUPPORTED_MEDIA` | Invalid MIME type. | Convert to PDF, PNG, or JPG. |
| **429** | `RATE_LIMITED` | Too many requests. | **Retry** after the duration in `X-RateLimit-Reset`. |
| **500** | `INTERNAL_ERROR` | ViTo server error. | **Retry** with exponential backoff (e.g., 1s, 2s, 4s). |
| **503** | `SERVICE_UNAVAILABLE` | System maintenance. | **Retry** later. |

## Rate Limits & Quotas
> TODO(API-DOCS): Finalize rate limit tiers for v1 launch. (source: `infra/rate-limiter.ts`)

- **Sandbox:** 100 requests / minute
- **Production:** Custom (default 1000 requests / minute)

## Versioning & Stability
- We use **SemVer** for API versioning (v1, v2).
- **Non-breaking changes** (adding fields) may deploy at any time.
- **Breaking changes** will result in a new API version (e.g., `/v2/`).
