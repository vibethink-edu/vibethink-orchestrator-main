# ViTo Canonical Glossary

**Status**: CANONICAL  
**Type**: ONTOLOGY_DEFINITION  
**Last Updated**: 2026-01-02

This glossary establishes the **closed vocabulary** for the ViTo platform. These definitions are absolute and enforced by architectural litmus tests.

---

## 1. Canonical Memory Types (The "Big 5")
 
Only these five concepts exist as root **Memory Types** in the Domain Ontology. They represent *how* the system captures information.

### 1. Communication Signal
*   **Definition**: A transmission of information between two or more parties.
*   **Real World**: Any message sent or received.
*   **What It Is NOT**: It is NOT an "Email" or "Chat" (those are just delivery trucks).
*   **Example**: "Client A sent a request for pricing." (Derived from an Email).

### 2. Interaction Event
*   **Definition**: A synchronous occurrence involving time, people, and a shared context.
*   **Real World**: Time spent together or a scheduled block of time.
*   **What It Is NOT**: It is NOT a "Calendar Invite" or "Zoom Link".
*   **Example**: "Weekly Strategy Sync" or "Sales Call with Acme Corp" (Derived from GCal).

### 3. Commitment Signal
*   **Definition**: An explicit agreement to perform work, honor a state, or deliver a result.
*   **Real World**: A promise to do something.
*   **What It Is NOT**: It is NOT a "Task" or "Kanban Card" or "Checklist Item".
*   **Example**: "I will deliver the report by Friday." (Derived from a Task / Jira).

### 4. Knowledge Artifact
*   **Definition**: A static repository of structured or unstructured information intended for reference.
*   **Real World**: Recorded knowledge or data.
*   **What It Is NOT**: It is NOT a "File", "Document", or "Spreadsheet".
*   **Example**: "FY25 Budget Analysis" (Derived from an Excel file).

### 5. Temporal Context
*   **Definition**: A defined bound of time that categorizes or groups other entities.
*   **Real World**: Cycles, seasons, or deadlines that frame human work.
*   **What It Is NOT**: It is NOT a "Date Field" or "Timestamp".
*   **Example**: "Fiscal Quarter 3", "Sprint 24", "Launch Week".

### 1B. World Entities (MVP)

These stand for the *Actors* and *Subjects* of the domain.
**Strictly Limited List**:
1.  **Person**: A human actor.
2.  **Organization**: A group, company, or team.
3.  **Case**: A bound unit of work or process (Project, Ticket, Deal).
4.  **Program**: A long-running initiative or product line.

*Note: 'Place', 'Timeline', and 'Commitment' are NOT entities in the MVP.*

---

## 2. Non-Canonical Terms (Explicitly Defined)

These terms represent **metadata**, **delivery mechanisms**, or **containers**, but NEVER entities.

### Email
*   **Definition**: A protocol for sending messages.
*   **Status**: **METADATA** (Medium).
*   **In ViTo**: An attribute `source_medium: 'EMAIL'` on a **Communication Signal**.

### Chat
*   **Definition**: A real-time messaging interface.
*   **Status**: **METADATA** (Medium).
*   **In ViTo**: An attribute `source_medium: 'CHAT'` on a **Communication Signal**.

### Calendar / Calendar Event
*   **Definition**: A classic scheduling application concept.
*   **Status**: **METADATA** (Source App).
*   **In ViTo**: An attribute `source_app: 'GOOGLE_CALENDAR'` on an **Interaction Event**.

### Task
*   **Definition**: A unit of work in a project management tool.
*   **Status**: **METADATA** (Format).
*   **In ViTo**: Interpreted as a **Commitment Signal** with `status: 'PENDING'`.

### Spreadsheet
*   **Definition**: A grid-based data format.
*   **Status**: **METADATA** (Format).
*   **In ViTo**: An attribute `file_format: 'SPREADSHEET'` on a **Knowledge Artifact**.

### Inbox
*   **Definition**: A user interface pattern for displaying collected items.
*   **Status**: **PROJECTION** (View).
*   **In ViTo**: A query filter (e.g., `SELECT * WHERE processed = FALSE`). It does not exist in the database.

---

## 3. Key Distinctions

### Entity vs. Projection
*   **Entity**: "What actually happened" (e.g., A Signal received at 10:00 AM). Stored in the Memory Layer.
*   **Projection**: "How I want to see it" (e.g., An "Inbox" view, a "Timeline" view). Constructed by the UX Layer.

### Entity vs. Database Table
*   **Entity**: A high-level domain concept (`CommunicationSignal`).
*   **Table**: A physical storage optimization (`raw_webhooks`, `message_logs`). Tables support entities but do not define them.

### Evidence vs. Canonical Truth
*   **Evidence**: Raw input (e.g., a webhook saying "User X clicked Buy").
*   **Canonical Truth**: The verified system state (e.g., "User X has purchased Product Y") after validation rules have passed.

---

## 4. Vocabulary Rules

1.  **Closed Vocabulary**: No new entity types allowed outside the Big 5.
2.  **No App Names**: Never name a class or table `NotionPage` or `SlackMessage`. Use `Source` metadata instead.
3.  **Changes**: Changes to this glossary require a formal Architectural Request and review. It is the constitution of the domain model.
