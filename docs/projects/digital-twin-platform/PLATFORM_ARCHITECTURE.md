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

**Revenue:**
- Enterprise pricing
- Setup fee + monthly platform fee
- Celebrity keeps 100% of direct revenue

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
│     • Embedded Widget: $X/month                             │
│     • White-Label: $X/month + setup fee                     │
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
