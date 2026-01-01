# FIT-003: Communication Events Capture

## Status
STUB — Not Automated

## Purpose
To ensure the system captures "What was said" (Emails, Calls, Chats) as distinct, immutable events in the Timeline, linked to Entities.

## Scope
- **IN**: Existence of `communication_events` table (or equivalent JSONB structure in Timeline) and ingestion endpoints.
- **OUT**: Transcription quality or sentiment analysis.

## Enforcement
- Manual: YES (Feature Review)
- Automated: NO (planned)

## Evidence
- Path(s): `src/core/memory/taxonomy/communication_events.ts`
- Command(s): `curl -X POST /api/webhooks/ingest-email` (Manual Verification)
