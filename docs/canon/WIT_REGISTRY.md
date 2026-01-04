# Working Invariants Truths (WIT) Registry

**Status**: CANON  
**Type**: ONTOLOGY_GUARD  
**Last Updated**: 2026-01-01

This registry defines the immutable truths that govern the ontological boundaries of ViTo. These are not code preferences; they are laws of the physics of this system.

---

## WIT-001: Closed Canon Vocabulary

**Description**:  
The Canonical Model accepts only five foundational **Memory Types** (The Big 5): **Communication Signal**, **Interaction Event**, **Commitment Signal**, **Knowledge Artifact**, and **Temporal Context**.

**Ontological Separation**:
These are *Memory Types* (how we store truth). They are distinct from *World Entities* (Person, Organization, Case, Program) which represent the real-world actors and subjects.

**Explicit Anti-pattern**:  
Creating new top-level entities to match a specific application, file format, or vendor capability.

**FAIL Example**:  
`class EmailEntity extends BaseEntity`  
*(Reason: "Email" is an app/medium, not a canonical type. Must be `Communication Signal`.)*

---

## WIT-002: Medium ≠ Canon

**Description**:  
The medium through which information arrives (Email, Chat, Spreadsheet, Voice) is a metadata attribute of the origin, never an entity type itself.

**Explicit Anti-pattern**:  
Modelling the container instead of the content.

**FAIL Example**:  
`const spreadsheets = db.table('spreadsheets');`  
*(Reason: A spreadsheet is valid only if it represents a `Knowledge Artifact` or `Communication Signal`. The grid format itself is irrelevant.)*

---

## WIT-003: Evidence ≠ Truth

**Description**:  
Signals (Evidence) are inputs that increase confidence. Truth is a resolved state achieved only after conflict resolution and policy validation.

**Explicit Anti-pattern**:  
Treating a raw incoming web-hook or API response as an immediate, unquestionable fact in the Memory Layer.

**FAIL Example**:  
`if (webhook.status === 'approved') memory.setCanonicalState('APPROVED');`  
*(Reason: Bypasses the resolution layer. A webhook is just a claim.)*

---

## WIT-004: Frequency ≠ Truth

**Description**:  
The reoccurrence of a signal increases its weight or priority, but does not transmute it into a canonical fact without formal validation.

**Explicit Anti-pattern**:  
Assuming that if everyone talks about X, X is formally true/approved in the system.

**FAIL Example**:  
`if (mentionCount > 10) promoteToCommitment();`  
*(Reason: Gossip is frequent but not binding. Only authorized signals create commitments.)*

---

## WIT-005: Inference ≠ Fact

**Description**:  
Conclusions derived by AI models (LLMs) or algorithms are strictly probablistic inferences (metadata), never foundational facts, regardless of confidence score.

**Explicit Anti-pattern**:  
Storing AI summarization or sentiment analysis as the primary source of truth for an event's state.

**FAIL Example**:  
`const dealStatus = aiModel.predictStatus(emailChain);`  
*(Reason: The status is a prediction. The actual status changes only via explicit Human or System Action.)*

---

## WIT-006: UX ≠ Ontology

**Description**:  
User Interface concepts (Inbox, Calendar, To-Do List) are projections optimized for human consumption. They do not define, constrain, or map 1:1 to the underlying canonical data model.

**Explicit Anti-pattern**:  
Creating database tables or backend services named after UI views.

**FAIL Example**:  
`model InboxItem { ... }`  
*(Reason: "Inbox" is a view state of `Communication Signals`, not an entity.)*

---

## WIT-007: Department ≠ Model

**Description**:  
Departmental needs (Sales view vs. Ops view) are solved via permissions (Policy Layer) and Projections (UX Layer), never by forking the Canonical Model.

**Explicit Anti-pattern**:  
Creating `SalesCustomer` and `OpsCustomer` entities because they need to see different fields.

**FAIL Example**:  
`table sales_products` / `table ops_products`  
*(Reason: Violates Universality. Use Views or RLS on a single `Product` entity.)*
