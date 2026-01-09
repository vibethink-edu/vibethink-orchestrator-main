# ViTo Value Preservation Framework (VPF)

**Status**: SEALED (Enforceable · Canonical)  
**Version**: 1.0  
**Sealed Date**: 2026-01-09  
**Authority**: Chief Architect + Project Governance Lead  
**Scope**: Transversal (All FITs, Phases, Verticals)

---

## 🎯 Purpose

This framework defines the **canonical, lightweight, and reusable** standard for:

1. **Preserving value** generated during FIT or phase execution
2. **Justifying decisions**, effort, and leadership
3. **Guaranteeing executive and technical traceability**
4. **Defending work** before audits, stakeholders, project management, and future teams

**This framework does NOT**:
- Create features
- Modify architecture
- Redefine existing FITs
- Introduce heavy bureaucracy

---

## 🔒 Sealed Context

- **ViTo Core Architecture**: SEALED (not modified by this framework)
- **FIT Lifecycle**: SEALED (extended with governance rules only)
- **Ontology & Canon**: SEALED (this framework is governance, not domain)

---

## 📦 Framework Components

This framework consists of **6 canonical components**:

| Component | Acronym | Purpose | Audience |
|-----------|---------|---------|----------|
| **Project Decision Record** | PDR | Capture critical decisions | Technical + Executive |
| **Phase Closure Report** | PCR | Formalize phase completion | Executive + Audit |
| **Effort & Value Trace** | EVT | Justify effort without timesheets | Leadership + Audit |
| **FIT Lifecycle Update Rules** | FLUR | Define state transition criteria | Technical + Governance |
| **Canonical Archival Structure** | CAS | Standardize artifact storage | All |
| **Phase Closure Checklist** | PCC | Operationalize closure | Technical |

---

## 1️⃣ Project Decision Record (PDR)

### Purpose
Capture **critical architectural, technical, or process decisions** that impact:
- FIT scope or implementation
- Technical debt
- Risk mitigation
- Resource allocation
- Timeline or dependencies

### Structure (Minimal)

```markdown
# PDR-[FIT-ID]-[SEQUENCE]

**Date**: YYYY-MM-DD  
**Author**: [Name/Role]  
**FIT**: [FIT-ID]  
**Phase**: [Phase Number or N/A]  
**Status**: [Proposed | Accepted | Rejected | Superseded]

## Context
[What situation requires a decision?]

## Decision
[What was decided?]

## Rationale
[Why was this the best option?]

## Consequences
- **Positive**: [Benefits]
- **Negative**: [Tradeoffs, debt, risks]

## Alternatives Considered
[What other options were evaluated and why rejected?]

## Evidence
- Code: [Links to commits, PRs, files]
- Docs: [Links to specs, FITs, canon]
- External: [Links to research, vendor docs, etc.]
```

### When to Create
- **MUST** create when:
  - Changing FIT scope or acceptance criteria
  - Introducing technical debt
  - Selecting between 2+ viable alternatives
  - Deviating from canon or sealed standards
  - Making irreversible infrastructure decisions

- **MAY** create when:
  - Documenting complex implementation choices
  - Capturing lessons learned for future FITs

### Where to Archive
- **Path**: `docs/governance/decisions/[FIT-ID]/PDR-[FIT-ID]-[SEQUENCE].md`
- **Naming**: `PDR-FIT-DOCUMENT-INTELLIGENCE-001-001.md` (FIT-ID + sequence)
- **Index**: Update `docs/governance/decisions/INDEX.md`

### Relationship to FIT
- PDRs are **referenced** in FIT documents (not embedded)
- FITs define **what** to build; PDRs explain **why** and **how** decisions were made
- Multiple PDRs can support a single FIT or phase

---

## 2️⃣ Phase Closure Report (PCR)

### Purpose
Formalize the **completion of a FIT phase** with:
- Executive summary of achievements
- Technical deliverables
- Effort justification
- Risk and debt disclosure
- Readiness for next phase or production

### Structure (Minimal)

```markdown
# Phase Closure Report: [FIT-ID] — Phase [N]

**FIT**: [FIT-ID]  
**Phase**: [Phase Number]  
**Closure Date**: YYYY-MM-DD  
**Author**: [Name/Role]  
**Status**: [Draft | Approved | Sealed]

---

## Executive Summary
[2-3 sentences: What was delivered, why it matters, what's next]

---

## Deliverables

### Functional
- [Feature/capability delivered]
- [Feature/capability delivered]

### Technical
- [Modules, APIs, schemas, tests]
- [Infrastructure, CI/CD, observability]

### Documentation
- [Specs, ADRs, runbooks, diagrams]

---

## Effort & Value Trace (EVT)

| Dimension | Metric | Evidence |
|-----------|--------|----------|
| **Code** | [LOC, files, modules] | [Commit SHAs, PR links] |
| **Tests** | [Coverage %, test count] | [CI reports, test files] |
| **Decisions** | [PDR count] | [PDR links] |
| **Risk Mitigated** | [Security, compliance, tech debt] | [Audit reports, fixes] |
| **Value Delivered** | [Business capability, user impact] | [FIT acceptance criteria] |

---

## Quality Gates

| Gate | Status | Evidence |
|------|--------|----------|
| All tests pass | ✅ / ❌ | [CI run link] |
| No critical lints | ✅ / ❌ | [Lint report] |
| Security scan clean | ✅ / ❌ | [CodeQL, Snyk report] |
| Peer review approved | ✅ / ❌ | [PR approval links] |
| Documentation complete | ✅ / ❌ | [Doc checklist] |

---

## Known Issues & Debt

| Issue | Severity | Mitigation | Tracked In |
|-------|----------|------------|------------|
| [Description] | [High/Med/Low] | [Plan or N/A] | [Issue/WIT link] |

---

## Risks & Dependencies

| Risk/Dependency | Impact | Status | Owner |
|-----------------|--------|--------|-------|
| [Description] | [High/Med/Low] | [Open/Mitigated] | [Name] |

---

## Recommendations for Next Phase
[What should happen next? What should be prioritized?]

---

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical Lead | [Name] | YYYY-MM-DD | [Initials/Link] |
| Product Owner | [Name] | YYYY-MM-DD | [Initials/Link] |
| Architect | [Name] | YYYY-MM-DD | [Initials/Link] |
```

### Difference: PCR vs FIT
| Aspect | FIT | PCR |
|--------|-----|-----|
| **Purpose** | Define **what** to build | Prove **what was built** |
| **Timing** | Created **before** work starts | Created **after** phase completes |
| **Audience** | Technical team | Executive + Audit + Stakeholders |
| **Content** | Requirements, scope, acceptance | Deliverables, effort, quality, risks |
| **Lifecycle** | Living document (evolves) | Snapshot (immutable after approval) |

### Audience

| Audience | What They Need |
|----------|----------------|
| **Executive** | Summary, value, risks, next steps |
| **Technical** | Deliverables, quality gates, debt |
| **Audit** | Evidence, traceability, compliance |
| **Future Teams** | Context, decisions, lessons learned |

### When to Create
- **MUST** create when:
  - Completing a FIT phase (Phase 0, 1, 2, etc.)
  - Requesting approval to merge to `main`
  - Closing a FIT entirely
  - Requesting budget/resources for next phase

### Where to Archive
- **Path**: `docs/governance/closures/[FIT-ID]/PCR-[FIT-ID]-Phase-[N].md`
- **Naming**: `PCR-FIT-DOCUMENT-INTELLIGENCE-001-Phase-2.md`
- **Index**: Update `docs/governance/closures/INDEX.md`

---

## 3️⃣ Effort & Value Trace (EVT)

### Purpose
Justify **effort invested** and **value delivered** without rigid timesheets, by linking:
- Code changes (LOC, commits, PRs)
- Decisions (PDRs)
- Risk mitigation (security, compliance, debt)
- Business value (capabilities, user impact)

### Structure (Embedded in PCR)

EVT is **not a standalone document**; it is a **mandatory section** in every PCR.

### Metrics

| Dimension | How to Measure | Evidence |
|-----------|----------------|----------|
| **Code** | Lines of code (LOC), files changed, modules created | `git diff --stat`, commit SHAs, PR links |
| **Tests** | Test coverage %, number of tests, test types (unit/integration/contract) | CI reports, `coverage/` output, test file count |
| **Decisions** | Number of PDRs created, complexity of decisions | PDR links, decision log |
| **Risk Mitigated** | Security vulnerabilities fixed, compliance gaps closed, tech debt reduced | CodeQL reports, audit findings, debt tracker |
| **Value Delivered** | Business capabilities enabled, user stories completed, acceptance criteria met | FIT acceptance criteria, stakeholder feedback |

### How to Justify Effort Without Timesheets

1. **Code Contribution**:
   ```bash
   git log --author="[Name]" --since="[Phase Start Date]" --until="[Phase End Date]" --numstat --pretty=format:"%H %s"
   ```
   - Extract: commits, LOC added/removed, files touched

2. **Decision Complexity**:
   - Count PDRs created
   - Assess complexity (simple/moderate/complex)
   - Link to architectural impact

3. **Risk Reduction**:
   - Before/after metrics (e.g., security scan results)
   - Compliance checklist completion
   - Debt items closed

4. **Value Linkage**:
   - Map deliverables to FIT acceptance criteria
   - Quantify user impact (if measurable)
   - Stakeholder validation (approvals, feedback)

### Relationship to PCR and PDR
- **EVT** is embedded in **PCR** (proves effort)
- **PDR** is referenced in **EVT** (proves decision complexity)
- **FIT** defines acceptance criteria that **EVT** validates

---

## 4️⃣ FIT Lifecycle Update Rules (FLUR)

### Purpose
Define **what evidence** enables a FIT state transition and **what does NOT**.

### FIT States (From Existing Lifecycle)
1. **Draft**: Initial definition
2. **Approved**: Ready to implement
3. **In Progress**: Active development
4. **Phase [N] Complete**: Phase milestone reached
5. **Delivered**: All phases complete, merged to `main`
6. **Deprecated**: No longer active

### State Transition Rules

| From | To | Required Evidence | Blocking Conditions |
|------|----|--------------------|---------------------|
| **Draft** | **Approved** | - FIT document complete<br>- Acceptance criteria defined<br>- Resource allocation confirmed | - Missing acceptance criteria<br>- Unresolved dependencies |
| **Approved** | **In Progress** | - First commit referencing FIT-ID<br>- Branch created | - No assigned owner<br>- Blocked dependencies |
| **In Progress** | **Phase [N] Complete** | - **PCR approved**<br>- All quality gates ✅<br>- Peer review approved | - Failing tests<br>- Critical lints<br>- Security vulnerabilities<br>- Missing PCR |
| **Phase [N] Complete** | **In Progress** (next phase) | - PCR for Phase N sealed<br>- Approval for Phase N+1 | - Phase N not closed<br>- Budget/resource gap |
| **Phase [N] Complete** | **Delivered** | - All phases complete<br>- Final PCR approved<br>- Merged to `main` | - Open phases<br>- Unresolved debt (if blocking) |
| **Delivered** | **Deprecated** | - Replacement FIT delivered<br>- Migration complete | - Active dependencies<br>- No migration plan |

### What Does NOT Allow State Change
- ❌ Verbal approval (must be documented)
- ❌ Incomplete PCR
- ❌ Failing CI/CD
- ❌ Unreviewed code
- ❌ Missing documentation
- ❌ Undisclosed critical debt

### Supporting Documents
- **PCR**: Required for phase completion
- **PDR**: Required for scope changes or major decisions
- **EVT**: Embedded in PCR, proves effort

---

## 5️⃣ Canonical Archival Structure (CAS)

### Purpose
Standardize **where** and **how** governance artifacts are stored to ensure:
- Discoverability
- Consistency
- Single source of truth

### Directory Structure

```
docs/
└── governance/
    ├── README.md                          # Index of all governance artifacts
    ├── VALUE_PRESERVATION_FRAMEWORK.md    # This document
    ├── decisions/                         # All PDRs
    │   ├── INDEX.md                       # PDR registry
    │   └── [FIT-ID]/
    │       ├── PDR-[FIT-ID]-001.md
    │       ├── PDR-[FIT-ID]-002.md
    │       └── ...
    ├── closures/                          # All PCRs
    │   ├── INDEX.md                       # PCR registry
    │   └── [FIT-ID]/
    │       ├── PCR-[FIT-ID]-Phase-0.md
    │       ├── PCR-[FIT-ID]-Phase-1.md
    │       ├── PCR-[FIT-ID]-Phase-2.md
    │       └── ...
    └── checklists/                        # Reusable checklists
        └── PHASE_CLOSURE_CHECKLIST.md
```

### Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| **PDR** | `PDR-[FIT-ID]-[SEQUENCE].md` | `PDR-FIT-DOCUMENT-INTELLIGENCE-001-001.md` |
| **PCR** | `PCR-[FIT-ID]-Phase-[N].md` | `PCR-FIT-DOCUMENT-INTELLIGENCE-001-Phase-2.md` |
| **Index** | `INDEX.md` | `decisions/INDEX.md` |
| **Checklist** | `[NAME]_CHECKLIST.md` | `PHASE_CLOSURE_CHECKLIST.md` |

### Relationship Between Documents

```
FIT-DOCUMENT-INTELLIGENCE-001.md (in docs/fits/)
    ↓ references
PDR-FIT-DOCUMENT-INTELLIGENCE-001-001.md (decisions made)
PDR-FIT-DOCUMENT-INTELLIGENCE-001-002.md
    ↓ supports
PCR-FIT-DOCUMENT-INTELLIGENCE-001-Phase-2.md (phase closure)
    ↓ contains
EVT (effort & value trace)
    ↓ references
PDRs, commits, tests, quality gates
```

### Source of Truth Rule

| Artifact Type | Source of Truth | Derived/Reference |
|---------------|-----------------|-------------------|
| **FIT** | `docs/fits/[FIT-ID].md` | Referenced in PCR, PDR |
| **PDR** | `docs/governance/decisions/[FIT-ID]/` | Referenced in PCR, FIT |
| **PCR** | `docs/governance/closures/[FIT-ID]/` | References FIT, PDRs |
| **Code** | `src/`, `tests/` | Referenced in EVT |
| **Quality Gates** | CI/CD reports | Referenced in PCR |

**Rule**: Never duplicate content. Always **reference** the source of truth.

---

## 6️⃣ Phase Closure Checklist (PCC)

### Purpose
Provide a **concrete, reusable, executable checklist** for closing any FIT phase without unnecessary bureaucracy.

### Checklist

```markdown
# Phase Closure Checklist: [FIT-ID] — Phase [N]

**FIT**: [FIT-ID]  
**Phase**: [Phase Number]  
**Owner**: [Name]  
**Target Closure Date**: YYYY-MM-DD

---

## 🔍 Pre-Closure Validation

- [ ] All acceptance criteria for this phase are met
- [ ] All planned features/capabilities are implemented
- [ ] All tests pass (unit, integration, contract, API)
- [ ] No critical or high-severity lints
- [ ] Security scan clean (CodeQL, Snyk, etc.)
- [ ] Code coverage meets minimum threshold (define: ___%)
- [ ] All code reviewed and approved
- [ ] All commits reference FIT-ID in messages

---

## 📄 Documentation

- [ ] All modules have docstrings (public APIs)
- [ ] README updated (if applicable)
- [ ] FIT document updated with phase status
- [ ] All PDRs created for major decisions
- [ ] PCR drafted and complete
- [ ] EVT section in PCR populated with evidence

---

## 🧪 Quality Gates

- [ ] CI/CD pipeline green
- [ ] No failing tests
- [ ] No critical lints
- [ ] Security vulnerabilities addressed or documented
- [ ] Performance benchmarks met (if applicable)
- [ ] Accessibility compliance verified (if UI)

---

## 🚨 Risk & Debt Disclosure

- [ ] All known issues documented in PCR
- [ ] Technical debt items created (if any)
- [ ] Risks assessed and mitigation plans defined
- [ ] Dependencies validated and documented

---

## 🔗 Traceability

- [ ] All commits linked to FIT-ID
- [ ] All PRs reference FIT-ID
- [ ] All PDRs indexed in `decisions/INDEX.md`
- [ ] PCR indexed in `closures/INDEX.md`
- [ ] FIT state updated in `docs/fits/FIT_INDEX.md`

---

## ✅ Approvals

- [ ] Technical Lead approval
- [ ] Product Owner approval (if applicable)
- [ ] Architect approval
- [ ] Security approval (if required)

---

## 🚀 Next Steps

- [ ] Merge to `main` (if final phase)
- [ ] Plan next phase (if applicable)
- [ ] Communicate closure to stakeholders
- [ ] Archive artifacts per CAS

---

## 🔒 Closure

- [ ] PCR status set to **Approved**
- [ ] FIT state updated to **Phase [N] Complete**
- [ ] All artifacts committed and pushed
- [ ] Closure communicated to team

**Closed By**: [Name]  
**Closure Date**: YYYY-MM-DD
```

### When to Use
- **MUST** use for every phase closure
- **MAY** adapt for specific FIT needs (add items, not remove)

### Where to Store
- **Template**: `docs/governance/checklists/PHASE_CLOSURE_CHECKLIST.md`
- **Instance**: Embed in PCR or create as separate file in `docs/governance/closures/[FIT-ID]/`

---

## 🧪 Application to Document Intelligence Phase 2

This framework will now be applied retroactively to **Document Intelligence — Phase 2** to demonstrate its use.

See:
- `docs/governance/closures/FIT-DOCUMENT-INTELLIGENCE-001/PCR-FIT-DOCUMENT-INTELLIGENCE-001-Phase-2.md`
- `docs/governance/decisions/FIT-DOCUMENT-INTELLIGENCE-001/` (if PDRs are created)

---

## 🛡️ Survival Criteria

This framework must survive:
- ✅ **12 months**: Still usable without updates
- ✅ **Team change**: New team can execute without training
- ✅ **External audit**: Provides complete traceability
- ✅ **Hostile executive review**: Justifies all effort and decisions

---

## 🔒 Enforcement

- **MUST** create PCR for every phase closure
- **MUST** create PDR for scope changes or major decisions
- **MUST** update FIT state only with approved PCR
- **MUST** archive artifacts per CAS
- **MAY** adapt templates for specific needs (extend, not reduce)

---

## 📚 References

- FIT Lifecycle: `docs/fits/FIT_INDEX.md`
- ViTo Core Architecture: `docs/arch/CORE_VITO_ARCHITECTURE.md`
- Engineering Governance: `docs/engineering/`

---

**END OF FRAMEWORK**
