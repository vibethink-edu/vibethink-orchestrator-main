---
complexity: 1
tokens_estimated: 400
dependencies: ["quick-context.md"]
last_updated: "2024-12-18"
relevant_for: ["all"]
load_priority: "always"
update_frequency: "when_decisions_made"
---

# Critical Decisions - AI Pair Orchestrator Pro

> **NOTA:** Cada vez que se tome o modifique una decisión crítica, debe registrarse la **fecha** y el **responsable**. Si la decisión surge de una excepción, violación o cambio de regla, enlazar al registro correspondiente.

## 🏗️ Architecture Decisions

### Multi-tenancy Security (CRITICAL)
**Decision**: Use Row Level Security (RLS) over application-level filtering  
**Rationale**: Database-enforced isolation prevents bugs from causing data leaks  
**Implementation**: ALL queries MUST include `company_id` filter  
**Never**: Access cross-company data except validated SUPPORT role  
**Fecha**: 2024-06-01  
**Responsable**: Equipo de arquitectura

> Ver también: [FAQ: Reimplementación vs Fork Postiz](../../docs/foundation/faqs/internal/001-reimplementacion-vs-fork-postiz.md)

### 6-Role Hierarchy
**Decision**: SUPER_ADMIN → SUPPORT → OWNER → ADMIN → MANAGER → EMPLOYEE  
**Critical**: SUPPORT role limited to VibeThink-platform company only  
**Security**: All SUPPORT actions logged in `support_actions_log` table  
**Enforcement**: RLS policies + application logic validation  
**Fecha**: 2024-06-01  
**Responsable**: Equipo de arquitectura

### Database Choice
**Decision**: Supabase (PostgreSQL + RLS + Auth + Edge Functions)  
**Rationale**: Built-in multi-tenancy, real-time, serverless functions  
**Project ID**: `pikywaoqlekupfynnclg`  
**Critical**: Never hardcode connection strings or API keys

## 🤖 AI Processing Decisions

### OpenAI Integration
**Decision**: Use Edge Functions for AI processing (not client-side)  
**Rationale**: API key security + cost control + rate limiting  
**Rate Limits**: Per-company monthly quotas (Basic: 100, Enterprise: 10K)  
**Cost Tracking**: Track usage per company for billing

### Meeting Processing Flow
**Decision**: Audio → Whisper (transcription) → GPT (structured minutes)  
**File Limits**: 25MB max, 2-hour duration recommended  
**Formats**: WAV, MP3, MP4, M4A, WebM  
**Output**: Transcription + structured JSON (title, summary, actions, decisions)

## 🔒 Security Decisions

### Authentication
**Decision**: Supabase Auth (no custom auth system)  
**JWT**: Standard Supabase JWT with company_id in metadata  
**Sessions**: Auto-refresh enabled, persistent sessions  
**MFA**: Available through Supabase (not custom implementation)

### API Key Management
**Decision**: ALL API keys in environment variables or Supabase Vault  
**NEVER**: Hardcode any secrets in source code  
**Rotation**: Quarterly for API keys, bi-annually for DB passwords  
**Development**: Separate keys for dev/staging/production

### SUPPORT Role Security (DECEMBER 2024)
**Decision**: Limited cross-company access with comprehensive audit  
**Restrictions**: Only VibeThink-platform company members  
**Permissions**: View usage, temporary limit increases (max 500), read configs  
**Audit**: Every action logged with timestamp, user, action, target_company  
**Rollback**: All SUPPORT changes must be reversible

## 🏢 Business Logic Decisions

### Plan Limits
**Decision**: Enforce limits at application AND database level  
**Implementation**: `company_limits` table + RLS policies + UI validation  
**Overrides**: OWNER can request, SUPPORT can approve temporarily  
**Billing**: Monthly cycles, usage resets on plan anniversary

### User Onboarding
**Decision**: Email-based invitations with role pre-assignment  
**Flow**: Admin invites → Email sent → User signs up → Auto-role assignment  
**Default Role**: EMPLOYEE (safest default)  
**Approval**: Required for ADMIN+ roles

## 🛠️ Development Decisions

### Tech Stack
**Decision**: React 18 + TypeScript + Vite + Tailwind + shadcn/ui  
**State Management**: React Query for server state, React hooks for local  
**Styling**: Tailwind CSS only (no custom CSS files)  
**Components**: shadcn/ui as base, custom components built on top

### Code Quality
**Decision**: TypeScript strict mode, ESLint + Prettier, no `any` types  
**Testing**: Vitest (unit) + Playwright (E2E) + k6 (performance)  
**Documentation**: JSDoc for complex functions, inline comments for why not what  
**Git**: Conventional commits, feature branches, PR reviews required

### File Structure
**Decision**: Feature-based organization with shared components  
**Path Mapping**: `@/` points to `src/`  
**Components**: UI components in `components/ui/`, features in `components/feature/`  
**Hooks**: Custom hooks in `hooks/`, prefixed with `use`

## 📊 Performance Decisions

### Bundle Optimization
**Decision**: Code splitting by route, lazy loading for admin features  
**Images**: Optimized assets, CDN for production  
**Caching**: React Query with 5-minute stale time for stable data  
**Database**: Optimized queries, proper indexing on company_id + frequently queried fields

### AI Processing Performance
**Decision**: Async processing with progress tracking  
**Timeouts**: 30 seconds for transcription, 60 seconds for AI processing  
**Retry Logic**: Exponential backoff for rate limits  
**Fallbacks**: Graceful degradation when AI services unavailable

## 🚀 Deployment Decisions

### Environment Strategy
**Decision**: Development → Staging → Production pipeline  
**Environments**: Separate Supabase projects for each environment  
**Variables**: Environment-specific .env files, never commit secrets  
**Database**: Migrations through Supabase CLI, never manual SQL in production

### Monitoring
**Decision**: Supabase built-in monitoring + custom health checks  
**Alerts**: Error rates, performance degradation, security events  
**Logs**: Structured logging, 90-day retention  
**Backup**: Daily automated backups, weekly restoration tests

## ⚠️ Anti-Patterns (NEVER DO)

### Security Anti-Patterns
- ❌ Query without company_id filter
- ❌ Hardcode API keys or secrets
- ❌ Allow cross-company data access without SUPPORT validation
- ❌ Skip RLS policy verification

### Development Anti-Patterns
- ❌ Use `any` type in TypeScript
- ❌ Direct database queries from client
- ❌ Large monolithic components (>150 lines)
- ❌ Console.log in production code

### Business Logic Anti-Patterns
- ❌ Allow unlimited AI usage without plan enforcement
- ❌ Grant admin permissions without explicit approval
- ❌ Process payments without proper validation
- ❌ Change user company without audit trail

## 🔄 Decision Evolution

### Tabla de Decisiones Pendientes
| Descripción | Fecha | Responsable | Prioridad | Enlace/Referencia |
|-------------|-------|-------------|-----------|------------------|
| Production deployment strategy finalization | 2024-12-18 | CTO | Alta |  |
| Advanced AI feature roadmap | 2024-12-18 | AI Lead | Media | [002-integracion-ai-gestion-claves.md](../../docs/foundation/faqs/internal/002-integracion-ai-gestion-claves.md) |
| Enterprise compliance requirements (SOC2, GDPR) | 2024-12-18 | Legal/Compliance | Alta |  |
| Scaling strategy for 10x user growth | 2024-12-18 | CTO | Alta |  |

### Historial de Cambios
| Fecha | Decisión Modificada | Motivo/Cambio | Responsable | Enlace/Justificación |
|-------|---------------------|---------------|-------------|----------------------|
| 2025-06-24 | Multi-tenancy Security | Refuerzo de protocolo y referencia cruzada a FAQ interno | Equipo de arquitectura | [001-reimplementacion-vs-fork-postiz.md](../../docs/foundation/faqs/internal/001-reimplementacion-vs-fork-postiz.md) |
| 2025-06-24 | AI Processing Decisions | Añadida referencia a FAQ de integración AI | AI Lead | [002-integracion-ai-gestion-claves.md](../../docs/foundation/faqs/internal/002-integracion-ai-gestion-claves.md) |

---

**🚨 Critical Reminder**: These decisions form the foundation of the system. Any changes require careful analysis of impact on security, performance, and user experience.

**📋 Update Protocol**: 
- Añade nuevas decisiones inmediatamente, con **fecha** y **responsable**.
- Si surge de una excepción/violación, enlaza al registro correspondiente.
- Revisa mensualmente para relevancia.
- Archiva decisiones obsoletas con contexto y justificación en el historial de cambios. 