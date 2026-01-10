# Technology Stack Decisions & Standards

This document records critical architectural and tooling decisions to ensuring consistency, quality, and agentic autonomy across the VibeThink platform.

## 1. Testing Strategy: "Tests as Code"
**Decision:** All automated testing must be implemented as code within the repository using **Vitest**.
**Status:** ADOPTED (2026-01-10)

### Rationale
- **Agent Autonomy:** AI Agents can read, write, and execute code-based tests autonomously to verify their own work. They cannot easily interact with external GUI tools (e.g., Postman UI).
- **GitOps:** Tests must evolve atomically with the feature code in the same Git Commit/PR.
- **Performance:** Vitest runs natively in Vite/Next.js environments, offering strictly superior performance to Jest.

### Standard Tooling
- **Test Runner:** `vitest`
- **Environment:** `node` (for APIs), `jsdom` (for React Components).
- **Mocking:** Native `vi.mock()` and `NextRequest` constructors.
- **Forbidden:** Relying on Postman Collections or External QA tools as the *primary* source of truth for CI/CD.

---

## 2. API Documentation: "OpenAPI & Scalar"
**Decision:** API Specifications must be defined in **OpenAPI 3.0+ (YAML)** and rendered via **Scalar**.
**Status:** ADOPTED (2026-01-10)

### Rationale
- **Developer Experience:** Scalar provides a modern, high-density reading experience superior to Swagger UI.
- **Git-Centric:** The `openapi.yaml` file in the repo is the single source of truth.
- **Integration:** Scalar integrates seamlessly via CDN with our Astro Starlight documentation portal.

### Standard Tooling
- **Spec Location:** `docs/api/v1/openapi.yaml`
- **Renderer:** `@scalar/api-reference`
- **Deployment:** GitHub Pages (via Starlight `ApiViewer.astro` component).

---

## 3. Package Management & Monorepo
**Decision:** Strict dependency management using **pnpm** and locked versions for critical core libraries.
**Status:** CONFIRMED (2026-01-10)

### Standards
- **TypeScript:** Pin exact version (e.g., `5.9.2`) to prevent compiler drift.
- **React:** Align `@types/react` strictly with the `react` dependency version (e.g., v19).
- **CI/CD:** Use `--no-frozen-lockfile` in CI if cross-platform lockfile issues arise, prioritizing build continuity over strict determinism in non-critical docs pipelines.
