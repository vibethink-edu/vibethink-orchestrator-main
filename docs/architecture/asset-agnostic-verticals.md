# Asset-Agnostic Core & Vertical Plugins

This guide establishes the strict separation between the ViTo Core (Generic Engine) and Vertical Plugins (Domain Specialization) to ensure the platform remains asset-agnostic and scalable.

## ⚖️ Responsibility Mapping

| Feature Layer | Core (`packages/core-*`) | Vertical Plugins (`packages/vertical-*`) |
| :--- | :--- | :--- |
| **Data Models** | Generic types (`Asset`, `UsageEvent`, `Expense`). | Domain types (`Flight`, `Vessel`, `Unit`). |
| **Logic** | Deterministic engines (Allocation, Alerting, Ledger). | Mapping and translation (Domain -> Core). |
| **Taxonomy** | Metric definitions (`hours`, `units`, `events`). | Industry categories (Jet Fuel, Crew Training). |
| **Integrations** | Generic Adapter interfaces. | Specific implementation/connectors to external APIs. |

## 🚫 The "Golden Rule" (Prohibition)
**NEVER hardcode domain-specific concepts inside the Core packages.**
- ❌ **Wrong**: `if (asset.type === 'flight') { ... }` in `core-allocation`.
- ✅ **Correct**: `if (asset.usage_metric === 'hours') { ... }` in `core-allocation`.

## 💡 Examples
- **Core Capability**: `AllocationEngine` processes a `SharedOwnershipAgreement` and a list of `Expenses` using a `PRO_RATA` policy.
- **Vertical Plugin**: `vertical-jets` maps a `FlightLeg` from an external manifest to a `UsageEvent` in the Core, ensuring the `asset_id` matches.

---
**Note**: Violations of this separation compromise the "Asset-Agnostic" pillar and will be rejected during architectural audit.
