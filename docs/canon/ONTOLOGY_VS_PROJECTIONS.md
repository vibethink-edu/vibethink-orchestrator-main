# Ontology vs. Projections vs. Persistence

**Status**: CANONICAL  
**Type**: ARCHITECTURAL_CORE  
**Last Updated**: 2026-01-02

---

## 1. Purpose

The purpose of this document is to establish a hard boundary between **Architecture (Ontology)**, **Engineering (Persistence)**, and **Product (Projections)**. 

ViTo explicitly separates these concerns to prevent "App-Thinking" from corrupting the "Operational Brain". We do not enable the system to "think in screens" or "think in tables"; we enable it to think in **Concepts**.

## 1B. Ontological Separation: Memory Types vs World Entities

**Strict Separation (MVP)**:
*   **Memory Types (The Big 5)**: *How* we remember (Signal, Event, Commitment, Artifact, Time).
*   **World Entities (The 4)**: *Who/What* we talk about (Person, Organization, Case, Program).

> **Rule**: A "Case" is a World Entity. A "Signal" is the memory that proves the Case exists or changed.

---

## 2. What Is an Ontological Entity?

An **Ontological Entity** is a fundamental unit of existence within the business domain. It represents **"What is true"**, independent of how it is viewed, stored, or which software vendor produced it.

**The Golden Rule**:
> "If we replaced Salesforce with HubSpot, or Gmail with Outlook, and the UI changed completely, would this concept still exist?"
> 
> *   **Yes** → It is likely an Ontological Entity.
> *   **No** → It is an App Concept, Format, or Projection.

---

## 3. Canonical Ontology in ViTo

ViTo enforces a **Closed Vocabulary**. Only these 5 **Memory Types** exist at the root of the domain ontology's memory structure:

1.  **Communication Signal**
    *   *Definition*: A transmission of information between parties.
    *   *Examples*: Email, Chat Message, Voice Log, Letter.
    *   *Abstracts*: Gmail, Slack, Twilio, Outlook.

2.  **Interaction Event**
    *   *Definition*: A synchronous occurrence involving time and people.
    *   *Definition*: Meeting, Call, Workshop, Webinar.
    *   *Abstracts*: Google Calendar, Zoom, Teams.

3.  **Commitment Signal**
    *   *Definition*: An explicit agreement to perform work or honor a state.
    *   *Examples*: Contract, Approved Purchase Order, Task Assignment.
    *   *Abstracts*: DocuSign, Jira Task, Asana Card.

4.  **Knowledge Artifact**
    *   *Definition*: A static repository of structured or unstructured information.
    *   *Examples*: Policy Document, Specification, Report, Spreadsheet analysis.
    *   *Abstracts*: Google Doc, Notion Page, Excel File, PDF.

5.  **Temporal Context**
    *   *Definition*: A defined bound of time that categorizes other entities.
    *   *Examples*: Fiscal Quarter, Sprint, Milestone, Deadline.
    *   *Abstracts*: "Q3", "Sprint 42".

---

## 4. What Is a Projection?

A **Projection** is a **View** constructed for human consumption. It aggregates, filters, and formats Ontological Entities into a context that makes sense for a specific user workflow.

**Projections do not exist in the Ontology.** They are ephemeral windows into the Truth.

### The "Inbox" Example
"Inbox" is **NOT** a place where things live. It is a filter query:
*   `SELECT * FROM Signals WHERE status = 'UNREAD' AND recipient = 'ME'`

An Inbox might contain:
*   A **Communication Signal** (Email)
*   A **Commitment Signal** (Approval Request)
*   A **Knowledge Artifact** (Shared Document)

**What an Inbox IS**: A UI metaphor for "Stuff I haven't dealt with".
**What an Inbox is NOT**: An entity in the database or ontology.

---

## 5. Ontology vs. Database Models (ERD)

**Ontology (The "What")** ≠ **Database (The "How")**

*   **Ontology**: "A Communication Signal represents a message."
*   **Database**: "Tables `email_headers`, `chat_logs`, and `sms_records` store payload data."

Just because you have a table called `users_emails` does **not** mean you have an "Email Entity" in the ontology. You have a persistence store for a specific *type* of Communication Signal.

**Critical Law**:
Do not confuse **Storage Optimization** (normalization, tables) with **Domain Modeling** (meaning).

---

## 6. Common Confusions

| Concept | Status | ❌ Incorrect (App/UX Thinking) | ✅ Correct (Canonical Thinking) |
| :--- | :--- | :--- | :--- |
| **Email** | **Medium** | "We need an `Email` entity." | "This is a `Communication Signal` transmitted via Email protocol." |
| **Calendar Event** | **App Concept** | "Sync the `GCalEvent` to DB." | "Ingest as `Interaction Event` with metadata `source: Google`." |
| **Task** | **App Concept** | "Create a `Task` table." | "This is a `Commitment Signal` (agreement to do work)." |
| **Spreadsheet** | **Format** | "Import `ExcelSheet` entity." | "Ingest `Knowledge Artifact` with metadata `format: spreadsheet`." |
| **Inbox** | **Projection** | "The `Inbox` has 5 items." | "The `Unprocessed View` projects 5 `Signals`." |

---

## 7. Anti-Patterns (DO NOT MODEL)

### 🚫 The "Vendor Mirror" Pattern
Creating entities that strictly mirror a 3rd party API.
*   *Bad*: `class SalesforceLead`, `class HubSpotContact`
*   *Good*: `Person` entity enriched by `source: Salesforce`.

### 🚫 The "Format-First" Pattern
Defining entities by how they are encoded.
*   *Bad*: `PdfEntity`, `JsonEntity`
*   *Good*: `Knowledge Artifact` (content is what matters, not file extension).

### 🚫 The "Screen-Driven" Modeling
Creating backend services just to power one specific screen.
*   *Bad*: `DashboardService` returning `DashboardObjects`.
*   *Good*: `TimelineService` returning `Canonical Events`; UI formats them for Dashboard.
