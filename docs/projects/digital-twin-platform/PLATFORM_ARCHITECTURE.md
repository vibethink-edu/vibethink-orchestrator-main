# Digital Twin Platform - Multi-Tenant Architecture

**Project Code:** `DTP-001`  
**Status:** 🟡 PLANNING  
**Priority:** CRITICAL  
**Created:** 2026-01-10  
**Owner:** VibeThink Team

---

## 🎯 Vision Statement

> "Crear una plataforma SaaS multi-tenant que permita crear, configurar, y monetizar Digital Twins de celebridades, deportistas, coaches, y personalidades. Cada twin puede vivir en múltiples contextos (portal propio, landing pages de marcas, sitios embebidos) y atender múltiples clientes simultáneamente de forma no-exclusiva."

---

## 🏗️ Business Model Overview

### Modelo de Negocio Multi-Faceta

```
┌─────────────────────────────────────────────────────────────────┐
│              DIGITAL TWIN PLATFORM (VibeThink)                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              CELEBRITY/TALENT MANAGEMENT                  │ │
│  │  • Andrés Cantor (Comentarista Deportivo)                │ │
│  │  • Messi (Jugador de Fútbol)                             │ │
│  │  • Tim Robbins / Tony Robbins (Coaches)                  │ │
│  │  • [Cualquier Celebridad con Contrato]                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              TWIN CONFIGURATION DASHBOARD                 │ │
│  │  • Personality Settings                                   │ │
│  │  • Voice & Visual Avatar                                  │ │
│  │  • Knowledge Base                                         │ │
│  │  • Guardrails & Permissions                               │ │
│  │  • Deployment Options                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              DEPLOYMENT MODELS                            │ │
│  │                                                           │ │
│  │  Model 1: VibeThink Portal (Landing Page)                │ │
│  │  Model 2: Embedded Widget (Client Site)                  │ │
│  │  Model 3: Brand Campaign (Non-Exclusive)                 │ │
│  │  Model 4: White-Label (Custom Domain)                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              MONETIZATION LAYER                           │ │
│  │  • Platform Fee (VibeThink)                               │ │
│  │  • Celebrity Revenue Share                                │ │
│  │  • Brand Campaign Fees                                    │ │
│  │  • Subscription Tiers (Fans)                              │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Architecture: Multi-Tenant Digital Twin Platform

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PLATFORM ADMIN DASHBOARD                        │
│  (VibeThink Team - Manage Celebrities, Contracts, Deployments)     │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  CELEBRITY DASHBOARD (Multi-Tenant)                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │ Andrés Cantor  │  │     Messi      │  │  Tony Robbins  │       │
│  │   Dashboard    │  │   Dashboard    │  │   Dashboard    │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
│         ↓                    ↓                    ↓                 │
│  Configure Twin      Configure Twin      Configure Twin            │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DIGITAL TWIN CORE ENGINE                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Twin Factory (Create, Clone, Configure)                     │  │
│  │  • Voice Clone (Cartesia)                                    │  │
│  │  • Visual Avatar (Tavus)                                     │  │
│  │  • Personality Engine (AGNO + Custom Knowledge)              │  │
│  │  • Multi-Context Awareness (Brand, Portal, Embedded)         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT ORCHESTRATOR                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │ VibeThink      │  │ Embedded       │  │ Brand Campaign │       │
│  │ Portal         │  │ Widget         │  │ (Non-Exclusive)│       │
│  │ (Landing Page) │  │ (Client Site)  │  │ (Coca-Cola)    │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        END USERS (Fans)                             │
│  • Chat with Andrés on VibeThink Portal                            │
│  • Interact with Messi on Nike Campaign                            │
│  • Get coaching from Tony Robbins on his site                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Core Concepts

### 1. **Celebrity Entity** (Tenant)

Cada celebridad es un **tenant** en la plataforma con:

```typescript
interface CelebrityEntity {
  id: string; // UUID
  name: string; // "Andrés Cantor"
  type: CelebrityType; // SPORTS_COMMENTATOR, ATHLETE, COACH, etc.
  
  // Contract & Legal
  contractId: string;
  revenueSharePercentage: number; // e.g., 70% for celebrity, 30% for platform
  exclusivityRules: ExclusivityRules;
  
  // Digital Twin Configuration
  twinConfig: {
    voiceCloneId: string; // Cartesia voice ID
    visualAvatarId: string; // Tavus replica ID
    personalityProfile: PersonalityProfile;
    knowledgeBase: KnowledgeBaseConfig;
    guardrails: GuardrailsConfig;
  };
  
  // Deployment Settings
  deployments: Deployment[];
  
  // Monetization
  pricingTiers: PricingTier[];
  brandCampaigns: BrandCampaign[];
  
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_SETUP';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. **Deployment Model**

Cada twin puede vivir en múltiples contextos:

```typescript
interface Deployment {
  id: string;
  celebrityId: string;
  type: DeploymentType;
  config: DeploymentConfig;
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED';
}

enum DeploymentType {
  VIBETHINK_PORTAL = 'VIBETHINK_PORTAL', // Landing page en vibethink.com/andres-cantor
  EMBEDDED_WIDGET = 'EMBEDDED_WIDGET',   // Widget en sitio del cliente
  BRAND_CAMPAIGN = 'BRAND_CAMPAIGN',     // Campaña específica (Coca-Cola)
  WHITE_LABEL = 'WHITE_LABEL',           // Dominio personalizado
}

interface DeploymentConfig {
  // Portal Config
  portalUrl?: string; // e.g., vibethink.com/andres-cantor
  customDomain?: string; // e.g., andrescantor.com
  
  // Embedded Config
  embedCode?: string; // JavaScript snippet
  allowedDomains?: string[]; // CORS whitelist
  
  // Brand Campaign Config
  brandId?: string;
  campaignId?: string;
  campaignDuration?: { start: Date; end: Date };
  exclusivity?: boolean; // false = non-exclusive
  
  // UI Customization
  theme: ThemeConfig;
  branding: BrandingConfig;
}
```

### 3. **Multi-Context Awareness**

El twin debe saber en qué contexto está operando:

```typescript
interface ConversationContext {
  deploymentId: string;
  deploymentType: DeploymentType;
  
  // Brand Context (if applicable)
  brandId?: string;
  campaignId?: string;
  brandGuidelines?: string[]; // "Mention Coca-Cola positively"
  
  // User Context
  userId: string;
  userTier: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  
  // Session Context
  sessionId: string;
  conversationHistory: Message[];
}
```

---

## 📊 Business Models & Use Cases

### Model 1: VibeThink Portal (Landing Page)

**Descripción:** Twin vive en una landing page creada por VibeThink

**Ejemplo:** `vibethink.com/andres-cantor`

**Revenue:**
- Subscription fees (fans pagan por acceso)
- Revenue share: 70% celebrity, 30% VibeThink

**Features:**
- Custom branding del celebrity
- Chat interface
- Video avatar (Tavus)
- Premium content tiers

---

### Model 2: Embedded Widget (Client Site)

**Descripción:** Twin se embebe en el sitio web del celebrity

**Ejemplo:** Widget en `andrescantor.com`

**Revenue:**
- Monthly platform fee
- Transaction fees (si hay monetización)

**Features:**
- JavaScript embed code
- Customizable UI
- CORS whitelist
- Analytics dashboard

**Implementation:**
```html
<!-- Embed code -->
<script src="https://cdn.vibethink.com/twin-widget.js"></script>
<div id="vibethink-twin" 
     data-celebrity-id="andres-cantor"
     data-theme="dark"
     data-position="bottom-right">
</div>
```

---

### Model 3: Brand Campaign (Non-Exclusive)

**Descripción:** Twin vive en campaña de marca (ej. Coca-Cola) pero puede atender otros clientes

**Ejemplo:** Andrés en campaña de Coca-Cola durante Mundial

**Revenue:**
- Campaign fee (one-time or duration-based)
- CPM/CPC for interactions
- Revenue share con celebrity

**Features:**
- Brand-specific context
- Campaign duration limits
- Non-exclusive (twin puede estar en otras campañas simultáneamente)
- Brand safety guardrails

**Context Switching:**
```typescript
// Twin en Coca-Cola campaign
const cocaColaContext = {
  brandId: 'coca-cola',
  campaignId: 'mundial-2026',
  guidelines: [
    'Mention Coca-Cola positively when relevant',
    'Avoid mentioning competitors (Pepsi, etc.)',
    'Focus on football and celebration themes',
  ],
};

// Mismo twin en Nike campaign (simultáneamente)
const nikeContext = {
  brandId: 'nike',
  campaignId: 'just-do-it-football',
  guidelines: [
    'Mention Nike when discussing football gear',
    'Avoid mentioning Adidas, Puma',
    'Focus on athlete performance',
  ],
};
```

---

### Model 4: White-Label (Custom Domain)

**Descripción:** Twin en dominio personalizado del celebrity

**Ejemplo:** `andrescantor.ai` (dominio propio)

**Revenue Model:**
- **Setup Fee:** One-time fee paid to platform ($5,000-$15,000 depending on customization)
- **Platform Fee:** Fixed monthly infrastructure fee ($500-$2,000/month)
- **Revenue Share:** Standard 70/30 split on all revenue generated through the white-label deployment
  - Celebrity: 70% of subscriptions, transactions, and premium content sales
  - Platform: 30% of subscriptions, transactions, and premium content sales
  - Setup fee and platform fee are separate from revenue share

**What "Direct Revenue" Includes:**
- Subscription fees from end users
- One-time transaction fees (premium content, consultations)
- In-app purchases or upgrades

**What "Direct Revenue" Excludes:**
- Setup fee (one-time, paid to platform)
- Monthly platform fee (fixed operational cost)
- Third-party payment processing fees (Stripe, etc.)

**Features:**
- Custom domain
- Full branding control
- Advanced analytics
- Priority support

---

## 🎛️ Celebrity Dashboard Features

### Dashboard Sections

```
┌─────────────────────────────────────────────────────────────┐
│                  CELEBRITY DASHBOARD                        │
│                  (e.g., Andrés Cantor)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. TWIN CONFIGURATION                                      │
│     • Voice Settings (Cartesia)                             │
│     • Visual Avatar (Tavus)                                 │
│     • Personality Profile                                   │
│     • Knowledge Base Management                             │
│     • Guardrails & Content Limits                           │
│                                                             │
│  2. DEPLOYMENTS                                             │
│     • Active Deployments (Portal, Embedded, Campaigns)      │
│     • Create New Deployment                                 │
│     • Deployment Analytics                                  │
│                                                             │
│  3. BRAND CAMPAIGNS                                         │
│     • Active Campaigns (Coca-Cola, Nike, etc.)              │
│     • Campaign Performance                                  │
│     • Approve/Reject Campaign Requests                      │
│                                                             │
│  4. MONETIZATION                                            │
│     • Revenue Dashboard                                     │
│     • Pricing Tiers Configuration                           │
│     • Payout Settings                                       │
│                                                             │
│  5. ANALYTICS                                               │
│     • Total Interactions                                    │
│     • User Demographics                                     │
│     • Engagement Metrics                                    │
│     • Revenue by Source                                     │
│                                                             │
│  6. CONTENT MODERATION                                      │
│     • Flagged Conversations                                 │
│     • Manual Overrides                                      │
│     • Guardrail Adjustments                                 │
│                                                             │
│  7. SETTINGS                                                │
│     • Profile Information                                   │
│     • Contract Details                                      │
│     • Notification Preferences                              │
│     • API Keys (for advanced users)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Architecture

### Database Schema (Supabase)

```sql
-- Celebrities (Tenants)
CREATE TABLE celebrities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- SPORTS_COMMENTATOR, ATHLETE, COACH, etc.
  contract_id UUID REFERENCES contracts(id),
  revenue_share_percentage DECIMAL(5,2) DEFAULT 70.00,
  twin_config JSONB NOT NULL,
  status TEXT DEFAULT 'PENDING_SETUP',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- VIBETHINK_PORTAL, EMBEDDED_WIDGET, etc.
  config JSONB NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Campaigns
CREATE TABLE brand_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id),
  campaign_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_exclusive BOOLEAN DEFAULT FALSE,
  campaign_fee DECIMAL(10,2),
  guidelines JSONB,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (Multi-Context)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID REFERENCES celebrities(id),
  deployment_id UUID REFERENCES deployments(id),
  user_id UUID REFERENCES users(id),
  context JSONB NOT NULL, -- Includes brand context if applicable
  messages JSONB[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Tracking
CREATE TABLE revenue_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID REFERENCES celebrities(id),
  deployment_id UUID REFERENCES deployments(id),
  brand_campaign_id UUID REFERENCES brand_campaigns(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT NOT NULL, -- SUBSCRIPTION, CAMPAIGN_FEE, TRANSACTION_FEE
  celebrity_share DECIMAL(10,2),
  platform_share DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Data Management & JSONB Strategy

#### 1. JSONB Schema Validation

**Strategy:** Use PostgreSQL JSON Schema validation with triggers

```sql
-- JSON Schema validation function
CREATE OR REPLACE FUNCTION validate_jsonb_schema(
  data JSONB,
  schema JSONB
) RETURNS BOOLEAN AS $$
BEGIN
  -- Use pg_jsonschema extension or custom validation logic
  -- Example: validate twin_config structure
  RETURN jsonb_matches_schema(schema, data);
END;
$$ LANGUAGE plpgsql;

-- Twin Config Schema
CREATE TABLE jsonb_schemas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schema_name TEXT UNIQUE NOT NULL,
  version INTEGER NOT NULL,
  schema JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert twin_config schema
INSERT INTO jsonb_schemas (schema_name, version, schema) VALUES (
  'twin_config',
  1,
  '{
    "type": "object",
    "required": ["voiceCloneId", "visualAvatarId", "personalityProfile"],
    "properties": {
      "voiceCloneId": {"type": "string", "minLength": 1},
      "visualAvatarId": {"type": "string", "minLength": 1},
      "personalityProfile": {
        "type": "object",
        "required": ["tone", "language"],
        "properties": {
          "tone": {"type": "string"},
          "language": {"type": "string"},
          "expertise": {"type": "array", "items": {"type": "string"}}
        }
      },
      "knowledgeBase": {
        "type": "object",
        "properties": {
          "sources": {"type": "array"},
          "lastUpdated": {"type": "string", "format": "date-time"}
        }
      },
      "guardrails": {
        "type": "object",
        "properties": {
          "maxResponseLength": {"type": "integer", "minimum": 100},
          "bannedTopics": {"type": "array", "items": {"type": "string"}},
          "contentRating": {"type": "string", "enum": ["G", "PG", "PG-13", "R"]}
        }
      }
    }
  }'::JSONB
);

-- Validation trigger for celebrities.twin_config
CREATE OR REPLACE FUNCTION validate_celebrity_twin_config()
RETURNS TRIGGER AS $$
DECLARE
  schema JSONB;
BEGIN
  SELECT s.schema INTO schema
  FROM jsonb_schemas s
  WHERE s.schema_name = 'twin_config' AND s.is_active = TRUE
  ORDER BY s.version DESC
  LIMIT 1;

  IF NOT validate_jsonb_schema(NEW.twin_config, schema) THEN
    RAISE EXCEPTION 'Invalid twin_config schema';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_twin_config_before_insert
  BEFORE INSERT OR UPDATE ON celebrities
  FOR EACH ROW
  EXECUTE FUNCTION validate_celebrity_twin_config();
```

**Validation Layers:**
1. **Database Level:** PostgreSQL triggers (strict, enforced)
2. **Application Level:** TypeScript interfaces + Zod validation (developer experience)
3. **API Level:** OpenAPI schema validation (external consumers)

---

#### 2. PostgreSQL ENUMs for Type Safety

**Replace TEXT fields with ENUMs for better data integrity:**

```sql
-- Celebrity Types
CREATE TYPE celebrity_type AS ENUM (
  'SPORTS_COMMENTATOR',
  'ATHLETE',
  'COACH',
  'ENTERTAINER',
  'INFLUENCER',
  'EXPERT'
);

-- Entity Status
CREATE TYPE entity_status AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'PENDING_SETUP',
  'SUSPENDED',
  'ARCHIVED'
);

-- Deployment Types
CREATE TYPE deployment_type AS ENUM (
  'VIBETHINK_PORTAL',
  'EMBEDDED_WIDGET',
  'BRAND_CAMPAIGN',
  'WHITE_LABEL'
);

-- Revenue Transaction Types
CREATE TYPE transaction_type AS ENUM (
  'SUBSCRIPTION',
  'CAMPAIGN_FEE',
  'TRANSACTION_FEE',
  'SETUP_FEE',
  'PLATFORM_FEE'
);

-- Updated schema with ENUMs
CREATE TABLE celebrities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type celebrity_type NOT NULL,
  contract_id UUID REFERENCES contracts(id),
  revenue_share_percentage DECIMAL(5,2) DEFAULT 70.00,
  twin_config JSONB NOT NULL,
  status entity_status DEFAULT 'PENDING_SETUP',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
  type deployment_type NOT NULL,
  config JSONB NOT NULL,
  status entity_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE revenue_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID REFERENCES celebrities(id),
  deployment_id UUID REFERENCES deployments(id),
  brand_campaign_id UUID REFERENCES brand_campaigns(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type transaction_type NOT NULL,
  celebrity_share DECIMAL(10,2),
  platform_share DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### 3. JSONB Indexes for Performance

**GIN indexes for frequently queried JSONB fields:**

```sql
-- Index on twin_config for voice/avatar lookups
CREATE INDEX idx_celebrities_twin_config_voice 
  ON celebrities USING GIN ((twin_config -> 'voiceCloneId'));

CREATE INDEX idx_celebrities_twin_config_avatar 
  ON celebrities USING GIN ((twin_config -> 'visualAvatarId'));

-- Index on deployment config for domain lookups
CREATE INDEX idx_deployments_config_domain 
  ON deployments USING GIN ((config -> 'customDomain'));

CREATE INDEX idx_deployments_config_brand 
  ON deployments USING GIN ((config -> 'brandId'));

-- Index on conversation context for brand queries
CREATE INDEX idx_conversations_context_brand 
  ON conversations USING GIN ((context -> 'brandId'));

CREATE INDEX idx_conversations_context_campaign 
  ON conversations USING GIN ((context -> 'campaignId'));

-- Full JSONB GIN index for flexible queries
CREATE INDEX idx_celebrities_twin_config_gin 
  ON celebrities USING GIN (twin_config);

CREATE INDEX idx_deployments_config_gin 
  ON deployments USING GIN (config);

CREATE INDEX idx_conversations_context_gin 
  ON conversations USING GIN (context);
```

---

#### 4. JSONB Schema Migration Strategy

**Zero-downtime migrations for JSONB schema changes:**

```sql
-- Migration Example: Add new field to twin_config
-- Step 1: Update schema version (non-breaking)
INSERT INTO jsonb_schemas (schema_name, version, schema) VALUES (
  'twin_config',
  2,
  '{
    "type": "object",
    "required": ["voiceCloneId", "visualAvatarId", "personalityProfile"],
    "properties": {
      "voiceCloneId": {"type": "string"},
      "visualAvatarId": {"type": "string"},
      "personalityProfile": {"type": "object"},
      "emotionalRange": {
        "type": "object",
        "properties": {
          "min": {"type": "integer", "minimum": 0, "maximum": 10},
          "max": {"type": "integer", "minimum": 0, "maximum": 10}
        }
      }
    }
  }'::JSONB
);

-- Step 2: Backfill existing records (optional, gradual)
UPDATE celebrities
SET twin_config = twin_config || '{"emotionalRange": {"min": 3, "max": 8}}'::JSONB
WHERE twin_config -> 'emotionalRange' IS NULL;

-- Step 3: Activate new schema version
UPDATE jsonb_schemas
SET is_active = FALSE
WHERE schema_name = 'twin_config' AND version < 2;

UPDATE jsonb_schemas
SET is_active = TRUE
WHERE schema_name = 'twin_config' AND version = 2;
```

**Migration Principles:**
- **Additive Changes:** New optional fields are safe
- **Breaking Changes:** Require version bump + deprecation period
- **Gradual Rollout:** Backfill data in batches (avoid table locks)
- **Rollback Plan:** Keep previous schema version active during transition

---

#### 5. Conversation Growth Management

**Problem:** `messages JSONB[]` can grow unbounded

**Solution: Conversation Partitioning + Archival**

```sql
-- Add message count limit
ALTER TABLE conversations
ADD COLUMN message_count INTEGER DEFAULT 0;

-- Trigger logic (pseudo-code)
IF NEW.message_count > 1000 THEN
  RAISE EXCEPTION 'Conversation limit reached. Please archive.';
END IF;
```

**Implementation Strategy:**

1.  **Preventive Validation (Runtime):**
    *   **Hard Limit:** 1000 messages per conversation.
    *   **Alerting:** Logic triggers warning at 90% capacity (900 messages).
    *   **Enforcement:** Application service (`ConversationService`) checks count before insertion.

2.  **Data Hygiene & Archival (Scheduled):**
    *   **Retention Policy:** Conversations inactive for > 365 days are archived.
    *   **Proactive Monitoring:** Daily cron job (`validate-archival.ts`) alerts on accumulated cold data.
    *   **Multi-Tenant Isolation:** The archival job (`archive-conversations.ts`) iterates strictly by `company_id` to ensure data isolation and avoid cross-tenant performance impact.

    > **Archival Workflow:**
    > 1. Fetch active `company_id` list with archivable data.
    > 2. For each tenant: `UPDATE conversations SET is_archived=TRUE ... LIMIT 500`.
    > 3. Log results per tenant.



-- Trigger to track message count
CREATE OR REPLACE FUNCTION update_message_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.message_count = jsonb_array_length(NEW.messages);
  
  -- Auto-archive if exceeds 1000 messages
  IF NEW.message_count > 1000 THEN
    RAISE EXCEPTION 'Conversation exceeds 1000 messages. Archive required.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_message_count
  BEFORE INSERT OR UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_message_count();

-- Archived conversations table (cold storage)
CREATE TABLE conversations_archive (
  id UUID PRIMARY KEY,
  celebrity_id UUID,
  deployment_id UUID,
  user_id UUID,
  context JSONB,
  messages JSONB[],
  message_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

-- Archive old conversations (run monthly)
CREATE OR REPLACE FUNCTION archive_old_conversations()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Move conversations older than 1 year to archive
  WITH moved AS (
    DELETE FROM conversations
    WHERE updated_at < NOW() - INTERVAL '1 year'
      AND is_archived = FALSE
    RETURNING *
  )
  INSERT INTO conversations_archive
  SELECT *, NOW() FROM moved;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Scheduled job (pg_cron or external scheduler)
-- SELECT cron.schedule('archive-conversations', '0 2 1 * *', 'SELECT archive_old_conversations()');
```

**Conversation Limits:**
- **Max Messages per Conversation:** 1,000 messages
- **Active Retention:** 1 year
- **Archive Retention:** 7 years (compliance)
- **Pagination:** API returns max 50 messages per request

---

#### 6. Data Archival & Compression Strategy

**Multi-tier storage strategy:**

```
┌─────────────────────────────────────────────────────────┐
│                  DATA LIFECYCLE                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HOT STORAGE (PostgreSQL)                               │
│  • Active conversations (< 1 year)                      │
│  • All celebrity/deployment configs                     │
│  • Recent revenue transactions (< 2 years)              │
│  • SLA: < 100ms query time                              │
│                                                         │
│  WARM STORAGE (PostgreSQL Archive Tables)               │
│  • Archived conversations (1-7 years)                   │
│  • Historical revenue (2-7 years)                       │
│  • SLA: < 1s query time                                 │
│  • Compression: TOAST + pg_compression                  │
│                                                         │
│  COLD STORAGE (S3/Object Storage)                       │
│  • Conversations > 7 years                              │
│  • Compliance/audit logs                                │
│  • SLA: < 10s retrieval time                            │
│  • Format: Parquet (compressed, columnar)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Compression Settings:**

```sql
-- Enable TOAST compression for JSONB columns
ALTER TABLE conversations
  ALTER COLUMN messages SET STORAGE EXTENDED;

ALTER TABLE conversations
  ALTER COLUMN context SET STORAGE EXTENDED;

-- Partition conversations by month (PostgreSQL 10+)
CREATE TABLE conversations_partitioned (
  id UUID NOT NULL,
  celebrity_id UUID,
  deployment_id UUID,
  user_id UUID,
  context JSONB NOT NULL,
  messages JSONB[],
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE conversations_2026_01 PARTITION OF conversations_partitioned
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE conversations_2026_02 PARTITION OF conversations_partitioned
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Auto-create partitions (pg_partman extension)
```

**Archival Schedule:**

| Data Type | Hot → Warm | Warm → Cold | Cold → Delete |
|-----------|------------|-------------|---------------|
| Conversations | 1 year | 7 years | Never (compliance) |
| Revenue Transactions | 2 years | 7 years | 10 years |
| Analytics Events | 90 days | 2 years | 5 years |
| Audit Logs | 1 year | 7 years | Never |

---

#### 7. Monitoring & Alerts

**Key metrics to track:**

```sql
-- Table size monitoring
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- JSONB field size distribution
SELECT
  celebrity_id,
  pg_size_pretty(pg_column_size(twin_config)) AS config_size,
  jsonb_object_keys(twin_config) AS keys
FROM celebrities
ORDER BY pg_column_size(twin_config) DESC
LIMIT 10;

-- Conversation growth rate
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS new_conversations,
  AVG(message_count) AS avg_messages,
  MAX(message_count) AS max_messages
FROM conversations
GROUP BY month
ORDER BY month DESC;
```

**Alerts:**
- 🔴 **Critical:** Conversation exceeds 900 messages (approaching limit)
- 🟡 **Warning:** Table size > 80% of allocated storage
- 🟡 **Warning:** JSONB field > 1MB (performance degradation)
- 🔵 **Info:** Archive job completed (monthly report)

---

## 🚀 Implementation Roadmap

### Phase 1: Platform Foundation (8 weeks)

**Objectives:**
- Multi-tenant architecture
- Celebrity entity management
- Basic dashboard

**Deliverables:**
- [ ] Database schema (multi-tenant)
- [ ] Celebrity CRUD operations
- [ ] Basic dashboard UI
- [ ] Authentication & authorization (RLS)

---

### Phase 2: Twin Factory (6 weeks)

**Objectives:**
- Automated twin creation
- Voice + Visual integration
- Personality configuration

**Deliverables:**
- [ ] Cartesia integration (voice cloning)
- [ ] Tavus integration (visual avatar)
- [ ] Personality engine (AGNO)
- [ ] Knowledge base management

---

### Phase 3: Deployment Models (8 weeks)

**Objectives:**
- Implement 4 deployment models
- Embed widget
- Multi-context awareness

**Deliverables:**
- [ ] VibeThink Portal (landing pages)
- [ ] Embedded widget (JavaScript SDK)
- [ ] Brand campaign framework
- [ ] White-label support

---

### Phase 4: Monetization & Analytics (6 weeks)

**Objectives:**
- Revenue tracking
- Analytics dashboard
- Payment integration

**Deliverables:**
- [ ] Subscription management
- [ ] Campaign fee tracking
- [ ] Revenue share calculation
- [ ] Analytics dashboard
- [ ] Payment provider integration (Stripe)

---

### Phase 5: Scale & Optimize (Ongoing)

**Objectives:**
- Performance optimization
- Celebrity onboarding automation
- Advanced features

**Deliverables:**
- [ ] Automated onboarding flow
- [ ] Performance monitoring
- [ ] A/B testing framework
- [ ] Advanced analytics

---

## 💰 Revenue Model

### Platform Revenue Streams

```
┌─────────────────────────────────────────────────────────────┐
│                  REVENUE STREAMS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PLATFORM FEE (30% of celebrity revenue)                 │
│     • Subscription fees                                     │
│     • Transaction fees                                      │
│                                                             │
│  2. DEPLOYMENT FEES                                         │
│     • Embedded Widget: $500/month (fixed platform fee)      │
│     • White-Label: $500-$2,000/month + $5,000-$15,000 setup │
│       (fees are separate from 30% revenue share)            │
│                                                             │
│  3. BRAND CAMPAIGN FEES                                     │
│     • Campaign setup fee                                    │
│     • CPM/CPC for interactions                              │
│     • Revenue share (20% platform, 80% celebrity)           │
│                                                             │
│  4. ENTERPRISE FEATURES                                     │
│     • Custom integrations                                   │
│     • Advanced analytics                                    │
│     • Priority support                                      │
│     • White-glove onboarding                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Example Revenue Calculation

**Scenario:** Andrés Cantor Twin

```
Portal Subscriptions:
  • 10,000 fans × $10/month = $100,000/month
  • Celebrity share (70%): $70,000
  • Platform share (30%): $30,000

Brand Campaign (Coca-Cola):
  • Campaign fee: $50,000 (3 months)
  • Celebrity share (80%): $40,000
  • Platform share (20%): $10,000

Embedded Widget (andrescantor.com):
  • Platform fee: $500/month
  • Platform revenue: $500

Total Monthly Revenue:
  • Celebrity: $70,000 + $13,333 = $83,333
  • Platform: $30,000 + $3,333 + $500 = $33,833
```

---

## 🔒 Multi-Tenancy & Security

### Row-Level Security (RLS)

```sql
-- Celebrities can only see their own data
CREATE POLICY celebrity_isolation ON celebrities
  FOR ALL
  USING (auth.uid() = owner_user_id);

-- Deployments isolated by celebrity
CREATE POLICY deployment_isolation ON deployments
  FOR ALL
  USING (
    celebrity_id IN (
      SELECT id FROM celebrities WHERE owner_user_id = auth.uid()
    )
  );

-- Brand campaigns isolated
CREATE POLICY campaign_isolation ON brand_campaigns
  FOR ALL
  USING (
    celebrity_id IN (
      SELECT id FROM celebrities WHERE owner_user_id = auth.uid()
    )
    OR
    brand_id IN (
      SELECT id FROM brands WHERE owner_user_id = auth.uid()
    )
  );
```

---

## 🏛️ Compliance-as-a-Service Module

### Overview

The platform provides **Compliance-as-a-Service** as a configurable feature for all tenants (including ViTo itself). Each tenant can enable/disable compliance frameworks, and the system automatically generates evidence artifacts from platform events to demonstrate adherence to selected standards.

> **Dogfooding Principle:** ViTo operates as a tenant of its own platform, using the same Compliance-as-a-Service module to track its own compliance with CMMI, ISO 27001, and other frameworks.

---

### 1. Supported Compliance Frameworks

#### Available Frameworks (Configurable per Tenant)

```typescript
enum ComplianceFramework {
  CMMI_ML3 = 'CMMI_ML3',                    // Capability Maturity Model Integration - Level 3
  ISO_27001 = 'ISO_27001',                  // Information Security Management
  SOC2_TYPE2 = 'SOC2_TYPE2',                // Security, Availability, Confidentiality
  GDPR = 'GDPR',                            // General Data Protection Regulation
  HIPAA = 'HIPAA',                          // Health Insurance Portability (Healthcare)
  PCI_DSS = 'PCI_DSS',                      // Payment Card Industry Data Security
  NIST_CSF = 'NIST_CSF',                    // NIST Cybersecurity Framework
  ISO_9001 = 'ISO_9001',                    // Quality Management Systems
  COBIT = 'COBIT',                          // Control Objectives for IT
  ITIL = 'ITIL',                            // IT Service Management
}

interface TenantComplianceConfig {
  tenantId: string;
  enabledFrameworks: ComplianceFramework[];
  subscriptionTier: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  autoEvidenceGeneration: boolean;
  retentionPeriod: number; // years
  customFrameworks?: CustomFramework[];
}
```

**Framework Availability by Tier:**

| Framework | FREE | PROFESSIONAL | ENTERPRISE |
|-----------|------|--------------|------------|
| CMMI-ML3 | ❌ | ✅ | ✅ |
| ISO 27001 | ❌ | ✅ | ✅ |
| SOC 2 Type II | ❌ | ❌ | ✅ |
| GDPR | ✅ | ✅ | ✅ |
| HIPAA | ❌ | ❌ | ✅ |
| PCI-DSS | ❌ | ❌ | ✅ |
| NIST CSF | ❌ | ✅ | ✅ |
| ISO 9001 | ❌ | ✅ | ✅ |
| Custom Frameworks | ❌ | ❌ | ✅ (up to 3) |

---

### 2. Event-Driven Evidence Generation

#### Single Event → Multi-Framework Evidence

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                  PLATFORM EVENT BUS                         │
│  (All tenant actions flow through this)                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              COMPLIANCE EVENT PROCESSOR                     │
│  • Reads tenant's enabled frameworks                        │
│  • Maps event to compliance requirements                    │
│  • Generates evidence artifacts                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              EVIDENCE STORAGE & INDEXING                    │
│  • Immutable audit log (append-only)                        │
│  • Indexed by framework, control, date                      │
│  • Cryptographically signed (tamper-proof)                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              COMPLIANCE DASHBOARD                           │
│  • Real-time compliance score per framework                 │
│  • Gap analysis and recommendations                         │
│  • Exportable audit reports (PDF, JSON)                     │
└─────────────────────────────────────────────────────────────┘
```

---

#### Example: Code Deployment Event

**Event:**
```typescript
{
  eventType: 'CODE_DEPLOYMENT',
  tenantId: 'vito-internal',
  timestamp: '2026-01-10T00:30:00Z',
  actor: {
    userId: 'john.doe@vibethink.com',
    role: 'SENIOR_ENGINEER'
  },
  payload: {
    version: 'v2.3.1',
    environment: 'PRODUCTION',
    deploymentType: 'CANARY',
    approvals: [
      { userId: 'tech-lead@vibethink.com', timestamp: '2026-01-10T00:25:00Z' },
      { userId: 'devops-lead@vibethink.com', timestamp: '2026-01-10T00:27:00Z' }
    ],
    qualityGates: {
      tests: 'PASSED',
      coverage: 0.87,
      securityScan: 'PASSED',
      performanceTest: 'PASSED'
    },
    rollbackPlan: 'docs/runbooks/rollback-v2.3.1.md'
  }
}
```

**Auto-Generated Evidence (Multi-Framework):**

```typescript
// CMMI-ML3 Evidence
{
  frameworkId: 'CMMI_ML3',
  processArea: 'Product Integration (PI)',
  practice: 'PI.SP.2.1 - Prepare for Product Integration',
  evidenceType: 'DEPLOYMENT_LOG',
  artifact: {
    title: 'Production Deployment v2.3.1',
    description: 'Canary deployment with quality gates and approvals',
    url: 's3://compliance-evidence/vito/cmmi/2026-01-10/deployment-v2.3.1.json',
    hash: 'sha256:abc123...',
    signature: 'sig:xyz789...'
  },
  compliance: 'COMPLIANT',
  timestamp: '2026-01-10T00:30:00Z'
}

// ISO 27001 Evidence
{
  frameworkId: 'ISO_27001',
  control: 'A.12.1.2 - Change Management',
  evidenceType: 'CHANGE_RECORD',
  artifact: {
    title: 'Change Record: Production Deployment v2.3.1',
    description: 'Approved change with security validation',
    url: 's3://compliance-evidence/vito/iso27001/2026-01-10/change-v2.3.1.pdf',
    hash: 'sha256:def456...',
    signature: 'sig:uvw012...'
  },
  compliance: 'COMPLIANT',
  timestamp: '2026-01-10T00:30:00Z'
}

// SOC 2 Evidence
{
  frameworkId: 'SOC2_TYPE2',
  trustServiceCriteria: 'CC7.2 - System Monitoring',
  evidenceType: 'MONITORING_LOG',
  artifact: {
    title: 'Post-Deployment Monitoring v2.3.1',
    description: 'Canary monitoring with error rate and latency tracking',
    url: 's3://compliance-evidence/vito/soc2/2026-01-10/monitoring-v2.3.1.json',
    hash: 'sha256:ghi789...',
    signature: 'sig:rst345...'
  },
  compliance: 'COMPLIANT',
  timestamp: '2026-01-10T00:30:00Z'
}

// GDPR Evidence (if applicable)
{
  frameworkId: 'GDPR',
  article: 'Article 32 - Security of Processing',
  evidenceType: 'SECURITY_VALIDATION',
  artifact: {
    title: 'Security Scan Report v2.3.1',
    description: 'SAST/DAST scan with no critical vulnerabilities',
    url: 's3://compliance-evidence/vito/gdpr/2026-01-10/security-scan-v2.3.1.pdf',
    hash: 'sha256:jkl012...',
    signature: 'sig:mno678...'
  },
  compliance: 'COMPLIANT',
  timestamp: '2026-01-10T00:30:00Z'
}
```

---

### 3. Framework Mapping Configuration

#### CMMI-ML3 Process Areas Mapping

```typescript
const cmmiML3Mapping: ComplianceMapping = {
  frameworkId: 'CMMI_ML3',
  processAreas: [
    {
      id: 'RD',
      name: 'Requirements Development',
      practices: [
        {
          id: 'RD.SP.1.1',
          name: 'Elicit Needs',
          platformEvents: ['USER_STORY_CREATED', 'REQUIREMENT_DOCUMENTED'],
          evidenceTypes: ['USER_STORY', 'ACCEPTANCE_CRITERIA']
        },
        {
          id: 'RD.SP.2.1',
          name: 'Develop Customer Requirements',
          platformEvents: ['STAKEHOLDER_APPROVAL', 'REQUIREMENT_REVIEW'],
          evidenceTypes: ['APPROVAL_RECORD', 'REVIEW_NOTES']
        }
      ]
    },
    {
      id: 'TS',
      name: 'Technical Solution',
      practices: [
        {
          id: 'TS.SP.1.1',
          name: 'Develop Alternative Solutions',
          platformEvents: ['ADR_CREATED', 'ARCHITECTURE_REVIEW'],
          evidenceTypes: ['ADR_DOCUMENT', 'REVIEW_MINUTES']
        }
      ]
    },
    {
      id: 'PI',
      name: 'Product Integration',
      practices: [
        {
          id: 'PI.SP.2.1',
          name: 'Prepare for Product Integration',
          platformEvents: ['CODE_DEPLOYMENT', 'STAGING_VALIDATION'],
          evidenceTypes: ['DEPLOYMENT_LOG', 'TEST_REPORT']
        }
      ]
    },
    {
      id: 'VER',
      name: 'Verification',
      practices: [
        {
          id: 'VER.SP.1.1',
          name: 'Select Work Products for Verification',
          platformEvents: ['TEST_EXECUTION', 'CODE_REVIEW'],
          evidenceTypes: ['TEST_RESULTS', 'REVIEW_RECORD']
        }
      ]
    },
    {
      id: 'VAL',
      name: 'Validation',
      practices: [
        {
          id: 'VAL.SP.1.1',
          name: 'Select Products for Validation',
          platformEvents: ['QA_VALIDATION', 'USER_ACCEPTANCE_TEST'],
          evidenceTypes: ['QA_REPORT', 'UAT_RESULTS']
        }
      ]
    },
    {
      id: 'OPF',
      name: 'Organizational Process Focus',
      practices: [
        {
          id: 'OPF.SP.1.1',
          name: 'Determine Process Improvement Opportunities',
          platformEvents: ['RETROSPECTIVE_COMPLETED', 'PROCESS_AUDIT'],
          evidenceTypes: ['RETROSPECTIVE_NOTES', 'AUDIT_REPORT']
        }
      ]
    },
    {
      id: 'OPD',
      name: 'Organizational Process Definition',
      practices: [
        {
          id: 'OPD.SP.1.1',
          name: 'Establish Standard Processes',
          platformEvents: ['PROCESS_DOCUMENTED', 'STANDARD_UPDATED'],
          evidenceTypes: ['PROCESS_DOCUMENT', 'STANDARD_VERSION']
        }
      ]
    },
    {
      id: 'OT',
      name: 'Organizational Training',
      practices: [
        {
          id: 'OT.SP.1.1',
          name: 'Establish Strategic Training Needs',
          platformEvents: ['TRAINING_COMPLETED', 'CERTIFICATION_ACHIEVED'],
          evidenceTypes: ['TRAINING_CERTIFICATE', 'SKILL_ASSESSMENT']
        }
      ]
    },
    {
      id: 'IPM',
      name: 'Integrated Project Management',
      practices: [
        {
          id: 'IPM.SP.1.1',
          name: 'Establish Project Defined Process',
          platformEvents: ['RELEASE_PLANNED', 'SPRINT_STARTED'],
          evidenceTypes: ['RELEASE_PLAN', 'SPRINT_PLAN']
        }
      ]
    },
    {
      id: 'RSKM',
      name: 'Risk Management',
      practices: [
        {
          id: 'RSKM.SP.1.1',
          name: 'Identify Risks',
          platformEvents: ['INCIDENT_CREATED', 'POST_MORTEM_COMPLETED'],
          evidenceTypes: ['INCIDENT_REPORT', 'POST_MORTEM_DOCUMENT']
        }
      ]
    },
    {
      id: 'DAR',
      name: 'Decision Analysis and Resolution',
      practices: [
        {
          id: 'DAR.SP.1.1',
          name: 'Establish Guidelines for Decision Analysis',
          platformEvents: ['ARB_MEETING', 'ADR_APPROVED'],
          evidenceTypes: ['MEETING_MINUTES', 'ADR_APPROVAL']
        }
      ]
    }
  ]
};
```

---

#### ISO 27001 Controls Mapping

```typescript
const iso27001Mapping: ComplianceMapping = {
  frameworkId: 'ISO_27001',
  controls: [
    {
      id: 'A.5.1.1',
      name: 'Policies for Information Security',
      platformEvents: ['SECURITY_POLICY_UPDATED', 'POLICY_REVIEW'],
      evidenceTypes: ['POLICY_DOCUMENT', 'REVIEW_RECORD']
    },
    {
      id: 'A.9.2.1',
      name: 'User Registration and De-registration',
      platformEvents: ['USER_CREATED', 'USER_DEACTIVATED', 'ROLE_ASSIGNED'],
      evidenceTypes: ['USER_AUDIT_LOG', 'ACCESS_CONTROL_RECORD']
    },
    {
      id: 'A.12.1.2',
      name: 'Change Management',
      platformEvents: ['CODE_DEPLOYMENT', 'CONFIGURATION_CHANGE'],
      evidenceTypes: ['CHANGE_RECORD', 'APPROVAL_LOG']
    },
    {
      id: 'A.12.4.1',
      name: 'Event Logging',
      platformEvents: ['AUDIT_LOG_CREATED', 'SECURITY_EVENT'],
      evidenceTypes: ['AUDIT_LOG', 'SECURITY_INCIDENT_LOG']
    },
    {
      id: 'A.16.1.4',
      name: 'Assessment of and Decision on Information Security Events',
      platformEvents: ['INCIDENT_CREATED', 'INCIDENT_RESOLVED'],
      evidenceTypes: ['INCIDENT_REPORT', 'RESOLUTION_RECORD']
    },
    {
      id: 'A.18.1.1',
      name: 'Identification of Applicable Legislation',
      platformEvents: ['COMPLIANCE_AUDIT', 'GDPR_ASSESSMENT'],
      evidenceTypes: ['COMPLIANCE_REPORT', 'LEGAL_REVIEW']
    }
  ]
};
```

---

### 4. Tenant Configuration UI

#### Compliance Settings Panel

```typescript
// Tenant Dashboard: Settings > Compliance
interface ComplianceSettingsUI {
  tenantId: string;
  
  // Framework Selection
  enabledFrameworks: {
    framework: ComplianceFramework;
    enabled: boolean;
    configuredAt: Date;
    lastAudit: Date;
  }[];
  
  // Evidence Generation
  autoGeneration: boolean;
  retentionPeriod: number; // years
  
  // Reporting
  reportingFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  reportRecipients: string[]; // email addresses
  
  // Audit Trail
  auditLogRetention: number; // years
  immutableStorage: boolean;
  cryptographicSigning: boolean;
}
```

**UI Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│              COMPLIANCE SETTINGS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Enabled Compliance Frameworks                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ☑ CMMI-ML3 (Capability Maturity Model)            │    │
│  │   Last Audit: 2026-01-05 | Score: 87%             │    │
│  │                                                    │    │
│  │ ☑ ISO 27001 (Information Security)                │    │
│  │   Last Audit: 2026-01-03 | Score: 92%             │    │
│  │                                                    │    │
│  │ ☐ SOC 2 Type II (Security & Availability)         │    │
│  │   ⚠️ Requires Enterprise Plan                      │    │
│  │                                                    │    │
│  │ ☑ GDPR (Data Privacy)                             │    │
│  │   Last Audit: 2026-01-08 | Score: 95%             │    │
│  │                                                    │    │
│  │ ☐ HIPAA (Healthcare Compliance)                   │    │
│  │   ⚠️ Requires Enterprise Plan                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Evidence Generation                                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ☑ Auto-generate evidence from platform events     │    │
│  │ Retention Period: [7] years                        │    │
│  │ ☑ Cryptographic signing (tamper-proof)            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Reporting                                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Frequency: [Monthly ▼]                             │    │
│  │ Recipients: compliance@company.com                 │    │
│  │             legal@company.com                      │    │
│  │ [+ Add Recipient]                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  [Save Changes]  [Export Compliance Report]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Compliance Dashboard & Reporting

#### Real-Time Compliance Score

```typescript
interface ComplianceDashboard {
  tenantId: string;
  frameworks: {
    frameworkId: ComplianceFramework;
    score: number; // 0-100
    status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
    totalControls: number;
    compliantControls: number;
    gaps: ComplianceGap[];
    lastAudit: Date;
    nextAudit: Date;
  }[];
  
  recentEvidence: Evidence[];
  upcomingAudits: Audit[];
  recommendations: Recommendation[];
}

interface ComplianceGap {
  controlId: string;
  controlName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
  estimatedEffort: string; // e.g., "2-4 weeks"
}
```

**Dashboard Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│              COMPLIANCE DASHBOARD                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Overall Compliance Score: 91% ✅                           │
│  ████████████████████░░░░ (234 of 257 controls met)        │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ CMMI-ML3                                           │    │
│  │ Score: 87% ⚠️  (11 process areas, 2 gaps)          │    │
│  │ ████████████████████░░░░                           │    │
│  │ Last Audit: 2026-01-05 | Next: 2026-04-05          │    │
│  │ [View Details] [Export Report]                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ISO 27001                                          │    │
│  │ Score: 92% ✅  (114 controls, 9 gaps)              │    │
│  │ ██████████████████████░░                           │    │
│  │ Last Audit: 2026-01-03 | Next: 2027-01-03          │    │
│  │ [View Details] [Export Report]                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ GDPR                                               │    │
│  │ Score: 95% ✅  (89 requirements, 4 gaps)           │    │
│  │ ███████████████████████░                           │    │
│  │ Last Audit: 2026-01-08 | Next: 2026-04-08          │    │
│  │ [View Details] [Export Report]                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Recent Evidence (Last 7 Days)                              │
│  • 2026-01-10: Code Deployment v2.3.1 (3 frameworks)       │
│  • 2026-01-09: Security Audit Completed (2 frameworks)     │
│  • 2026-01-08: User Access Review (ISO 27001, GDPR)        │
│  • 2026-01-07: Incident Response Drill (CMMI, ISO)         │
│                                                             │
│  Critical Gaps (Action Required)                            │
│  🔴 CMMI-ML3: OT.SP.1.1 - Training records incomplete      │
│  🔴 ISO 27001: A.12.4.1 - Log retention policy missing     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Evidence Storage & Audit Trail

#### Immutable Audit Log

```sql
-- Evidence storage (append-only, immutable)
CREATE TABLE compliance_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  framework_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  event_id UUID NOT NULL REFERENCES platform_events(id),
  
  -- Evidence metadata
  evidence_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  artifact_url TEXT NOT NULL,
  artifact_hash TEXT NOT NULL, -- SHA-256
  artifact_signature TEXT NOT NULL, -- Cryptographic signature
  
  -- Compliance assessment
  compliance_status TEXT NOT NULL, -- COMPLIANT, PARTIAL, NON_COMPLIANT
  assessor_id UUID REFERENCES users(id),
  assessment_notes TEXT,
  
  -- Timestamps (immutable)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Prevent updates/deletes
  CONSTRAINT no_updates CHECK (created_at = created_at)
);

-- Index for fast queries
CREATE INDEX idx_evidence_tenant_framework 
  ON compliance_evidence(tenant_id, framework_id, created_at DESC);

CREATE INDEX idx_evidence_control 
  ON compliance_evidence(framework_id, control_id, created_at DESC);

-- Row-Level Security (RLS)
CREATE POLICY evidence_isolation ON compliance_evidence
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Prevent updates/deletes (append-only)
CREATE POLICY evidence_immutable ON compliance_evidence
  FOR UPDATE
  USING (false);

CREATE POLICY evidence_no_delete ON compliance_evidence
  FOR DELETE
  USING (false);
```

---

### 7. ViTo as a Tenant (Dogfooding)

#### ViTo's Compliance Configuration

```typescript
// ViTo's own compliance settings
const vitoComplianceConfig: TenantComplianceConfig = {
  tenantId: 'vito-internal',
  enabledFrameworks: [
    ComplianceFramework.CMMI_ML3,
    ComplianceFramework.ISO_27001,
    ComplianceFramework.SOC2_TYPE2,
    ComplianceFramework.GDPR,
    ComplianceFramework.NIST_CSF
  ],
  subscriptionTier: 'ENTERPRISE',
  autoEvidenceGeneration: true,
  retentionPeriod: 7, // years
  customFrameworks: [
    {
      id: 'VIBETHINK_INTERNAL',
      name: 'VibeThink Internal Quality Standards',
      controls: [
        {
          id: 'VT-001',
          name: 'Code Review Mandatory',
          description: 'All code must have 2+ approvals before merge',
          evidenceTypes: ['PR_APPROVAL_LOG']
        },
        {
          id: 'VT-002',
          name: 'Security Scan on Every Commit',
          description: 'SAST/DAST scan required for all commits',
          evidenceTypes: ['SECURITY_SCAN_REPORT']
        }
      ]
    }
  ]
};
```

**ViTo's Compliance Dashboard:**

```
┌─────────────────────────────────────────────────────────────┐
│         VITO INTERNAL COMPLIANCE DASHBOARD                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Overall Score: 89% ✅  (Using our own Compliance Module)   │
│                                                             │
│  CMMI-ML3: 87% ⚠️  | ISO 27001: 92% ✅ | SOC 2: 90% ✅      │
│  GDPR: 95% ✅      | NIST CSF: 88% ⚠️                       │
│                                                             │
│  Recent Evidence (Auto-Generated):                          │
│  • 2026-01-10 00:30: Code Deployment v2.3.1                 │
│    → CMMI (PI), ISO (A.12.1.2), SOC2 (CC7.2), GDPR (Art.32) │
│  • 2026-01-09 14:22: Security Audit Completed               │
│    → ISO (A.18.2.2), SOC2 (CC5.2), NIST (PR.IP-12)          │
│                                                             │
│  🎯 Dogfooding Success: ViTo uses its own platform!         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. Monetization Strategy

#### Pricing Tiers

| Feature | FREE | PROFESSIONAL | ENTERPRISE |
|---------|------|--------------|------------|
| **Frameworks** | GDPR only | 5 frameworks | Unlimited |
| **Custom Frameworks** | ❌ | ❌ | ✅ (up to 3) |
| **Evidence Retention** | 1 year | 3 years | 7 years |
| **Auto-Generation** | ❌ | ✅ | ✅ |
| **Cryptographic Signing** | ❌ | ✅ | ✅ |
| **Audit Reports** | Manual export | Monthly | Real-time |
| **Gap Analysis** | ❌ | ✅ | ✅ + AI recommendations |
| **API Access** | ❌ | Read-only | Full CRUD |
| **Support** | Community | Email | Dedicated CSM |
| **Price** | $0/month | $299/month | Custom |

---

## 📈 Success Metrics

### Platform KPIs

- **Celebrities Onboarded:** X per month
- **Total Deployments:** Y active deployments
- **Platform Revenue:** $Z/month
- **Celebrity Satisfaction:** NPS >70
- **Uptime:** >99.9%

### Celebrity KPIs (per twin)

- **Total Interactions:** X/month
- **Revenue Generated:** $Y/month
- **User Retention:** >60% MAU
- **Brand Campaigns:** Z active campaigns

---

## 🎯 Next Steps

### Immediate (Week 1-2)

1. [ ] Refine multi-tenant architecture
2. [ ] Create database schema
3. [ ] Design celebrity dashboard mockups
4. [ ] Define API contracts

### Short-term (Month 1)

1. [ ] Implement celebrity entity management
2. [ ] Build basic dashboard
3. [ ] Setup authentication & RLS
4. [ ] Create first twin (Andrés Cantor)

### Medium-term (Month 2-3)

1. [ ] Implement deployment models
2. [ ] Build embed widget
3. [ ] Launch first brand campaign
4. [ ] Onboard 2-3 more celebrities

---

**Status:** 🟡 PLANNING  
**Last Updated:** 2026-01-10  
**Version:** 1.0
