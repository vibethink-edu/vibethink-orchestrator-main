# Domain Pack: Aviation Vertical (ViTo Stress Test)

**Status:** ✅ SEALED (Vertical Domain Model)  
**Core Compliance:** 🟢 100% (Consumes Core, No Modifications)  
**ProductContext:** `aviation`
**Date:** 2026-01-09

---

## 1. Entity Map (Domain Extensions)

We leverage the **Entity Graph (Core)** to map aviation concepts without creating new tables.

| Domain Concept | Core Entity Type | Relationship |
| :--- | :--- | :--- |
| **Aircraft (Plane)** | `ASSET` | Parent: Airline (Company) |
| **Tail Number** | `IDENTIFIER` | Attached to `ASSET` |
| **Fleet Group** | `ENTITY_GROUP` | Collection of `ASSET` |
| **Crew Member** | `PERSON` | Role: `PILOT` \| `CABIN_CREW` \| `TECH` |
| **Air Base / Hangar** | `WORKSPACE` | Linked to specific `LOCATION` |
| **Airport (Station)** | `LOCATION` | Reference for `EVENTS` |
| **Logbook** | `TIMELINE_OWNER` | Attached to `ASSET` |

---

## 2. Timeline & Event Taxonomy

Aviation events are injected into the **Universal Timeline (Core)** using generic types specialized by context.

| Event Type | Core `type` | Context Payload (JSONB) |
| :--- | :--- | :--- |
| **Flight Log** | `LOG` | `{ origin: 'EZE', dest: 'MAD', blockTime: '12:30', landingTime: '01:15' }` |
| **Crew Check-in** | `SESSION` | `{ role: 'Captain', dutyTimeStart: 'ISO_STAMP' }` |
| **Maintenance Check** | `INSPECTION` | `{ type: 'A-Check', tech_id: 'UUID', components: [...] }` |
| **Fueling** | `PURCHASE` | `{ qty: 5000, unit: 'LBS', supplier: 'Shell', location: 'JFK' }` |
| **Operational Delay** | `INCIDENT` | `{ code: 'ATC_DELAY', duration: 45, severity: 'LOW' }` |

---

## 3. The Jurisdiction Dimension

Multi-jurisdiction is handled via **Regional Configuration (Core)** and **Policy Layer**.

### 3.1 Regulatory Context
Rules change when the `Asset` crosses borders.
- **FAA Policy**: Applied when `ResourceContext.jurisdiction === 'USA'`.
- **EASA Policy**: Applied when `ResourceContext.jurisdiction === 'EU'`.

### 3.2 Dynamic Settings by Jurisdiction
| Setting | Level | Authority |
| :--- | :--- | :--- |
| **Maximum Duty Hours** | Policy | Regulator (FAA/EASA) |
| **Airport Landing Fees** | Workspace | Airport Authority |
| **Per-diem (Viáticos)** | Financial | Local Labor Law (by Country) |
| **Fuel Tax (VAT/IVA)** | Financial | Local Tax Agency |

---

## 4. Settings Hierarchy (Multi-Entity)

Inheritance flow for Aviation:
1. **Global Aviation Standards** (System Default)
2. **Airline Group Policies** (Parent Company)
3. **Regional Subsidiary Rules** (Branch/Legal Entity)
4. **Local Base Procedures** (Workspace/Hangar)
5. **Pilot Preferences** (User)

---

## 5. FR / NFR v1 (Minimum Viable Pilot)

### Functional Requirements (FR)
- **Fleet Tracking**: Visual real-time status of all Tail Numbers.
- **Flight Event Logging**: Mobile-first entry for pilots to log block times and fuel.
- **Maintenance Alerts**: Auto-generated tasks when a component reaches X flight hours (Core Task Service).
- **Expense Normalization**: Multi-currency upload of local station receipts.

### Non-Functional Requirements (NFR)
- **Extreme Context-Awareness**: The UI must change labels (e.g., "Check-in" -> "Sign-on") based on `ProductContext: aviation`.
- **Offline Sync**: Pilots must log data in flight; sync occurs upon landing (Core Resilience).
- **Auditability**: 100% of flight logs must be cryptographically signed (Core Traceability).

---

## 6. Risks & Assumptions

### Risks
- **Timezone Complexity**: Flights crossing multiple TZs require strict adherence to the **"Safe Noon"** and **"Venue-Time"** core laws.
- **Regulatory Drift**: High frequency of rule changes in aviation might stress the Policy Layer agility.

### Assumptions
- AI Agents (Specialists) have access to International Aviation manuals via the **Active Glossary**.
- GPS data is available to feed the `ResourceContext` dynamically.

---

## 7. Out of Scope (v1)

- **Pax Management**: Ticketing and passenger manifests.
- **Baggage Handling**: Ground operations logistics.
- **Full LMS**: Training and certification management for crew (only status check for v1).
- **Cargo Optimization**: Weight and balance complex algorithms.
