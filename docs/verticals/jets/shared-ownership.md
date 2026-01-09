# Shared Ownership & Cost Allocation: Jets Vertical

This document describes how to configure the Shared Ownership module for the Jets vertical using the ViTo Core.

## Overview

The Jets vertical uses the `vertical-jets` plugin to map aviation-specific data (Flights, Logs) into the core `UsageEvent` format. This allows the deterministic `AllocationEngine` to distribute costs among owners.

## Configuration

### 1. Shared Ownership Agreement

Define the agreement in your `SharedOwnershipAgreement` model.

```json
{
  "asset_id": "asset_jet_123",
  "owners": [
    { "owner_id": "owner_A", "share_percentage": 50 },
    { "owner_id": "owner_B", "share_percentage": 50 }
  ],
  "policy_id": "policy_mixed_jet_v1",
  "billing_cycle": "monthly"
}
```

### 2. Allocation Policy

For Jets, a **MIXED** policy is recommended:
- **Fixed Costs** (Hangar, Insurance, Scheduled Maintenance): Allocated **PRO_RATA** (50/50).
- **Variable Costs** (Fuel, Landing Fees, Catering): Allocated **BY_USAGE** (Flight Hours).

```json
{
  "id": "policy_mixed_jet_v1",
  "type": "MIXED",
  "params": {
    "variable_categories": ["fuel", "landing_fees", "catering", "handling"],
    "fixed_categories": ["insurance", "hangar", "maintenance_scheduled"]
  }
}
```

## Data Mapping

The `vertical-jets` plugin maps flight data as follows:

| Jet Data | Core UsageEvent | Notes |
| :--- | :--- | :--- |
| `JetFlight` | `UsageEvent` | One event per flight (multi-leg aggregated) |
| `flight_time` | `metric_value` | In Hours (e.g. 1.5) |
| `tail_number` | `refs.tags` | `tail_number:N12345` |
| `owner_id` | `refs.tags` | `owner_id:owner_A` |

## Example Ledger Output

**Scenario**: Owner A flies 2 hours. Owner B flies 0 hours.
**Cost**: Fuel Bill ($2000).

**Ledger**:
```csv
Period Label,Owner ID,Cost ID,Allocated Amount,Rationale,Status
"Jan 2026","owner_A","expense_fuel_001",2000.00,"By Usage: 2/2 units (100.00%)","OK"
"Jan 2026","owner_B","expense_fuel_001",0.00,"By Usage: 0/2 units (0.00%)","OK"
```

## Alerts

- `owner_charge_mismatch_usage`: Raised if a fuel bill exists but no flights are recorded for the period.
- `shared_cost_missing_policy`: Raised if an unknown expense category is encountered.
