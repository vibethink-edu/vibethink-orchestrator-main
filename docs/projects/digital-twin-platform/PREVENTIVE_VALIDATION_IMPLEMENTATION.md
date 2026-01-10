# Preventive Validation Implementation Guide

**Project:** Digital Twin Platform  
**Status:** 🟡 READY FOR IMPLEMENTATION  
**Priority:** HIGH  
**Created:** 2026-01-10  
**Owner:** Engineering Team

---

## 🎯 Objective

Convert CodeRabbit feedback into **automated preventive validations** that run at:
- **Pre-commit:** Before code is committed
- **CI/CD:** Before deployment
- **Runtime:** During application execution

---

## 📋 Implementation Phases

### Phase 1: Quick Wins (1-2 days)

#### 1.1 TypeScript Types for Revenue Models

**File:** `src/types/revenue.ts`

```typescript
/**
 * Revenue Share Model
 * Ensures celebrity + platform = 100% at compile time
 */
type RevenueShareModel = {
  celebrity: number;
  platform: number;
  total: 100; // Literal type enforces sum = 100
};

// Compile-time assertion
type AssertSum<T extends { celebrity: number; platform: number; total: 100 }> = 
  T['celebrity'] extends (100 - T['platform']) ? T : never;

// Portal Revenue Share
export const PORTAL_REVENUE_SHARE: RevenueShareModel = {
  celebrity: 70,
  platform: 30,
  total: 100
} as const;

// White-Label Revenue Share
export const WHITE_LABEL_REVENUE_SHARE: RevenueShareModel = {
  celebrity: 70,
  platform: 30,
  total: 100
} as const;

// Compile-time validation
type ValidPortal = AssertSum<typeof PORTAL_REVENUE_SHARE>; // ✅
type ValidWhiteLabel = AssertSum<typeof WHITE_LABEL_REVENUE_SHARE>; // ✅

// Runtime validation helper
export function validateRevenueShare(model: RevenueShareModel): boolean {
  return model.celebrity + model.platform === 100;
}
```

**Test:** `src/types/__tests__/revenue.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { 
  PORTAL_REVENUE_SHARE, 
  WHITE_LABEL_REVENUE_SHARE,
  validateRevenueShare 
} from '../revenue';

describe('Revenue Models', () => {
  it('should have consistent revenue share for Portal', () => {
    expect(PORTAL_REVENUE_SHARE.celebrity + PORTAL_REVENUE_SHARE.platform).toBe(100);
    expect(validateRevenueShare(PORTAL_REVENUE_SHARE)).toBe(true);
  });

  it('should have consistent revenue share for White-Label', () => {
    expect(WHITE_LABEL_REVENUE_SHARE.celebrity + WHITE_LABEL_REVENUE_SHARE.platform).toBe(100);
    expect(validateRevenueShare(WHITE_LABEL_REVENUE_SHARE)).toBe(true);
  });

  it('should match documented values', () => {
    expect(PORTAL_REVENUE_SHARE.celebrity).toBe(70);
    expect(PORTAL_REVENUE_SHARE.platform).toBe(30);
    expect(WHITE_LABEL_REVENUE_SHARE.celebrity).toBe(70);
    expect(WHITE_LABEL_REVENUE_SHARE.platform).toBe(30);
  });
});
```

**CI/CD Gate:**
```yaml
# .github/workflows/ci.yml
- name: Test Revenue Models
  run: pnpm test -- revenue.test.ts
```

---

#### 1.2 Conversation Message Limit Validation

**File:** `src/services/conversation.service.ts`

```typescript
import { ConversationNotFoundError, ConversationLimitExceededError } from './errors';

const MAX_MESSAGES_PER_CONVERSATION = 1000;

export class ConversationService {
  async addMessage(conversationId: string, message: Message): Promise<Conversation> {
    const conversation = await this.getConversation(conversationId);
    
    // Pre-validation: Check message limit
    if (conversation.messages.length >= MAX_MESSAGES_PER_CONVERSATION) {
      throw new ConversationLimitExceededError(
        `Conversation ${conversationId} has reached the maximum of ${MAX_MESSAGES_PER_CONVERSATION} messages. ` +
        `Please archive this conversation and start a new one.`
      );
    }
    
    // Add message
    const updatedConversation = await this.db.conversations.update({
      where: { id: conversationId },
      data: {
        messages: { push: message },
        message_count: conversation.messages.length + 1,
        updated_at: new Date()
      }
    });
    
    // Alert if approaching limit (90%)
    if (updatedConversation.messages.length >= MAX_MESSAGES_PER_CONVERSATION * 0.9) {
      await this.alertService.send({
        severity: 'WARNING',
        message: `Conversation ${conversationId} is approaching message limit (${updatedConversation.messages.length}/${MAX_MESSAGES_PER_CONVERSATION})`
      });
    }
    
    return updatedConversation;
  }
}
```

**Error:** `src/services/errors.ts`

```typescript
export class ConversationLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConversationLimitExceededError';
  }
}
```

**Test:** `src/services/__tests__/conversation.service.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationService } from '../conversation.service';
import { ConversationLimitExceededError } from '../errors';

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(() => {
    service = new ConversationService(mockDb, mockAlertService);
  });

  it('should reject messages when limit reached', async () => {
    const conversation = createConversationWithMessages(1000);
    
    await expect(
      service.addMessage(conversation.id, newMessage)
    ).rejects.toThrow(ConversationLimitExceededError);
  });

  it('should alert when approaching limit (90%)', async () => {
    const conversation = createConversationWithMessages(900);
    const alertSpy = vi.spyOn(mockAlertService, 'send');
    
    await service.addMessage(conversation.id, newMessage);
    
    expect(alertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'WARNING',
        message: expect.stringContaining('approaching message limit')
      })
    );
  });

  it('should allow messages below limit', async () => {
    const conversation = createConversationWithMessages(500);
    
    const result = await service.addMessage(conversation.id, newMessage);
    
    expect(result.messages.length).toBe(501);
  });
});
```

---

#### 1.3 ESLint Rule: Detect TEXT Instead of ENUM

**File:** `.eslintrc.js`

```javascript
module.exports = {
  // ... existing config
  plugins: ['@typescript-eslint', 'custom'],
  rules: {
    // ... existing rules
    'custom/no-text-for-enums': 'error'
  }
};
```

**Custom Rule:** `eslint-plugin-custom/no-text-for-enums.js`

```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow TEXT type for fields that should use ENUM',
      category: 'Best Practices',
      recommended: true
    },
    messages: {
      useEnum: 'Use PostgreSQL ENUM instead of TEXT for "{{ field }}" field'
    }
  },
  create(context) {
    const ENUM_CANDIDATES = ['type', 'status', 'role', 'tier', 'severity'];
    
    return {
      Literal(node) {
        if (node.value === 'TEXT') {
          const parent = node.parent;
          
          // Check if this is a column definition
          if (parent && parent.type === 'Property') {
            const fieldName = parent.key.name || parent.key.value;
            
            if (ENUM_CANDIDATES.some(candidate => 
              fieldName.toLowerCase().includes(candidate)
            )) {
              context.report({
                node,
                messageId: 'useEnum',
                data: { field: fieldName }
              });
            }
          }
        }
      }
    };
  }
};
```

**Test:** `eslint-plugin-custom/__tests__/no-text-for-enums.test.js`

```javascript
const { RuleTester } = require('eslint');
const rule = require('../no-text-for-enums');

const ruleTester = new RuleTester();

ruleTester.run('no-text-for-enums', rule, {
  valid: [
    { code: 'const schema = { name: "TEXT" }' }, // OK: name is not an enum candidate
    { code: 'const schema = { type: "celebrity_type" }' } // OK: using ENUM
  ],
  invalid: [
    {
      code: 'const schema = { type: "TEXT" }',
      errors: [{ messageId: 'useEnum' }]
    },
    {
      code: 'const schema = { status: "TEXT" }',
      errors: [{ messageId: 'useEnum' }]
    }
  ]
});
```

---

### Phase 2: CI/CD Gates (3-5 days)

#### 2.1 Pre-commit Hook: Validate JSONB Schemas

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Validating JSONB schemas..."
pnpm run validate:jsonb-schemas

echo "✅ Pre-commit checks passed"
```

**Script:** `scripts/validate-jsonb-schemas.ts`

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// JSON Schemas
const twinConfigSchema = {
  type: 'object',
  required: ['voiceCloneId', 'visualAvatarId', 'personalityProfile'],
  properties: {
    voiceCloneId: { type: 'string', minLength: 1 },
    visualAvatarId: { type: 'string', minLength: 1 },
    personalityProfile: {
      type: 'object',
      required: ['tone', 'language'],
      properties: {
        tone: { type: 'string' },
        language: { type: 'string' },
        expertise: { type: 'array', items: { type: 'string' } }
      }
    },
    knowledgeBase: {
      type: 'object',
      properties: {
        sources: { type: 'array' },
        lastUpdated: { type: 'string', format: 'date-time' }
      }
    },
    guardrails: {
      type: 'object',
      properties: {
        maxResponseLength: { type: 'integer', minimum: 100 },
        bannedTopics: { type: 'array', items: { type: 'string' } },
        contentRating: { type: 'string', enum: ['G', 'PG', 'PG-13', 'R'] }
      }
    }
  }
};

const deploymentConfigSchema = {
  type: 'object',
  properties: {
    portalUrl: { type: 'string', format: 'uri' },
    customDomain: { type: 'string', format: 'hostname' },
    embedCode: { type: 'string' },
    allowedDomains: { type: 'array', items: { type: 'string' } },
    brandId: { type: 'string', format: 'uuid' },
    campaignId: { type: 'string', format: 'uuid' },
    theme: { type: 'object' },
    branding: { type: 'object' }
  }
};

// Validator
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateTwinConfig = ajv.compile(twinConfigSchema);
const validateDeploymentConfig = ajv.compile(deploymentConfigSchema);

// Load and validate fixtures
const fixturesDir = join(__dirname, '../tests/fixtures');
const files = readdirSync(fixturesDir).filter(f => f.endsWith('.json'));

let errors = 0;

files.forEach(file => {
  const filePath = join(fixturesDir, file);
  const fixture = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  // Validate twin_config
  if (fixture.twin_config) {
    if (!validateTwinConfig(fixture.twin_config)) {
      console.error(`❌ Invalid twin_config in ${file}:`);
      console.error(ajv.errorsText(validateTwinConfig.errors));
      errors++;
    }
  }
  
  // Validate deployment config
  if (fixture.config) {
    if (!validateDeploymentConfig(fixture.config)) {
      console.error(`❌ Invalid deployment config in ${file}:`);
      console.error(ajv.errorsText(validateDeploymentConfig.errors));
      errors++;
    }
  }
});

if (errors > 0) {
  console.error(`\n❌ Found ${errors} JSONB schema validation errors`);
  process.exit(1);
}

console.log('✅ All JSONB schemas are valid');
```

**package.json:**

```json
{
  "scripts": {
    "validate:jsonb-schemas": "tsx scripts/validate-jsonb-schemas.ts",
    "prepare": "husky install"
  },
  "devDependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "husky": "^8.0.3",
    "tsx": "^4.7.0"
  }
}
```

---

#### 2.2 CI/CD Gate: Validate PostgreSQL ENUMs

**Script:** `scripts/validate-enums.ts`

```typescript
import { Pool } from 'pg';

const REQUIRED_ENUMS = [
  'celebrity_type',
  'entity_status',
  'deployment_type',
  'transaction_type'
];

async function validateEnums() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const result = await pool.query(`
      SELECT typname FROM pg_type WHERE typtype = 'e'
    `);
    
    const existingEnums = result.rows.map(row => row.typname);
    const missing = REQUIRED_ENUMS.filter(e => !existingEnums.includes(e));
    
    if (missing.length > 0) {
      console.error(`❌ Missing required ENUMs: ${missing.join(', ')}`);
      process.exit(1);
    }
    
    console.log('✅ All required ENUMs exist');
  } finally {
    await pool.end();
  }
}

validateEnums();
```

**CI/CD:** `.github/workflows/ci.yml`

```yaml
name: CI

on: [push, pull_request]

jobs:
  validate-database:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run migrations
        run: pnpm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Validate ENUMs
        run: pnpm run db:validate-enums
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Validate Indexes
        run: pnpm run db:validate-indexes
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
```

---

#### 2.3 CI/CD Gate: Validate JSONB Indexes

**Script:** `scripts/validate-indexes.ts`

```typescript
import { Pool } from 'pg';

interface RequiredIndex {
  table: string;
  column: string;
  type: 'GIN' | 'BTREE';
  expression?: string; // For functional indexes like (config -> 'brandId')
}

const REQUIRED_INDEXES: RequiredIndex[] = [
  // Full JSONB indexes
  { table: 'celebrities', column: 'twin_config', type: 'GIN' },
  { table: 'deployments', column: 'config', type: 'GIN' },
  { table: 'conversations', column: 'context', type: 'GIN' },
  
  // Functional indexes on JSONB fields
  { 
    table: 'celebrities', 
    column: 'twin_config', 
    type: 'GIN',
    expression: "(twin_config -> 'voiceCloneId')"
  },
  { 
    table: 'celebrities', 
    column: 'twin_config', 
    type: 'GIN',
    expression: "(twin_config -> 'visualAvatarId')"
  },
  { 
    table: 'deployments', 
    column: 'config', 
    type: 'GIN',
    expression: "(config -> 'customDomain')"
  },
  { 
    table: 'deployments', 
    column: 'config', 
    type: 'GIN',
    expression: "(config -> 'brandId')"
  },
  { 
    table: 'conversations', 
    column: 'context', 
    type: 'GIN',
    expression: "(context -> 'brandId')"
  },
  { 
    table: 'conversations', 
    column: 'context', 
    type: 'GIN',
    expression: "(context -> 'campaignId')"
  }
];

async function validateIndexes() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
    `);
    
    const existingIndexes = result.rows;
    const missing: RequiredIndex[] = [];
    
    REQUIRED_INDEXES.forEach(req => {
      const exists = existingIndexes.some(idx => {
        const matchesTable = idx.tablename === req.table;
        const matchesType = idx.indexdef.includes(`USING ${req.type.toLowerCase()}`);
        const matchesColumn = req.expression 
          ? idx.indexdef.includes(req.expression)
          : idx.indexdef.includes(req.column);
        
        return matchesTable && matchesType && matchesColumn;
      });
      
      if (!exists) {
        missing.push(req);
      }
    });
    
    if (missing.length > 0) {
      console.error('❌ Missing required indexes:');
      missing.forEach(idx => {
        const expr = idx.expression || idx.column;
        console.error(`  - ${idx.type} index on ${idx.table}.${expr}`);
      });
      process.exit(1);
    }
    
    console.log('✅ All required indexes exist');
  } finally {
    await pool.end();
  }
}

validateIndexes();
```

---

### Phase 3: Monitoring & Alerts (1 week)

#### 3.1 Cron Job: Validate Data Archival

**Script:** `scripts/validate-archival.ts`

```typescript
import { Pool } from 'pg';
import { sendAlert } from '../src/services/alert.service';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const ARCHIVAL_THRESHOLD = 1000; // Alert if > 1000 conversations need archiving

async function validateArchival() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Count conversations older than 1 year that are not archived
    const result = await pool.query(`
      SELECT COUNT(*) as count
      FROM conversations
      WHERE updated_at < NOW() - INTERVAL '1 year'
        AND is_archived = FALSE
    `);
    
    const count = parseInt(result.rows[0].count);
    
    if (count > ARCHIVAL_THRESHOLD) {
      await sendAlert({
        severity: 'WARNING',
        title: 'Data Archival Required',
        message: `${count} conversations older than 1 year are not archived (threshold: ${ARCHIVAL_THRESHOLD})`,
        action: 'Run archival job: pnpm run db:archive-conversations'
      });
      
      console.warn(`⚠️ ${count} conversations need archiving`);
    } else {
      console.log(`✅ Archival status OK (${count} conversations pending)`);
    }
  } finally {
    await pool.end();
  }
}

validateArchival();
```

**Cron:** `crontab -e`

```bash
# Run archival validation daily at 2 AM
0 2 * * * cd /path/to/project && pnpm run validate:archival
```

**package.json:**

```json
{
  "scripts": {
    "validate:archival": "tsx scripts/validate-archival.ts",
    "db:archive-conversations": "tsx scripts/archive-conversations.ts"
  }
}
```

---

## 🚀 Implementation Checklist

### Phase 1: Quick Wins
- [ ] Create `src/types/revenue.ts` with compile-time validation
- [ ] Add unit tests for revenue models
- [ ] Implement `ConversationService.addMessage()` with limit validation
- [ ] Add unit tests for conversation limits
- [ ] Create ESLint custom rule `no-text-for-enums`
- [ ] Add ESLint rule tests

### Phase 2: CI/CD Gates
- [ ] Install Husky: `pnpm add -D husky`
- [ ] Create `.husky/pre-commit` hook
- [ ] Create `scripts/validate-jsonb-schemas.ts`
- [ ] Create `scripts/validate-enums.ts`
- [ ] Create `scripts/validate-indexes.ts`
- [ ] Update `.github/workflows/ci.yml` with validation steps
- [ ] Add `package.json` scripts

### Phase 3: Monitoring
- [ ] Create `scripts/validate-archival.ts`
- [ ] Setup cron job for daily archival validation
- [ ] Integrate with alert service (Slack, PagerDuty, etc.)
- [ ] Create dashboard for monitoring metrics

---

## 📊 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Pre-commit failures** | <5% | Git hook logs |
| **CI/CD failures (validation)** | <2% | GitHub Actions |
| **Runtime errors (limits)** | 0 critical | Error tracking |
| **Archival alerts** | <1 per month | Alert logs |
| **JSONB schema violations** | 0 | Validation logs |

---

## 🔧 Gemini Coder Instructions

### Step 1: Setup
```bash
# Install dependencies
pnpm add -D husky ajv ajv-formats tsx pg

# Initialize Husky
pnpm run prepare
```

### Step 2: Implement Phase 1 (Quick Wins)
```bash
# Create files in order:
1. src/types/revenue.ts
2. src/types/__tests__/revenue.test.ts
3. src/services/conversation.service.ts
4. src/services/__tests__/conversation.service.test.ts
5. eslint-plugin-custom/no-text-for-enums.js
6. eslint-plugin-custom/__tests__/no-text-for-enums.test.js

# Run tests
pnpm test
```

### Step 3: Implement Phase 2 (CI/CD Gates)
```bash
# Create files in order:
1. .husky/pre-commit
2. scripts/validate-jsonb-schemas.ts
3. scripts/validate-enums.ts
4. scripts/validate-indexes.ts
5. Update .github/workflows/ci.yml

# Test locally
pnpm run validate:jsonb-schemas
pnpm run db:validate-enums
pnpm run db:validate-indexes
```

### Step 4: Implement Phase 3 (Monitoring)
```bash
# Create files:
1. scripts/validate-archival.ts
2. Setup cron job

# Test
pnpm run validate:archival
```

---

## 🎯 Expected Outcome

After implementation:
1. ✅ **Zero** revenue model inconsistencies (compile-time + runtime)
2. ✅ **Zero** conversation limit violations (pre-validated)
3. ✅ **Zero** TEXT fields where ENUMs should be used (ESLint)
4. ✅ **Zero** missing JSONB indexes (CI/CD gate)
5. ✅ **Proactive** archival monitoring (daily cron)

---

**Status:** 🟢 READY FOR GEMINI CODER  
**Estimated Effort:** 3-5 days  
**Dependencies:** None (all tooling is standard)

---

## 🛡️ Preventive Type Safety

We enforce strict error handling in TypeScript configuration.

### catch (error) Safety

We have enabled `useUnknownInCatchVariables: true` in `tsconfig.json`.

**Implication:**
Caught errors are `unknown` by default, not `any`. You MUST type-check them before usage.

❌ **Forbidden:**
```typescript
try { ... } catch (err) {
  console.log(err.message); // Error: Object is of type 'unknown'.
}
```

✅ **Required:**
```typescript
try { ... } catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.log(message);
}
```
