# ViTo Workflow Registry

This directory contains the Active Workflows for the ViTo Orchestrator.

## 🚨 Critical Architecture Note

**`ci.yml` is the ONLY Source of Truth for Branch Protection.**

All other workflows are auxiliary (deployment, monitoring, specific utility checks) and MUST NOT be used as mandatory status checks for merging into `main` or `develop`.

## Active Workflows

### 🛡️ Quality Gates & Security
| Workflow | File | Description |
| :--- | :--- | :--- |
| **CI Implementation** | `ci.yml` | The authoritative CI pipeline (Lint, Format, Typecheck, Test, Build). |
| **CodeQL Security** | `codeql.yml` | GitHub Advanced Security analysis (JavaScript/TypeScript). |
| **Canon Protection** | `canon-protection.yml` | Guards critical architectural documentation. |
| **Route Docs** | `update-route-docs.yml` | Automates documentation updates on route changes. |

### 🚀 Deployment & Environments
| Workflow | File | Description |
| :--- | :--- | :--- |
| **Deploy** | `deploy.yml` | Generic deployment orchestrator. |
| **Production** | `production.yml` | Production environment pipeline. |
| **Staging** | `staging.yml` | Staging environment pipeline. |
| **Development** | `development.yml` | Development environment pipeline. |

### 📊 Monitoring & Ops
| Workflow | File | Description |
| :--- | :--- | :--- |
| **Cost Monitoring** | `cost-monitoring.yml` | Tracks infrastructure costs. |
| **Upgrade Monitor** | `upgrade-monitor.yml` | Checks for dependencies updates. |
| **KPI Automation** | `kpi-automation.yml` | Business metrics automation. |
| **3rd Party Mon** | `third-party-monitoring.yml` | External service health checks. |

## 📦 Archived Workflows

Legacy/Duplicate workflows have been moved to `.github/workflows-archive/`.
These include:
- `quality-gate.yml`
- `code-quality.yml`
- `optimized-ci.yml`
- `integrity-gates.yml`
- `xtp-complete-testing.yml`
- `porte-validation.yml`

> **Note to Maintainers:** Do not resurrect these files without Architect approval. They represent deprecated methodologies.
