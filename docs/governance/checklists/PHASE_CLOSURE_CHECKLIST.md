# Phase Closure Checklist

**Template Version**: 1.0 (Canonical)  
**Authority**: ViTo Governance Framework

---

## 🔍 Pre-Closure Validation

- [ ] All acceptance criteria for this phase are met
- [ ] All planned features/capabilities are implemented
- [ ] All tests pass (unit, integration, contract, API)
- [ ] No critical or high-severity lints
- [ ] Security scan clean (CodeQL, Snyk, etc.)
- [ ] Code coverage meets minimum threshold (Default: 80%)
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
