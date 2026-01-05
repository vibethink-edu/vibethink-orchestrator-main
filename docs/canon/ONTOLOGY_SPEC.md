# ONTOLOGY_SPEC: ViTo - VibeThink Orchestrator Canonical Ontology

**Status**: CANONICAL
**Type**: ONTOLOGY_DEFINITION
**Last Updated**: 2026-01-04

A) Closed Vocabulary (MVP Entities)
- Communication Signal: A transmission of information between parties; the medium is metadata, not the entity. Represents what was communicated, independent of delivery channel. Minimum fields: id, participants, occurred_at, content_ref, source_provenance.
- Interaction Signal: A synchronous occurrence involving time, people, and shared context. Represents real-time interaction, not a calendar invite. Minimum fields: id, participants, started_at, ended_at, context_ref.
- Commitment Signal: An explicit agreement to perform work or honor a state. Captures promise or obligation, not a task UI. Minimum fields: id, committing_party, obligated_party, commitment_text, due_time.
- Knowledge Artifact: A static repository of structured or unstructured knowledge for reference. Format is metadata, not identity. Minimum fields: id, title, content_ref, created_at, provenance.
- Temporal Context: A bounded time frame that categorizes other entities. It is a time envelope, not a timestamp. Minimum fields: id, label, start_time, end_time, scope_ref.
- Person: A human actor participating in signals, events, or cases. Not a user account or auth record. Minimum fields: id, display_name, contact_handles.
- Organization: A group or company that acts as a real-world actor. Distinct from tenant billing boundary. Minimum fields: id, name, external_refs.
- Case: A bounded unit of work or process (project, ticket, deal). Represents the subject of action and evidence. Minimum fields: id, title, status, owning_org_ref.
- Program: A long-running initiative or product line that groups cases. Represents persistent strategic scope. Minimum fields: id, name, lifecycle_state.
- Tenant: The billable, legal entity that owns data and defines the isolation boundary. It is the hard boundary for access and ownership. Minimum fields: id, legal_name, billing_scope.
- Workspace: The primary operational container where work is organized. All operational resources belong to a workspace or tenant. Minimum fields: id, name, tenant_ref.
- Identity User: An internal actor authenticated to act within the platform. This is staff/system identity, not a person entity. Minimum fields: id, auth_ref, email.
- Organization Unit: A hierarchical grouping for reporting or structure. It does not define data isolation. Minimum fields: id, name, parent_ref, tenant_ref.
- Capability Activation: A record that a capability is active for a tenant or workspace. It is feature state, not a product. Minimum fields: id, capability_key, target_ref, status.

B) Canonical Event Types
- SIGNAL_RECEIVED: External input is ingested and normalized. Example payload:
  {"signal_id":"sig-uuid","signal_type":"WEBHOOK","source_channel":"external","received_at":"2026-01-04T12:00:00Z","correlation_id":"corr-uuid"}
- SIGNAL_PROCESSED: Signal processing finished successfully. Example payload:
  {"signal_id":"sig-uuid","run_id":"run-uuid","processed_at":"2026-01-04T12:00:30Z","status":"PROCESSED"}
- SIGNAL_PROCESSING_FAILED: Signal processing failed. Example payload:
  {"signal_id":"sig-uuid","run_id":"run-uuid","error_code":"VALIDATION_FAILED","failed_at":"2026-01-04T12:00:30Z"}
- RUN_STARTED: Orchestration execution began. Example payload:
  {"run_id":"run-uuid","signal_id":"sig-uuid","run_type":"SIGNAL_PROCESSING","orchestrator_version":"v1.0.0"}
- RUN_COMPLETED: All steps succeeded. Example payload:
  {"run_id":"run-uuid","completed_at":"2026-01-04T12:03:00Z","total_steps":8,"failed_steps":0}
- RUN_FAILED: Run failed and is terminal. Example payload:
  {"run_id":"run-uuid","failed_at":"2026-01-04T12:03:00Z","exit_reason":"STEP_TIMEOUT"}
- STEP_STARTED: Step execution began. Example payload:
  {"step_id":"step-uuid","run_id":"run-uuid","step_index":3,"step_type":"SPECIALIST_CALL"}
- STEP_COMPLETED: Step finished successfully. Example payload:
  {"step_id":"step-uuid","run_id":"run-uuid","step_index":3,"duration_ms":1523}
- STEP_FAILED: Step failed with error. Example payload:
  {"step_id":"step-uuid","run_id":"run-uuid","step_index":3,"error_code":"TOOL_TIMEOUT"}
- EFFECT_REQUESTED: External action was requested. Example payload:
  {"effect_id":"eff-uuid","run_id":"run-uuid","effect_type":"API_CALL","idempotency_key":"run-uuid-eff-uuid"}
- EFFECT_COMPLETED: External action succeeded. Example payload:
  {"effect_id":"eff-uuid","run_id":"run-uuid","effect_type":"API_CALL","completed_at":"2026-01-04T12:05:00Z"}
- EFFECT_FAILED: External action failed. Example payload:
  {"effect_id":"eff-uuid","run_id":"run-uuid","effect_type":"API_CALL","error_code":"TIMEOUT"}
- TOOL_CALLED: LLM tool invoked. Example payload:
  {"tool_call_id":"tool-uuid","run_id":"run-uuid","step_id":"step-uuid","tool_name":"calculate_roi"}
- TOOL_COMPLETED: Tool returned result. Example payload:
  {"tool_call_id":"tool-uuid","run_id":"run-uuid","step_id":"step-uuid","duration_ms":420}
- TOOL_FAILED: Tool execution failed. Example payload:
  {"tool_call_id":"tool-uuid","run_id":"run-uuid","step_id":"step-uuid","error_code":"INVALID_INPUT"}
- MEMBERSHIP_GRANTED: A person gained membership in a workspace. Example payload:
  {"person_id":"person-uuid","workspace_id":"ws-uuid","granted_at":"2026-01-04T12:06:00Z","granted_by":"identity-user-uuid"}
- MEMBERSHIP_REVOKED: A person lost membership in a workspace. Example payload:
  {"person_id":"person-uuid","workspace_id":"ws-uuid","revoked_at":"2026-01-04T12:07:00Z","revoked_by":"identity-user-uuid"}

C) Relationships
- Person --member_of--> Organization (N:M)
- Organization --owns--> Case (1:N)
- Program --includes--> Case (1:N)
- Case --has_participant--> Person (N:M)
- Communication Signal --about--> Case (N:M)
- Interaction Signal --has_participant--> Person (N:M)
- Commitment Signal --binds--> Person (N:M)
- Knowledge Artifact --relates_to--> Case (N:M)
- Temporal Context --frames--> Interaction Signal (1:N)
- Tenant --contains--> Workspace (1:N)
- Person --has_membership_in--> Workspace (N:M)
- Organization Unit --belongs_to--> Tenant (N:1)
- Organization Unit --parent_of--> Organization Unit (1:N)
- Capability Activation --targets--> Tenant (N:1)
- Capability Activation --targets--> Workspace (N:1)

D) Non-Entities (Explicito)
- Inbox: Projection/UX filter, not a canonical entity.
- Email: Medium/protocol; becomes Communication Signal with medium metadata.
- Calendar / Calendar Event: App concept; becomes Interaction Signal with source metadata.
- Spreadsheet: Format; becomes Knowledge Artifact with format metadata.
- Chat / Message Thread: Medium/UX; becomes Communication Signal.
- Notes: UX container; becomes Knowledge Artifact.
- Task / To-Do: UX concept; becomes Commitment Signal.
- Workspace Member: Access concept; modeled only as membership relationship and events, not an entity.
- Folder: Storage container; projection or metadata, not entity.
- Dashboard / Report: Projection layer artifacts, not canonical truth.
- Vendor Objects (GmailMessage, SlackMessage, NotionPage): Vendor mirrors, not ontology.

E) Naming Rules (MUST/SHOULD/MAY)
- MUST use singular noun phrases for entities (Person, Case, Knowledge Artifact).
- MUST keep Memory Types and World Entities aligned to canon; do not create new top-level types without WIT update.
- MUST name events in past tense with uppercase snake case (RUN_STARTED, STEP_COMPLETED).
- MUST avoid vendor, medium, or UI terms in entity names (no Email, Calendar, Inbox, Slack).
- SHOULD name relationships as verbs in present tense (owns, has_participant, frames).
- SHOULD use explicit qualifiers for roles (committing_party, obligated_party) rather than new entities.
- MAY extend via metadata fields when additional detail is needed without new entities.

F) Anti-Patterns
- Vendor Mirror: Creating SalesforceLead or GmailMessage entities; use Person/Communication Signal with source metadata.
- Medium Explosion: Adding Email, Chat, SMS as separate entities; use Communication Signal with medium attribute.
- UI Projection Leak: Creating InboxItem or CalendarEvent entities; use projections over canonical entities.
- Format-First Modeling: Defining PdfEntity or SpreadsheetEntity; use Knowledge Artifact with format metadata.
- Role Proliferation: Creating SalesCustomer vs OpsCustomer entities; use Person/Organization plus policy views.
- Case Taxonomy Explosion: Creating DealCase, TicketCase, ProjectCase; keep Case with typed metadata.

G) Pending
- Formal criteria for opening new entities: passes Golden Rule, not a medium/vendor/UI, recurs across products, and approved via WIT update.
- EvidencePack as a first-class entity or remains a structured artifact: needs governance decision and cross-canon alignment.
- External principals and client accounts scope: align with EXTERNAL_PRINCIPALS model before any new ontology additions.
- Program/Case boundaries for cross-tenant initiatives: require explicit multi-tenant policy review.
- Canonical relationship taxonomy standardization: define approved verb set and constraints before expansion.
