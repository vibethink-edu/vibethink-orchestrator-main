# FAQ for Developers: Design Patterns and Architecture in AI Pair Orchestrator Pro

## 1. What design patterns should I use for shared logic between companies (tenants)?

**Use:** Tenant Context + Custom Hooks + Parametric Configuration.

- **Reference:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Example:**
  - `useTenant()` to get company context.
  - `useParametricConfiguration()` for logic adaptable by country/industry.

---

## 2. How do I extend workflow logic without modifying the core?

**Use:** Plugin System + Universal Workflow Engine.

- **Reference:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md), [WORKFLOW_ARCHITECTURE_PATTERNS.md](./WORKFLOW_ARCHITECTURE_PATTERNS.md)
- **Example:**
  - Register a new plugin in the `PluginRegistry`.
  - Implement `beforeStep` and `afterStep` hooks for specific logic.

---

## 3. How do I integrate AI safely and scalably?

**Use:** AI Service Facade + Fallback + Tenant limits.

- **Reference:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Example:**
  - Use `AIServiceFacade` to process AI requests.
  - Control limits and fallback between providers.

---

## 4. What pattern to use for components that change based on client configuration?

**Use:** Adaptive Components + Configurable.

- **Reference:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Example:**
  - `AdaptiveComponent` to show/hide UI based on permissions/features.
  - `ConfigurableWorkflowStep` to render dynamic steps.

---

## 5. How do I ensure data and logic isolation between companies?

**Use:** Tenant Context + RLS in database + Permission validation in hooks and services.

- **Reference:** [PATTERNS_SYNTHESIS.md](./PATTERNS_SYNTHESIS.md), [ADR-004-Universal-Workflow-Engine.md](./ADR-004-Universal-Workflow-Engine.md)
- **Example:**
  - Always filter by `company_id` in queries.
  - Use `hasPermission` before executing sensitive actions.

---

## 6. When to use micro-frontends and atomic design?

**Use:** Micro-frontends for independent teams, Atomic Design for reusable and scalable UI.

- **Reference:** [PATTERNS_COMPARISON_ANALYSIS.md](./PATTERNS_COMPARISON_ANALYSIS.md)
- **Example:**
  - Divide large features (CRM, PQRS, Ecommerce) into micro-frontends.
  - Use atoms, molecules, and organisms to build UI.

---

## 7. How do I handle errors and contextualized logging?

**Use:** AI Pair Error Boundary + Logging with tenant context.

- **Reference:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Example:**
  - Wrap feature components with `VibeThinkErrorBoundary`.
  - Log errors with company and user information.

---

## 8. How do I decide which pattern to apply in a new module?

**Use:** Pattern Decision Matrix.

- **Reference:** [PATTERNS_SYNTHESIS.md](./PATTERNS_SYNTHESIS.md)
- **Example:**
  - Consult the scenarios vs patterns table.
  - Prioritize patterns that allow adaptation, isolation, and extensibility.

---

## 9. Why can't I use hardcoded values in the code?

**Use:** Hardcoding Prevention System.

- **Reference:** [HARDCODING_PREVENTION_SYSTEM.md](./HARDCODING_PREVENTION_SYSTEM.md)
- **Example:**
  - ❌ `const colombia = "CO";` → ✅ `const currentCountry = getCountryCode();`
  - ❌ `const API_KEY = "sk-123...";` → ✅ `const API_KEY = process.env.REACT_APP_API_KEY;`

**Why?** Hardcoded values limit the platform's universality. AI Pair must work for any country, industry, or domain without code changes.

---

## 10. What do I do if I detect a hardcoding violation?

**Follow the correction process:**

1. **Identify** the violation type (critical, high, medium, low)
2. **Apply** the correction according to the recommended pattern
3. **Validate** that there are no regressions
4. **Document** the changes made

- **Critical:** Block commit - Fix immediately
- **High:** Alert - Fix in this iteration
- **Medium:** Warning - Consider correction
- **Low:** Suggestion - Future improvement

---

## 11. How do I handle specific configurations without hardcoding?

**Use:** Parametric Configuration + Environment Variables.

- **Reference:** [HARDCODING_PREVENTION_SYSTEM.md](./HARDCODING_PREVENTION_SYSTEM.md)
- **Example:**
  ```typescript
  // ❌ BAD
  const dbConfig = { host: "localhost", port: 5432 };
  
  // ✅ GOOD
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432
  };
  ```

---

## 12. What if I need a specific value temporarily?

**Document and create refactoring ticket:**

1. **Justify** why it's necessary temporarily
2. **Create ticket** for refactoring in future versions
3. **Document** the limitation in the code
4. **Plan** migration to parametric configuration

---

## 13. Where do I find examples and best practices?

- **Key documents:**
  - [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
  - [PATTERNS_COMPARISON_ANALYSIS.md](./PATTERNS_COMPARISON_ANALYSIS.md)
  - [PATTERNS_SYNTHESIS.md](./PATTERNS_SYNTHESIS.md)
  - [WORKFLOW_ARCHITECTURE_PATTERNS.md](./WORKFLOW_ARCHITECTURE_PATTERNS.md)
  - [ADR-004-Universal-Workflow-Engine.md](./ADR-004-Universal-Workflow-Engine.md)
  - [HARDCODING_PREVENTION_SYSTEM.md](./HARDCODING_PREVENTION_SYSTEM.md)

---

## 14. How do I contribute or propose new patterns?

- Follow the documentation process in `docs/architecture/`.
- Propose an ADR if the pattern affects global architecture.
- Add examples and business justification.
- Request review from the architecture team.

---

## 15. What metrics do we use to evaluate pattern success?

- Component and hooks reuse
- Automatic tenant adaptation
- Plugin usage vs hardcoded logic
- AI fallback rate
- Bug reduction by tenant isolation
- **NEW:** Reduction in hardcoding violations

---

## 16. Who do I consult if I have questions?

- Review the linked documentation first.
- Consult the architecture team or open an issue in the repository.
- Participate in pattern review sessions.
- **For critical violations:** Contact Marcelo (Architect) immediately.

---

## 17. How does the automatic hardcoding detection system work?

**The system automatically detects:**

- **Hardcoded credentials** (CRITICAL - blocks commit)
- **Hardcoded URLs and endpoints** (HIGH - immediate alert)
- **Specific entities** (MEDIUM - warning)
- **Hardcoded configurations** (MEDIUM - warning)

**Tools:**
- Custom ESLint plugin
- Pre-commit hooks
- CI/CD pipeline checks
- Automatic notifications to architect

---

## 18. What do I do if the system blocks my commit due to hardcoding?

1. **Read** the detailed error message
2. **Identify** the hardcoded value
3. **Apply** the suggested correction
4. **Validate** that functionality still works
5. **Try** the commit again

**Remember:** Critical violations block the commit to protect platform security and universality.

---

## 19. How do I handle third-party dependencies that have hardcoding?

**Dependency monitoring system:**

1. **Detects** changes in dependencies
2. **Scans** for hardcoding violations
3. **Notifies** architect if problems found
4. **Blocks** update if necessary
5. **Creates** sanitization ticket

---

## 20. What are the best practices to avoid hardcoding?

1. **Always use environment variables** for configurations
2. **Parameterize by country/industry** using dynamic configuration
3. **Use generic names** instead of specific ones
4. **Implement plugin system** for special cases
5. **Document** any temporary exceptions
6. **Review** code regularly with detection tools

---

**Remember:** Universality and parameterization are fundamental to AI Pair Orchestrator Pro's success. 