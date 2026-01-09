# ViTo Document Intelligence API v1

**Version**: 1.0.0
**Status**: Production-ready
**Base URL**: `https://api.vibethink.com/v1`
**Sandbox URL**: `https://sandbox.api.vibethink.com/v1`

---

## Overview

The ViTo Document Intelligence API provides OCR and semantic extraction for domain-agnostic document processing. Upload a document (prescription, invoice, receipt, contract) and receive structured, machine-readable items with visual evidence and confidence scores.

**Key Features**:
- Multi-tenant isolation
- Vendor-agnostic OCR (swappable providers)
- Human review workflow
- Cost accounting per job
- Asynchronous processing with polling

**Use Cases**:
- Clinical prescription extraction (medications, dosages, frequencies)
- Invoice/receipt line-item extraction
- Contract clause extraction
- Any structured document requiring OCR + semantic extraction

---

## Authentication

All API requests require an API key passed in the `Authorization` header using Bearer authentication.

### Obtaining an API Key

API keys are managed by ViTo tenant administrators via the integrations UI or API:

1. Navigate to **Settings > Integrations**
2. Click **Create Integration**
3. Select integration type (EHR, ACCOUNTING, EXPENSE, CUSTOM)
4. Choose environment (sandbox or production)
5. Copy the generated API key (shown only once)

**API Key Format**:
```
vito_sk_1234567890abcdef1234567890abcdef
```

- Prefix: `vito_sk_` (secret key)
- Length: 32 characters after prefix
- **Store securely**: Never commit to source control or logs

### Using Your API Key

Include the API key in the `Authorization` header for every request:

```bash
curl https://api.vibethink.com/v1/documents/ingest \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY" \
  -F "file=@prescription.pdf" \
  -F "document_profile_id=550e8400-e29b-41d4-a716-446655440000"
```

**Security Notes**:
- All requests must use HTTPS
- API keys are scoped to a single tenant
- Keys can be revoked instantly via the integrations UI
- Each key has configurable scopes (e.g., `document:write`, `document:read`, `document:review`)

---

## Quick Start

### 1. Ingest a Document

Upload a document for OCR and extraction. Processing is **asynchronous**—use the returned `job_id` to poll for status.

```bash
curl -X POST https://api.vibethink.com/v1/documents/ingest \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY" \
  -F "file=@prescription.pdf" \
  -F "document_profile_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "external_ref=ORDER-12345" \
  -F 'metadata={"patient_id":"external-123","encounter_date":"2026-01-09"}'
```

**Response** (202 Accepted):
```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "correlation_id": "880e8400-e29b-41d4-a716-446655440000",
  "estimated_completion_seconds": 30,
  "webhook_url": null
}
```

**Parameters**:
- `file` (required): Document file (PDF, PNG, JPEG)
- `document_profile_id` (required): ID of the document profile defining extraction rules
- `facility_id` (optional): Facility ID for multi-location tenants
- `external_ref` (optional): Your internal reference ID
- `metadata` (optional): JSON object with domain-specific metadata

### 2. Check Job Status

Poll the job status endpoint to monitor processing progress.

```bash
curl https://api.vibethink.com/v1/documents/jobs/770e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY"
```

**Response** (200 OK):
```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "document_profile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "key": "clinical-prescription-v1"
  },
  "page_count": 2,
  "items_extracted": 12,
  "items_flagged_for_review": 2,
  "processed_at": "2026-01-09T12:05:30Z",
  "cost_cents": 15,
  "results_url": "/api/v1/documents/jobs/770e8400-e29b-41d4-a716-446655440000/results"
}
```

**Status Values**:
- `pending`: Job queued
- `processing`: OCR in progress
- `completed`: Items extracted successfully
- `failed`: Processing failed (see error logs)
- `review_required`: Items extracted but require human review

### 3. Retrieve Extracted Items

Once the job is `completed`, fetch the extracted items.

```bash
curl https://api.vibethink.com/v1/documents/jobs/770e8400-e29b-41d4-a716-446655440000/results \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY"
```

**Response** (200 OK):
```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "item_id": "990e8400-e29b-41d4-a716-446655440000",
      "item_index": 0,
      "item_type": "medication",
      "raw_text": "Amoxicillin 500mg",
      "normalized_text": "Amoxicillin",
      "ocr_confidence": 0.95,
      "flags": {
        "crossed_out": false,
        "handwritten": true,
        "confidence": 0.88
      },
      "evidence": {
        "page": 1,
        "bbox": {
          "x": 120,
          "y": 300,
          "width": 250,
          "height": 40
        }
      },
      "structured_data": {
        "dosage": "500mg",
        "frequency": "twice daily"
      },
      "is_reviewed": false,
      "corrected_text": null
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "per_page": 50
  }
}
```

**Key Fields**:
- `raw_text`: Original OCR output (immutable)
- `normalized_text`: Cleaned/normalized version (e.g., drug name without dosage)
- `ocr_confidence`: OCR quality score (0.0 - 1.0)
- `flags`: Detected visual flags (crossed out, handwritten, etc.)
- `evidence`: Bounding box coordinates for visual verification
- `structured_data`: Domain-specific fields from document profile
- `corrected_text`: Human-reviewed correction (if `is_reviewed: true`)

---

## Human Review Workflow

Items flagged for review (low confidence, handwritten, crossed out) can be corrected by authorized users.

**Requirements**:
- API key must have `document:review` scope
- Original `raw_text` is preserved for audit trail

### Submit a Review Correction

```bash
curl -X PATCH https://api.vibethink.com/v1/documents/items/990e8400-e29b-41d4-a716-446655440000/review \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "corrected_text": "Amoxicillin 500mg BID",
    "review_notes": "Handwriting unclear, confirmed with prescriber"
  }'
```

**Response** (200 OK):
```json
{
  "item_id": "990e8400-e29b-41d4-a716-446655440000",
  "is_reviewed": true,
  "reviewed_at": "2026-01-09T12:10:00Z",
  "reviewed_by": "user@example.com"
}
```

---

## Error Handling

All errors follow a consistent JSON structure:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error description",
    "details": {
      "field": "additional context (optional)"
    }
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | `invalid_request` | Missing required field or malformed request | Check request body against OpenAPI spec |
| 401 | `unauthorized` | Missing or invalid API key | Verify API key in `Authorization` header |
| 403 | `forbidden` | Insufficient scopes/permissions | Request `document:review` scope for review endpoints |
| 404 | `not_found` | Job or item not found | Verify job_id/item_id exists and belongs to your tenant |
| 429 | `rate_limit_exceeded` | Too many requests | Wait for rate limit reset (see `X-RateLimit-Reset` header) |
| 500 | `internal_error` | Server-side failure | Retry with exponential backoff; contact support if persists |

### Example Error Response

**Request**:
```bash
curl -X POST https://api.vibethink.com/v1/documents/ingest \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY" \
  -F "file=@prescription.pdf"
  # Missing required document_profile_id
```

**Response** (400 Bad Request):
```json
{
  "error": {
    "code": "invalid_request",
    "message": "Missing required field: document_profile_id",
    "details": {
      "field": "document_profile_id",
      "expected": "UUID string"
    }
  }
}
```

---

## Rate Limits

Rate limits are enforced per API key to ensure fair usage and system stability.

### Default Limits

| Environment | Requests per Minute |
|-------------|---------------------|
| Sandbox | 10 |
| Production | 60 (configurable) |

### Rate Limit Headers

All API responses include rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1736428800
```

- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Handling Rate Limits

When you exceed the rate limit, the API returns a `429` error:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit: 60 requests per minute"
  }
}
```

**Best Practices**:
1. Implement exponential backoff on 429 responses
2. Monitor `X-RateLimit-Remaining` header
3. Spread requests evenly across the minute window
4. Contact ViTo support to request higher limits for production use cases

**Example Retry Logic** (pseudocode):
```javascript
async function callAPI(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitSeconds = Math.max(resetTime - Date.now() / 1000, 1);
      await sleep(waitSeconds * 1000);
      continue;
    }

    return response;
  }
  throw new Error('Rate limit exceeded after retries');
}
```

---

## Pagination

Results endpoints support pagination via query parameters.

### Parameters

- `page` (default: 1): Page number (1-indexed)
- `per_page` (default: 50, max: 100): Items per page

### Example Request

```bash
curl "https://api.vibethink.com/v1/documents/jobs/770e8400-e29b-41d4-a716-446655440000/results?page=2&per_page=25" \
  -H "Authorization: Bearer vito_sk_YOUR_API_KEY"
```

### Response Pagination Object

```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "items": [...],
  "pagination": {
    "total": 150,
    "page": 2,
    "per_page": 25
  }
}
```

---

## Versioning Policy

The ViTo Document Intelligence API uses **URL-based versioning** with the version in the path: `/v1`, `/v2`, etc.

### Current Version

**v1** (this document) is the current production version.

### Breaking vs Non-Breaking Changes

**Breaking changes** (require new major version):
- Removing an endpoint
- Removing a required field
- Changing field data types
- Renaming fields
- Changing HTTP status codes

**Non-breaking changes** (added to current version):
- Adding new endpoints
- Adding optional request fields
- Adding new response fields
- Adding new error codes

### Deprecation Policy

When a version is deprecated:
1. **90-day notice**: Announcement via email and changelog
2. **Sunset header**: Responses include `Sunset: Sat, 31 Dec 2026 23:59:59 GMT`
3. **Migration guide**: Documentation provided for upgrading
4. **Grace period**: Minimum 90 days before removal

**Subscribe to updates**: Contact platform@vibethink.com to receive API change notifications.

---

## Document Profiles

Document profiles define the extraction rules and item types for specific document domains.

### What is a Document Profile?

A **document profile** is a configuration that tells the OCR engine:
- What item types to extract (medications, line items, clauses, etc.)
- What visual flags to detect (crossed out, handwritten, etc.)
- What structured fields to populate (dosage, price, date, etc.)

### Example Profiles

| Profile Key | Description | Item Types |
|-------------|-------------|------------|
| `clinical-prescription-v1` | Clinical prescriptions | `medication`, `dosage`, `frequency` |
| `invoice-line-item-v1` | Invoices and receipts | `line_item`, `amount`, `category` |
| `contract-clause-v1` | Legal contracts | `clause`, `obligation`, `deadline` |

### Obtaining Profile IDs

Document profiles are tenant-specific and managed via the ViTo admin UI:
1. Navigate to **Settings > Document Profiles**
2. View available profiles for your tenant
3. Copy the `document_profile_id` (UUID) for use in API requests

**Custom Profiles**: Contact ViTo support to create custom document profiles for specialized use cases.

---

## Webhooks (Optional)

For high-volume integrations, configure webhooks to receive job completion notifications instead of polling.

### Setting Up Webhooks

1. Navigate to **Settings > Integrations**
2. Edit your integration
3. Add **Webhook URL** (e.g., `https://yourdomain.com/vito/webhook`)
4. Select events to subscribe to: `job.completed`, `job.failed`, `job.review_required`

### Webhook Payload

When a job completes, ViTo sends a POST request to your webhook URL:

```json
{
  "event": "job.completed",
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "abc123",
  "status": "completed",
  "processed_at": "2026-01-09T12:05:30Z",
  "results_url": "/api/v1/documents/jobs/770e8400-e29b-41d4-a716-446655440000/results"
}
```

**Security**:
- Webhooks are signed with HMAC-SHA256
- Verify the `X-ViTo-Signature` header before processing
- Webhook endpoint must return `200 OK` within 5 seconds
- Failed webhooks are retried with exponential backoff (3 attempts)

---

## Cost Accounting

Each document processing job incurs costs based on:
- Number of pages processed
- OCR provider used (Textract, Azure, Google Vision)
- Domain complexity (medical vs simple receipts)

### Viewing Costs

Job costs are included in the job status response:

```json
{
  "job_id": "770e8400-e29b-41d4-a716-446655440000",
  "cost_cents": 15,
  "page_count": 2
}
```

**Units**: Costs are in **US cents** (e.g., `cost_cents: 15` = $0.15).

### Billing

Costs are aggregated monthly per tenant and billed via your ViTo subscription.

**Cost Breakdown**:
- View detailed cost reports in **Settings > Usage & Billing**
- Export cost data as CSV for internal chargeback

---

## SDKs and Client Libraries

Official SDKs are available for common languages:

| Language | Repository | Installation |
|----------|-----------|--------------|
| **JavaScript/TypeScript** | `@vibethink/document-intelligence-js` | `npm install @vibethink/document-intelligence-js` |
| **Python** | `vibethink-document-intelligence` | `pip install vibethink-document-intelligence` |
| **Go** | `github.com/vibethink/document-intelligence-go` | `go get github.com/vibethink/document-intelligence-go` |

**SDK Features**:
- Automatic authentication
- Type-safe request/response models
- Built-in retry logic with exponential backoff
- Webhook signature verification helpers

**Example (TypeScript)**:
```typescript
import { DocumentIntelligenceClient } from '@vibethink/document-intelligence-js';

const client = new DocumentIntelligenceClient({
  apiKey: 'vito_sk_YOUR_API_KEY',
  environment: 'production'
});

const job = await client.documents.ingest({
  file: fs.createReadStream('prescription.pdf'),
  documentProfileId: '550e8400-e29b-41d4-a716-446655440000',
  externalRef: 'ORDER-12345'
});

console.log(`Job created: ${job.job_id}`);
```

---

## Support and Resources

### Documentation
- **OpenAPI Spec**: [`docs/api/v1/openapi.yaml`](./openapi.yaml)
- **Changelog**: [`docs/api/v1/CHANGELOG.md`](./CHANGELOG.md)
- **Interactive API Reference**: https://docs.vibethink.com/api/v1

### Support Channels
- **Email**: platform@vibethink.com
- **Developer Slack**: #document-intelligence (request invite)
- **GitHub Issues**: https://github.com/vibethink/document-intelligence/issues

### Service Status
- **Status Page**: https://status.vibethink.com
- **Incident History**: https://status.vibethink.com/history

### Request Features
Submit feature requests or vote on existing proposals at:
- **Roadmap**: https://roadmap.vibethink.com/document-intelligence

---

## Appendix: Complete Example

### End-to-End Integration

This example demonstrates a complete workflow: ingest → poll → retrieve → review.

```bash
#!/bin/bash

API_KEY="vito_sk_YOUR_API_KEY"
BASE_URL="https://api.vibethink.com/v1"
DOCUMENT_PROFILE_ID="550e8400-e29b-41d4-a716-446655440000"

# Step 1: Ingest document
echo "Ingesting document..."
INGEST_RESPONSE=$(curl -s -X POST "$BASE_URL/documents/ingest" \
  -H "Authorization: Bearer $API_KEY" \
  -F "file=@prescription.pdf" \
  -F "document_profile_id=$DOCUMENT_PROFILE_ID" \
  -F "external_ref=ORDER-12345")

JOB_ID=$(echo $INGEST_RESPONSE | jq -r '.job_id')
echo "Job created: $JOB_ID"

# Step 2: Poll for completion
echo "Polling for completion..."
STATUS="pending"
while [ "$STATUS" != "completed" ]; do
  sleep 5
  STATUS_RESPONSE=$(curl -s "$BASE_URL/documents/jobs/$JOB_ID" \
    -H "Authorization: Bearer $API_KEY")
  STATUS=$(echo $STATUS_RESPONSE | jq -r '.status')
  echo "Status: $STATUS"
done

# Step 3: Retrieve results
echo "Retrieving results..."
RESULTS=$(curl -s "$BASE_URL/documents/jobs/$JOB_ID/results" \
  -H "Authorization: Bearer $API_KEY")

TOTAL_ITEMS=$(echo $RESULTS | jq -r '.pagination.total')
echo "Extracted $TOTAL_ITEMS items"

# Step 4: Review first item (if needed)
FIRST_ITEM_ID=$(echo $RESULTS | jq -r '.items[0].item_id')
IS_REVIEWED=$(echo $RESULTS | jq -r '.items[0].is_reviewed')

if [ "$IS_REVIEWED" == "false" ]; then
  echo "Submitting review for item $FIRST_ITEM_ID..."
  curl -s -X PATCH "$BASE_URL/documents/items/$FIRST_ITEM_ID/review" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "corrected_text": "Amoxicillin 500mg BID",
      "review_notes": "Confirmed with prescriber"
    }'
  echo "Review submitted"
fi

echo "Workflow complete!"
```

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-09
**Questions?** Contact platform@vibethink.com
