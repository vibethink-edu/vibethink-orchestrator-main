# Platform Health - Specification

> **Purpose:** Real-time monitoring dashboard for VibeThink infrastructure health  
> **Audience:** Ops Team, Super Admins, Public (status page)  
> **Priority:** HIGH (Critical for incident response)  
> **Deployment:** `health.vibethink.co` (separate Next.js app)

---

## 🌐 Architecture Decision

**Platform Health will be a SEPARATE application:**

- **URL:** `health.vibethink.co`
- **Codebase:** `apps/health` (new Next.js app)
- **Why separate?**
  - Public status page (customers can check uptime)
  - Isolated from Admin Console (if Admin is down, Health still works)
  - Different access controls (public vs internal)
  - Can run on different infrastructure for redundancy

**Access Levels:**
- **Public View:** Basic uptime status (✅/❌ for major services)
- **Internal View (requires auth):** Detailed metrics, graphs, logs

---

## 🎯 Objective

Provide a single-pane-of-glass view of all critical system components, enabling rapid detection and response to infrastructure issues.

---

## 📊 Components to Monitor

### 1. **Database Health**
- **Supabase Connection Status**
  - ✅ Connected / ❌ Disconnected
  - Response time (ms)
  - Active connections count
  - Connection pool utilization

- **Query Performance**
  - Slow queries (> 1s)
  - Failed queries (last 1h)
  - Average query time

### 2. **API Health**
- **Next.js API Routes**
  - Response time (p50, p95, p99)
  - Error rate (5xx responses)
  - Request volume (last 1h)

- **External APIs**
  - OpenAI API status
  - Tavus API status
  - ElevenLabs API status
  - Response times

### 3. **Authentication**
- **Supabase Auth**
  - Active sessions count
  - Failed login attempts (last 1h)
  - MFA status

### 4. **Storage**
- **Supabase Storage**
  - Total usage (GB)
  - Upload success rate
  - CDN cache hit rate

### 5. **Background Jobs**
- **Queue Status** (if using)
  - Pending jobs
  - Failed jobs (last 24h)
  - Average processing time

### 6. **Tenant Metrics**
- **Active Tenants**
  - Total active tenants
  - Tenants with errors (last 1h)
  - Average response time per tenant

---

## 🎨 UI Design (Bundui-based)

### Layout
```
┌─────────────────────────────────────────────────┐
│ Platform Health                                 │
│ Real-time system status                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Database │  │   API    │  │  Auth    │     │
│  │    ✅    │  │    ✅    │  │    ⚠️    │     │
│  │  12ms    │  │  45ms    │  │ 3 failed │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Storage  │  │  Queue   │  │ Tenants  │     │
│  │    ✅    │  │    ✅    │  │    ✅    │     │
│  │  2.3 GB  │  │  0 jobs  │  │ 3 active │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Recent Incidents                        │   │
│  │ • 18:15 - Auth: 3 failed logins         │   │
│  │ • 17:42 - DB: Slow query detected       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Status Indicators
- 🟢 **Healthy:** All metrics within normal range
- 🟡 **Warning:** Approaching thresholds
- 🔴 **Critical:** Threshold exceeded or service down
- ⚫ **Unknown:** No data available

---

## 🔧 Implementation

### Phase 1: Basic Health Checks (MVP)
**Deliverables:**
- `/status` page with 6 cards (Database, API, Auth, Storage, Queue, Tenants)
- Simple ping checks (✅/❌ status)
- Manual refresh button

**Data Sources:**
- Supabase Admin API (for DB/Auth/Storage metrics)
- Next.js API route (`/api/health`) for self-checks
- Hardcoded external API checks (fetch with timeout)

**Estimated Time:** 2-3 hours

### Phase 2: Real-time Metrics
**Deliverables:**
- Auto-refresh every 30s
- Response time graphs (last 1h)
- Error rate trends
- Incident timeline

**Data Sources:**
- Vercel Analytics API (if deployed on Vercel)
- Custom logging (if using Pino/Winston)
- Supabase Logs API

**Estimated Time:** 4-6 hours

### Phase 3: Alerting
**Deliverables:**
- Email/Slack alerts on critical issues
- Configurable thresholds
- Alert history

**Data Sources:**
- Webhook to Slack
- Email via Resend/SendGrid

**Estimated Time:** 3-4 hours

---

## 📝 API Endpoints

### `GET /api/health`
**Purpose:** Self-check for Next.js app

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-10T18:19:00Z",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 12
    },
    "auth": {
      "status": "healthy",
      "activeConnections": 45
    }
  }
}
```

### `GET /api/health/external`
**Purpose:** Check external API dependencies

**Response:**
```json
{
  "openai": { "status": "healthy", "latency": 234 },
  "tavus": { "status": "healthy", "latency": 156 },
  "elevenlabs": { "status": "healthy", "latency": 89 }
}
```

---

## 🚨 Thresholds & Alerts

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| DB Response Time | > 500ms | > 1000ms | Alert Ops |
| API Error Rate | > 1% | > 5% | Alert Ops + Page On-Call |
| Failed Logins | > 10/min | > 50/min | Alert Security |
| Storage Usage | > 80% | > 95% | Alert Ops |
| Queue Backlog | > 100 jobs | > 500 jobs | Alert Ops |

---

## 🎨 UI Components (Bundui)

**To Copy:**
- `apps/dashboard/app/dashboard-bundui/analytics/components/stats-card.tsx` (for metric cards)
- `apps/dashboard/app/dashboard-bundui/analytics/components/chart.tsx` (for graphs)
- `apps/dashboard/app/dashboard-bundui/projects-v2/components/timeline.tsx` (for incident timeline)

---

## 📚 Related Documents

- `apps/admin/SECURITY.md` (Monitoring requirements)
- `apps/admin/UI_COMPONENT_STRATEGY.md` (UI inheritance rules)

---

**Status:** APPROVED  
**Owner:** Ops Team  
**Implementation Start:** After Tenant Detail (Phase 3) is complete  
**Target Completion:** Phase 1 by end of week
