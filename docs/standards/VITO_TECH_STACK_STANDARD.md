# ViTo Technical Stack Standard (VTSS-1.0)

**Status**: SEALED  
**Authority**: Engineering Rector Pack v1  
**Last Updated**: 2026-01-09  
**Scope**: Definitive list of approved technologies, libraries, and architectural patterns for the ViTo Platform.

---

## 1. Purpose
To bridge the gap between high-level governance prohibitions (VGB-1) and actual implementation details. This document acts as the **Allowlist** of engineering standards.

---

## 2. Core Implementation Patterns

### 2.1. Persistence Layer
*   **Database**: PostgreSQL via **Supabase**.
*   **ORM/Querying** (Tiered Strategy):
    *   **Simple Queries**: `QueryBuilder` (Internal Lightweight Utility) or `supabase-js` direct client.
    *   **Complex Queries** (joins, aggregations): **Drizzle ORM** (preferred for type-safety, zero runtime overhead).
    *   **Under Review**: Prisma (concerns: binary size, RLS compatibility). TypeORM (deprecated, low maintenance).
    *   **Migrations**: Supabase SQL migrations are the source of truth. ORM schemas are derived, not authoritative.
*   **Validation**: All external data inputs MUST pass through runtime Type Guards or Zod schemas before persistence.

### 2.2. Asynchronous Processing (Queues)
*   **Engine**: **BullMQ** (Redis-backed).
*   **Rationale**: TypeScript native, utilizes existing Redis infrastructure, robust retry/backoff mechanisms tailored for AI/OCR latencies.
*   **Concurrency**: Controlled via `DOCINT_WORKER_CONCURRENCY` env var. Do not hardcode worker limits.

### 2.3. AI & Vector Operations
*   **Embeddings Store**: **pgvector** on PostgreSQL.
*   **Indexing strategy**: HNSW (Hierarchical Navigable Small World) for production.
*   **Chunking**: Metadata transparency is mandatory (Source ID + Strategy Version).

---

## 3.4. Polyglot Strategy (TypeScript + Python)

### When to Use TypeScript (Node.js)
*   **API Gateway & Orchestration**: All HTTP endpoints, routing, authentication.
*   **CRUD Operations**: Database queries, business logic, multi-tenant isolation.
*   **Real-time Communication**: WebSockets, Server-Sent Events, LiveKit client integration.
*   **Frontend**: React/Next.js (universal).
*   **Job Orchestration**: BullMQ queue management, job scheduling.

### When to Use Python
*   **Multi-Agent AI**: Agno framework for autonomous agents, reasoning, collaboration.
*   **ML/AI Heavy Processing**: Custom model training, fine-tuning, local inference.
*   **Simulation & Digital Twins**: SimPy, Mesa for enterprise behavior modeling.
*   **Data Science**: NumPy, Pandas, SciPy for complex analytics.
*   **Voice Processing**: Integration with Cartesia/ElevenLabs for voice cloning.

### Integration Pattern
*   **Architecture**: Microservices communicating via HTTP/gRPC (not monolith).
*   **Job Queues**: TypeScript enqueues jobs → Python workers process → Results back to TypeScript.
*   **Data Exchange**: JSON over HTTP, Protocol Buffers for high-throughput.
*   **Deployment**: Separate containers (Docker), independent scaling.

### Python Stack (Approved)
*   **AI Framework**: **Agno** (multi-agent, reasoning, collaboration).
*   **Validation**: **Pydantic** (equivalent to Zod in TypeScript).
*   **Structured Outputs**: **Pydantic AI** (LLM response parsing).
*   **Simulation**: **SimPy** or **Mesa** (for Digital Twin use cases).
*   **API Framework**: **FastAPI** (async, OpenAPI auto-generation).

---

## 3.5. Voice & Real-time Media

### Voice Cloning & Synthesis
*   **Primary**: **Cartesia** (preferred for low-latency, high-quality cloning).
*   **Alternative**: **ElevenLabs** (fallback, broader voice library).
*   **Rationale**: Both offer REST APIs, no vendor lock-in.

### Real-time Communication (Under Evaluation)
*   **LiveKit**: WebRTC infrastructure for voice/video (preferred for self-hosted control).
*   **Retell**: Conversational AI phone calls (alternative, managed service).
*   **Decision Pending**: Evaluate based on latency, cost, and control requirements.
*   **Integration**: TypeScript client SDK, Python backend for AI processing.

---

---

## 3. Approved Libraries (Third-Party)

### 3.1. Critical Infrastructure
| Capability | Standard Library | Reason |
| :--- | :--- | :--- |
| **Auth** | `@supabase/auth-helpers-nextjs` | Supabase native integration. |
| **Validations** | `zod` | TypeScript-first schema validation. |
| **Date Handling** | `date-fns` | Lightweight, modular, tree-shakeable. |
| **State Mgmt** | `zustand` (Frontend) | Minimalist, hook-based. |

### 3.2. Utility & Helpers
*   **Class Names**: `clsx` + `tailwind-merge` (Standard for UI components).
*   **UUID**: Native `crypto.randomUUID()` in Node, `uuid` package only if polyfill needed.

---

## 4. Architectural Patterns

### 4.1. Runtime Safety (Rule enforced by CodeRabbit)
Type assertions (`as unknown as Type`) are **PROHIBITED** unless deeply justified and scoped.
*   **Correct Pattern**: Implement a User-Defined Type Guard function.
    ```typescript
    function isTask(obj: unknown): obj is Task { ... }
    if (!isTask(input)) throw new Error("Invalid Task");
    ```

### 4.2. Service Isolation
Services (like `ReviewService`) must depend on **Interfaces** (`IReviewPersistenceAdapter`), never on concrete implementations, to allow for testing and provider swapping.

---

## 5. Deprecated / Banned (Explicit)
*   **Moment.js**: Use `date-fns`.
*   **Lodash (Full import)**: Use native ES6+ or individual imports.
*   **Axios**: Use native `fetch` API (Node 18+ standard).

---

## 6. Testing Standards

### 6.1. Test Framework
*   **Unit/Integration**: **Vitest** (TypeScript native, ESM compatible).
*   **E2E**: **Playwright** (multi-browser, stable).
*   **Coverage**: Minimum 70% for critical paths (services, adapters).

### 6.2. Mock Strategy
*   **Prohibited**: `as any`, `as unknown as`, `@ts-ignore` in test files.
*   **Standard**: Strictly typed mocks using `vi.fn<Type>()` or dedicated mock factories.
*   **Example**:
    ```typescript
    // ✅ CORRECT
    const mockAdapter: IReviewPersistenceAdapter = {
      getReviewById: vi.fn<(id: string) => Promise<Review | null>>(),
      createReview: vi.fn<(data: CreateReviewInput) => Promise<Review>>(),
      // ... all methods
    };
    
    // ❌ WRONG
    const mockAdapter = { getReviewById: vi.fn() } as any;
    ```

### 6.3. Test Data
*   **Fixtures**: Store in `tests/fixtures/canonical/` (deterministic, version-controlled).
*   **Generators**: Use `tests/fixtures/generators/` for dynamic test data with seeded randomness.
*   **PII**: NEVER use real user data in tests. Use synthetic data generators.

---

## 7. Observability & Monitoring

### 7.1. Logging
*   **Standard**: Structured JSON logs via `pino` (high-performance, Node.js optimized).
*   **Correlation**: All logs MUST include `correlationId` from `ExecutionContext`.
*   **Levels**: `trace`, `debug`, `info`, `warn`, `error`, `fatal` (standard Pino levels).

### 7.2. Metrics
*   **Queue Metrics**: BullMQ built-in metrics (job counts, latencies, failures).
*   **Database**: Supabase dashboard + custom RPC for usage tracking.
*   **Custom**: Use `prom-client` for Prometheus-compatible metrics export.

### 7.3. Error Tracking
*   **Standard**: Branded `AppError` class (defined in `src/core/observability/errors.ts`).
*   **Context**: All errors MUST carry `correlationId` and `tenantId` for multi-tenant tracing.

---

## 8. Security & Compliance

### 8.1. Secrets Management
*   **Prohibited**: Hardcoded secrets, `.env` files in version control.
*   **Standard**: Environment variables via secure vaults (Supabase Secrets, AWS Secrets Manager).
*   **Rotation**: API keys MUST support rotation without downtime.

### 8.2. Multi-Tenant Isolation
*   **Database**: Row-Level Security (RLS) policies MANDATORY for all tenant-scoped tables.
*   **API**: `tenant_id` validation at API gateway level (before business logic).
*   **Queues**: Job payloads MUST include `tenantId` for audit trails.

---

## 9. Performance Constraints

### 9.1. Bundle Size (Frontend)
*   **Target**: < 200KB initial JS bundle (gzipped).
*   **Enforcement**: Webpack Bundle Analyzer in CI, fail on regression > 10%.

### 9.2. API Response Times
*   **P95 Latency**: < 500ms for read operations, < 2s for write operations.
*   **OCR Processing**: Async via BullMQ (no synchronous OCR in HTTP handlers).

### 9.3. Database Queries
*   **N+1 Prevention**: Use `.select()` with joins, avoid loops with individual queries.
*   **Indexing**: All FK columns MUST have indexes. Composite indexes for multi-tenant queries.

---

## 10. Enforcement & Compliance

### 10.1. CI/CD Gates
This standard is enforced via:
1.  **Type Check**: `pnpm type-check` (must pass).
2.  **Linting**: ESLint rules aligned with this standard.
3.  **Tests**: `pnpm test` (minimum coverage thresholds).
4.  **Governance**: `scripts/validate-governance.sh` (VGB-1 compliance).

### 10.2. Code Review Checklist
Before approving PRs, verify:
- [ ] No banned libraries introduced.
- [ ] Type Guards used for external data.
- [ ] Multi-tenant isolation enforced.
- [ ] Tests include strictly typed mocks.
- [ ] No hardcoded secrets or PII.

### 10.3. Exceptions Process
Deviations from this standard require:
1.  **Justification**: Technical rationale documented in ADR (Architecture Decision Record).
2.  **Approval**: CTO or designated Tech Lead.
3.  **Sunset Plan**: Timeline for migration back to standard (if temporary).

---

## 11. Version History

| Version | Date | Changes |
| :--- | :--- | :--- |
| 1.0 | 2026-01-09 | Initial release. Formalized Supabase, BullMQ, Type Guards, pgvector. Drizzle ORM preferred (under review). Polyglot strategy (TypeScript + Python/Agno). Voice infrastructure (Cartesia/ElevenLabs, LiveKit/Retell under evaluation). |

---

## 12. References

*   **VGB-1**: `docs/governance/vito-governance-baseline-v1.md` (High-level prohibitions)
*   **DB Rules**: `docs/data/DB_NAMING_AND_RULES.md` (Persistence naming)
*   **Core Architecture**: `docs/arch/CORE_VITO_ARCHITECTURE.md` (Structural canon)
*   **Agno Evaluation**: `docs/projects/VibeThink-Orchestrator/evaluations/completadas/AGNO_EVALUATION_SUMMARY.md`

### Pending Use Case Documentation
*   **Digital Twin**: FIT pending for enterprise simulation and optimization.
*   **Voice AI**: FIT pending for Cartesia/ElevenLabs integration and LiveKit/Retell evaluation.

---

**Approved by**: Engineering Team  
**Status**: SEALED (Enforceable Standard)  
**Next Review**: 2026-Q2
