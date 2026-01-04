# FIT-DATA-QUALITY-001: Data Quality & Integrity

**Status**: ACTIVE
**Type**: FUNCTIONAL_INTEGRATION_TEST
**Version**: 1.0.0
**Date**: 2026-01-04
**Related Canon**: CANON-PERSISTENCE-001, CANON-EVENTS-001

---

## 1. Purpose

Validates that data quality, integrity, backup/restore, retention, and idempotency mechanisms function correctly.

**Pass Criteria**: All data quality checks pass, backups restore successfully, retention policies execute, idempotency enforced.

---

## 2. Data Integrity Checks

### 2.1 Referential Integrity (MUST)

**Foreign Key Constraints Enforced**:
```sql
-- Test: Insert step with invalid run_id
INSERT INTO steps (id, tenant_id, run_id, step_index)
VALUES (gen_random_uuid(), 'tenant-1', 'invalid-run-id', 0);
-- Expected: ERROR (foreign key violation)
```

**Orphan Detection**:
```sql
-- Find steps without runs (should be zero)
SELECT COUNT(*)
FROM steps s
LEFT JOIN runs r ON s.run_id = r.id
WHERE r.id IS NULL;
-- Expected: 0
```

---

### 2.2 Data Consistency (MUST)

**Run Metrics Match Steps**:
```sql
-- Validate run.total_steps = COUNT(steps)
SELECT r.id, r.total_steps, COUNT(s.id) AS actual_steps
FROM runs r
LEFT JOIN steps s ON r.id = s.run_id
GROUP BY r.id, r.total_steps
HAVING r.total_steps <> COUNT(s.id);
-- Expected: 0 rows (all runs consistent)
```

**Event Correlation Integrity**:
```sql
-- All events with correlation_id have matching signal
SELECT e.correlation_id
FROM orchestration_events e
LEFT JOIN signals s ON e.correlation_id = s.correlation_id
WHERE s.id IS NULL
GROUP BY e.correlation_id;
-- Expected: 0 rows
```

---

### 2.3 Timestamp Validity (MUST)

**Timestamps Logical Ordering**:
```sql
-- Check completed_at > started_at
SELECT id
FROM runs
WHERE completed_at IS NOT NULL
  AND completed_at < started_at;
-- Expected: 0 rows
```

**Future Timestamps Prohibited**:
```sql
-- Check no timestamps in future
SELECT id, created_at
FROM signals
WHERE created_at > NOW() + INTERVAL '1 minute';
-- Expected: 0 rows
```

---

## 3. Idempotency Enforcement

### 3.1 Signal Idempotency (MUST)

**Duplicate Signal Prevention**:
```sql
-- Insert signal
INSERT INTO signals (id, tenant_id, source_channel, source_id, ...)
VALUES (gen_random_uuid(), 'tenant-1', 'gmail', 'msg-123', ...);

-- Attempt duplicate insert
INSERT INTO signals (id, tenant_id, source_channel, source_id, ...)
VALUES (gen_random_uuid(), 'tenant-1', 'gmail', 'msg-123', ...);
-- Expected: ERROR (UNIQUE constraint violation)
```

**Test**:
```typescript
const signal1 = await signalRepository.create({
  source_channel: 'gmail',
  source_id: 'msg-123',
  ...
}, tenantId);

await expect(
  signalRepository.create({
    source_channel: 'gmail',
    source_id: 'msg-123',
    ...
  }, tenantId)
).rejects.toThrow('UNIQUE constraint'); // Duplicate rejected
```

---

### 3.2 Outbox Idempotency (MUST)

**Idempotency Key Enforcement**:
```sql
-- Insert outbox entry
INSERT INTO outbox_events (id, tenant_id, event_type, idempotency_key, ...)
VALUES (gen_random_uuid(), 'tenant-1', 'SEND_EMAIL', 'run-123-email', ...);

-- Attempt duplicate
INSERT INTO outbox_events (id, tenant_id, event_type, idempotency_key, ...)
VALUES (gen_random_uuid(), 'tenant-1', 'SEND_EMAIL', 'run-123-email', ...)
ON CONFLICT (idempotency_key) DO NOTHING;
-- Expected: 0 rows inserted (silently ignored)
```

**Test**:
```typescript
await outboxRepository.create({ idempotency_key: 'effect-456', ... }, tenantId);
const result = await outboxRepository.create({ idempotency_key: 'effect-456', ... }, tenantId);
assert(result === null); // Duplicate silently ignored
```

---

## 4. Backup & Restore

### 4.1 Backup Strategy (MUST)

**Frequency**:
- **Hot Data** (signals, runs, steps): Continuous WAL archiving + daily full backup
- **Warm Data** (events): Daily incremental backup
- **Cold Data** (archived events): Weekly backup to cold storage

**Backup Command** (PostgreSQL):
```bash
# Full backup
pg_dump -h localhost -U postgres -d orchestrator_db -F c -f backup_$(date +%Y%m%d).dump

# Incremental (WAL archiving)
# Configured in postgresql.conf:
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /backup/wal/%f'
```

---

### 4.2 Restore Test (MUST)

**Process**:
1. Create test database
2. Restore from backup
3. Validate data integrity

**Test Script**:
```bash
#!/bin/bash

# Create test DB
createdb orchestrator_restore_test

# Restore from backup
pg_restore -h localhost -U postgres -d orchestrator_restore_test backup_20260104.dump

# Validate row counts
psql orchestrator_restore_test -c "SELECT COUNT(*) FROM signals;" # Should match production
psql orchestrator_restore_test -c "SELECT COUNT(*) FROM runs;" # Should match production

# Cleanup
dropdb orchestrator_restore_test
```

**Validation**:
- [ ] Restore completes without errors
- [ ] Row counts match source database
- [ ] Foreign key constraints valid
- [ ] Indexes rebuilt

---

### 4.3 Point-in-Time Recovery (SHOULD)

**Scenario**: Restore database to state at 2026-01-04 10:00:00 UTC

**Process**:
```bash
# Restore base backup
pg_restore -d orchestrator_db backup_20260104.dump

# Apply WAL files up to target time
recovery_target_time = '2026-01-04 10:00:00'
```

**Validation**:
- [ ] Database restored to exact timestamp
- [ ] Transactions after timestamp not present

---

## 5. Retention & Cleanup

### 5.1 Retention Policies (Automated)

**Policy Table**:
| Data Type | Retention | Cleanup Method |
|-----------|-----------|----------------|
| Signals | 30 days | Archive + delete |
| Runs | 90 days | Soft delete |
| Events | 2 years | Archive + delete |
| Checkpoints | 7 days | TTL delete |
| Outbox (processed) | 24 hours | Hard delete |

---

### 5.2 Cleanup Jobs (MUST)

**Job 1: Delete Expired Checkpoints**:
```sql
-- Runs daily via cron or pg_cron
DELETE FROM run_checkpoints WHERE expires_at < NOW();
```

**Job 2: Archive Old Signals**:
```sql
-- Archive to cold storage
INSERT INTO signals_archive
SELECT * FROM signals WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete from hot storage
DELETE FROM signals WHERE created_at < NOW() - INTERVAL '30 days';
```

**Job 3: Delete Processed Outbox**:
```sql
-- Delete completed outbox entries older than 24h
DELETE FROM outbox_events
WHERE status = 'COMPLETED'
  AND processed_at < NOW() - INTERVAL '24 hours';
```

---

### 5.3 Cleanup Validation (CI Test)

**Test**:
```typescript
// Create old signal
const oldSignal = await signalRepository.create({
  ...signalData,
  created_at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago
}, tenantId);

// Run cleanup job
await cleanupService.archiveOldSignals();

// Validate signal deleted
const exists = await signalRepository.findById(oldSignal.id, tenantId);
assert(exists === null); // Cleaned up

// Validate signal archived
const archived = await db.select().from(signals_archive).where(eq(signals_archive.id, oldSignal.id));
assert(archived.length === 1); // Archived
```

---

## 6. Data Quality Metrics

### 6.1 Automated Quality Checks (CI)

**Check 1: Orphaned Records**:
```sql
-- Steps without runs
SELECT COUNT(*) AS orphaned_steps
FROM steps s LEFT JOIN runs r ON s.run_id = r.id
WHERE r.id IS NULL;
-- Expected: 0
```

**Check 2: Inconsistent Counters**:
```sql
-- Run metrics mismatch
SELECT COUNT(*) AS inconsistent_runs
FROM runs r
LEFT JOIN (
  SELECT run_id, COUNT(*) AS step_count
  FROM steps GROUP BY run_id
) s ON r.id = s.run_id
WHERE r.total_steps <> COALESCE(s.step_count, 0);
-- Expected: 0
```

**Check 3: Missing Correlation IDs**:
```sql
-- Events without correlation
SELECT COUNT(*)
FROM orchestration_events
WHERE correlation_id IS NULL;
-- Expected: 0
```

---

### 6.2 Quality Dashboard (SHOULD)

**Metrics to Track**:
- Orphaned records count (target: 0)
- Data consistency violations (target: 0)
- Backup success rate (target: 100%)
- Cleanup job success rate (target: 100%)
- Average restore time (target: < 5 minutes)

**Implementation**:
```sql
-- Materialized view for dashboard
CREATE MATERIALIZED VIEW data_quality_metrics AS
SELECT
  (SELECT COUNT(*) FROM steps s LEFT JOIN runs r ON s.run_id = r.id WHERE r.id IS NULL) AS orphaned_steps,
  (SELECT COUNT(*) FROM runs WHERE completed_at < started_at) AS invalid_timestamps,
  (SELECT COUNT(*) FROM orchestration_events WHERE correlation_id IS NULL) AS missing_correlation,
  NOW() AS computed_at;
```

---

## 7. Validation Tests (Pass Criteria)

### 7.1 Test 1: Referential Integrity

**Setup**:
1. Insert step with invalid run_id

**Expected**:
- Insert rejected (foreign key violation)

**Code Verification**:
```typescript
await expect(
  db.insert(steps).values({ run_id: 'invalid-uuid', ... })
).rejects.toThrow('foreign key');
```

---

### 7.2 Test 2: Idempotency Enforcement

**Setup**:
1. Insert signal with source_id = 'msg-123'
2. Insert duplicate signal

**Expected**:
- Second insert rejected (UNIQUE constraint)

**Code Verification**:
```typescript
await signalRepository.create({ source_id: 'msg-123', ... }, tenantId);
await expect(
  signalRepository.create({ source_id: 'msg-123', ... }, tenantId)
).rejects.toThrow('UNIQUE');
```

---

### 7.3 Test 3: Backup & Restore

**Setup**:
1. Create backup
2. Restore to test database
3. Compare row counts

**Expected**:
- Row counts match
- Foreign keys intact

**Bash Verification**:
```bash
pg_dump orchestrator_db > backup.sql
createdb test_restore
psql test_restore < backup.sql

# Compare counts
PROD_COUNT=$(psql orchestrator_db -t -c "SELECT COUNT(*) FROM signals;")
TEST_COUNT=$(psql test_restore -t -c "SELECT COUNT(*) FROM signals;")
[ "$PROD_COUNT" -eq "$TEST_COUNT" ] && echo "PASS" || echo "FAIL"
```

---

### 7.4 Test 4: Retention Cleanup

**Setup**:
1. Create signal with `created_at` = 31 days ago
2. Run cleanup job
3. Query signal

**Expected**:
- Signal deleted from hot storage
- Signal archived in cold storage

**Code Verification**:
```typescript
const oldSignal = await createOldSignal(31); // 31 days old
await cleanupService.archiveOldSignals();

const exists = await signalRepository.findById(oldSignal.id, tenantId);
assert(exists === null); // Deleted

const archived = await archiveRepository.findById(oldSignal.id, tenantId);
assert(archived !== null); // Archived
```

---

## 8. Checklist (FIT Pass Criteria)

### Data Integrity

- [ ] Foreign key constraints enforced
- [ ] No orphaned records (zero violations)
- [ ] Run metrics consistent with steps
- [ ] Event correlation valid

### Idempotency

- [ ] Duplicate signals rejected (UNIQUE constraint)
- [ ] Duplicate outbox entries silently ignored
- [ ] Idempotency keys enforced

### Backup & Restore

- [ ] Daily backups automated
- [ ] Restore tested weekly
- [ ] Point-in-time recovery functional
- [ ] Restore completes in < 5 minutes

### Retention & Cleanup

- [ ] Cleanup jobs automated (cron/pg_cron)
- [ ] Old signals archived + deleted (30 days)
- [ ] Checkpoints expired (7 days)
- [ ] Outbox processed entries deleted (24 hours)

### Quality Metrics

- [ ] Orphaned records: 0
- [ ] Inconsistent counters: 0
- [ ] Missing correlation IDs: 0
- [ ] Invalid timestamps: 0

### Validation Tests

- [ ] Test 1 (Referential Integrity): PASS
- [ ] Test 2 (Idempotency): PASS
- [ ] Test 3 (Backup & Restore): PASS
- [ ] Test 4 (Retention Cleanup): PASS

---

## 9. References

- CANON-PERSISTENCE-001: Orchestrator Persistence Canon
- CANON-EVENTS-001: Events & Outbox Canon
- CANON-TRACE-001: Traceability & Audit Canon

---

**END OF FIT-DATA-QUALITY-001**
