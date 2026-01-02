# Vendor-Agnostic Onboarding

> **Philosophy**: We onboard Capabilities, not Logos.
> **Mechanism**: Declarative requirement of Signal Classes.
> **Outcome**: Authorization Grant for the ESI to ingest.

## 1. The Declarative Model

Onboarding is NOT a wizard. It is a state resolution process.
The System declares what it needs; the User provides the grand.

**Wrong (Vendor-First):**
> "Click here to connect Google."

**Right (Signal-First):**
> "The System requires access to `EMAIL_READ` and `CALENDAR_READ` to function."
> "Available Providers: [Google Workspace], [Office 365]."

## 2. Onboarding Phases

The process follows a strict 3-step state machine governed by the `Policy Layer`.

### Phase 1: Policy Declaration
The Organization Policy defines which Signal Classes are authorized.
-   `Policy: ALLOW [EMAIL, CALENDAR]`
-   `Policy: BLOCK [DRIVE]`

#### Declarative Spec Example
This is how the system "sees" a requirement. It is NOT code, but a conceptual definition.

```yaml
# Conceptual Definition: Onboarding Requirement
profile_name: "Standard Employee Signals"
required_capabilities:
  - class: EMAIL_READ
    retention: 365_days
    visibility: PRIVATE_TO_USER
  - class: CALENDAR_READ
    retention: 90_days
    visibility: TEAM_VISIBLE

binding:
  allowed_adapters: ["google-workspace", "office-365"]
  selection: "PENDING_ADMIN_ACTION" 
```

### Phase 2: Adapter Association
The Administrator selects an `Adapter` to fulfill the authorized `Signal Classes`.
-   *Input*: "I want to fulfill EMAIL with GoogleWorkspaceAdapter."
-   *System*: "Initiating OAuth handshake for Scope [Gmail.Readonly]."

### Phase 3: Ingestion Activation
Once the Adapter is `Connected`, the `ESI` pipeline begins strictly according to Quota.
-   No "Importing..." loading screens.
-   Ingestion is a background process visible only via `System Status`.

## 3. Invariants (WITs)

1.  **WIT-ONBD-001**: **Separation of Concerns**. The UI Component asking for credentials knows ONLY the `AdapterID` and `Scopes`. It knows nothing about the ingestion logic.
2.  **WIT-ONBD-002**: **No Vendor Storage**. We store `RefreshTokens` securely, associated with an `AdapterInstanceID`, never with a "User's Google Account" concept directly.
3.  **WIT-ONBD-003**: **Revocation is Universal**. Disabling an `Adapter` instantly stops ALL ingestion. There are no "zombie connections".
4.  **WIT-ONBD-004**: **Signal Class Equivalency**. Switching from Google to Office 365 is transparent to the Reasoning Engine. It simply sees `EMAIL_RECEIVED` events coming from a different `SourceID`.

## 4. The "No Wizard" Rule

There is no "Onboarding Flow" in the Orchestrator Core.
There is only `Adapter State Management`.

-   **State: Disconnected** -> **Action: Connect**
-   **State: Connected** -> **Action: Sync / Disconnect**
-   **State: Error** -> **Action: Re-authenticate**

Any visual "Setup Guide" is a disposable UI projection of these states, NOT a core architectural component.
