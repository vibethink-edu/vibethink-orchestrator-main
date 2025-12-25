# Contextual Memory System - Complete User Shadow

**Version:** 1.0.0  
**Status:** ✅ DESIGN SPECIFICATION  
**Last Updated:** 2025-12-23  
**Purpose:** Be the user's digital shadow - remember EVERYTHING

---

## 🎯 Vision

Create an AI system that acts as the user's **digital shadow** - capturing, remembering, and contextualizing EVERY interaction, document, conversation, and behavior to provide unprecedented personalization and assistance.

**Goal:** The AI should **NEVER** forget anything about the user and should **SURPRISE** them with how well it knows them.

---

## 📊 Data Sources to Capture

### 1. User Speech & Communication Patterns

**What to Capture:**
- ✅ Vocabulary preferences (formal vs casual)
- ✅ Frequently used phrases
- ✅ Technical jargon specific to their industry
- ✅ Tone (professional, friendly, direct)
- ✅ Language mixing (Spanglish, etc.)
- ✅ Preferred greetings/closings
- ✅ Emoji usage patterns
- ✅ Punctuation style

**Example Storage:**
```json
{
  "user_id": "user_123",
  "speech_patterns": {
    "tone": "professional_friendly",
    "formality_level": 7,
    "common_phrases": [
      "adelante",
      "perfecto",
      "quiero que",
      "es esto claro o tengo que especificarlo mejor"
    ],
    "language_preference": "es",
    "language_mixing": {
      "primary": "es",
      "secondary": "en",
      "mixing_frequency": "high"
    },
    "emoji_usage": "minimal",
    "punctuation_style": "standard",
    "preferred_greetings": ["Hola", "Buenos días"],
    "preferred_closings": ["Gracias", "Perfecto"]
  }
}
```

---

### 2. Browser Activity & Navigation

**What to Capture:**
- ✅ Pages visited (URLs, titles, time spent)
- ✅ Search queries (internal and external)
- ✅ Click patterns (what they click most)
- ✅ Scroll depth (how much they read)
- ✅ Time of day usage patterns
- ✅ Device preferences (desktop, mobile, tablet)
- ✅ Browser preferences (Chrome, Firefox, etc.)
- ✅ Screen resolution and viewport

**Example Storage:**
```json
{
  "user_id": "user_123",
  "browser_activity": {
    "most_visited_pages": [
      {
        "url": "/dashboard/projects-v2",
        "visits": 145,
        "avg_time_spent": "8m 32s",
        "last_visit": "2025-12-23T17:00:00Z"
      }
    ],
    "search_queries": [
      {
        "query": "sidebar i18n",
        "timestamp": "2025-12-23T16:30:00Z",
        "results_clicked": ["/docs/i18n"]
      }
    ],
    "usage_patterns": {
      "peak_hours": ["09:00-12:00", "14:00-18:00"],
      "preferred_device": "desktop",
      "preferred_browser": "chrome",
      "screen_resolution": "1920x1080"
    }
  }
}
```

**Implementation:**
```typescript
// lib/analytics/user-tracking.ts
export function trackPageView(url: string) {
  const session = {
    url,
    title: document.title,
    timestamp: new Date().toISOString(),
    timeSpent: 0,
    scrollDepth: 0,
    clicks: []
  };
  
  // Track time spent
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    session.timeSpent = Date.now() - startTime;
    saveSession(session);
  });
  
  // Track scroll depth
  window.addEventListener('scroll', () => {
    const depth = (window.scrollY / document.body.scrollHeight) * 100;
    session.scrollDepth = Math.max(session.scrollDepth, depth);
  });
  
  // Track clicks
  document.addEventListener('click', (e) => {
    session.clicks.push({
      element: e.target.tagName,
      text: e.target.textContent?.substring(0, 50),
      timestamp: Date.now() - startTime
    });
  });
}
```

---

### 3. Document Interactions

**What to Capture:**
- ✅ Documents opened (files, PDFs, images)
- ✅ Documents created/edited
- ✅ Documents shared
- ✅ Annotations and comments
- ✅ Bookmarks and favorites
- ✅ Download history
- ✅ Upload history

**Example Storage:**
```json
{
  "user_id": "user_123",
  "document_activity": {
    "recently_opened": [
      {
        "file": "nav-main.tsx",
        "path": "/src/components/sidebar/nav-main.tsx",
        "opened_at": "2025-12-23T17:20:00Z",
        "time_spent": "15m",
        "edits_made": 12,
        "lines_changed": 45
      }
    ],
    "frequently_accessed": [
      {
        "file": "GLOBAL_MULTILINGUAL_STANDARD.md",
        "access_count": 23,
        "last_accessed": "2025-12-23T16:00:00Z"
      }
    ],
    "bookmarks": [
      "/docs/standards/GLOBAL_MULTILINGUAL_STANDARD.md",
      "/docs/standards/THIRD_PARTY_COMPONENT_ADAPTATION.md"
    ]
  }
}
```

---

### 4. Conversations & Chat History

**What to Capture:**
- ✅ All AI chat conversations
- ✅ Topics discussed
- ✅ Questions asked (and answered)
- ✅ Feedback given (positive/negative)
- ✅ Corrections made
- ✅ Preferences expressed
- ✅ Frustrations mentioned

**Example Storage:**
```json
{
  "user_id": "user_123",
  "conversations": [
    {
      "conversation_id": "conv_456",
      "started_at": "2025-12-23T14:00:00Z",
      "ended_at": "2025-12-23T17:30:00Z",
      "messages": 127,
      "topics": [
        "i18n implementation",
        "sidebar translation",
        "third-party components",
        "plan-based features"
      ],
      "key_decisions": [
        "Always implement 7 languages",
        "Zero tolerance for hardcoded strings",
        "Use wrapper pattern for third-party components"
      ],
      "user_preferences_learned": [
        "Prefers Spanish for communication",
        "Wants comprehensive documentation",
        "Values no repetitive questions"
      ],
      "sentiment": "positive",
      "satisfaction_score": 9.5
    }
  ]
}
```

---

### 5. Tasks & Project Management

**What to Capture:**
- ✅ Tasks created
- ✅ Tasks completed
- ✅ Tasks abandoned (and why)
- ✅ Deadlines set
- ✅ Priorities assigned
- ✅ Collaborators added
- ✅ Comments and notes

**Example Storage:**
```json
{
  "user_id": "user_123",
  "tasks": {
    "active": [
      {
        "task_id": "task_789",
        "title": "Implement sidebar i18n for all 7 languages",
        "created_at": "2025-12-23T14:00:00Z",
        "completed_at": "2025-12-23T17:00:00Z",
        "priority": "high",
        "tags": ["i18n", "sidebar", "multilingual"],
        "time_spent": "3h",
        "subtasks_completed": 12,
        "notes": [
          "Fixed typo V12 → V2",
          "Created native translations for AR, ZH, FR, PT, DE"
        ]
      }
    ],
    "patterns": {
      "most_productive_hours": ["09:00-12:00"],
      "average_task_duration": "2h 15m",
      "completion_rate": 0.92,
      "preferred_task_size": "medium"
    }
  }
}
```

---

### 6. Email & Communication

**What to Capture:**
- ✅ Email subjects and topics
- ✅ Frequent contacts
- ✅ Response patterns
- ✅ Email templates used
- ✅ Signature preferences
- ✅ CC/BCC patterns

**Example Storage:**
```json
{
  "user_id": "user_123",
  "email_patterns": {
    "frequent_contacts": [
      {
        "email": "team@example.com",
        "interaction_count": 45,
        "topics": ["project updates", "code reviews"]
      }
    ],
    "response_time": {
      "average": "2h 15m",
      "fastest": "5m",
      "slowest": "24h"
    },
    "email_style": {
      "greeting": "Hola",
      "closing": "Saludos",
      "tone": "professional_friendly",
      "length": "concise"
    }
  }
}
```

---

### 7. Notes & Annotations

**What to Capture:**
- ✅ All notes created
- ✅ Highlights and annotations
- ✅ Tags and categories
- ✅ Links between notes
- ✅ Sketches and drawings
- ✅ Voice notes

**Example Storage:**
```json
{
  "user_id": "user_123",
  "notes": [
    {
      "note_id": "note_101",
      "title": "i18n Implementation Rules",
      "content": "ALWAYS 7 languages, ZERO tolerance for hardcoded strings",
      "created_at": "2025-12-23T15:00:00Z",
      "tags": ["i18n", "standards", "rules"],
      "linked_to": ["GLOBAL_MULTILINGUAL_STANDARD.md"],
      "importance": "high"
    }
  ]
}
```

---

### 8. SEO & Search Behavior

**What to Capture:**
- ✅ Search queries (internal)
- ✅ Search queries (external - if available)
- ✅ Keywords used
- ✅ Topics researched
- ✅ Pages bookmarked
- ✅ Content shared

**Example Storage:**
```json
{
  "user_id": "user_123",
  "search_behavior": {
    "internal_searches": [
      {
        "query": "sidebar translation",
        "timestamp": "2025-12-23T16:00:00Z",
        "results_clicked": [
          "/docs/i18n/sidebar-guide.md"
        ]
      }
    ],
    "topics_of_interest": [
      "internationalization",
      "multilingual systems",
      "component architecture",
      "third-party integration"
    ],
    "content_preferences": {
      "format": "markdown",
      "length": "comprehensive",
      "examples": "required"
    }
  }
}
```

---

### 9. AEO (Answer Engine Optimization)

**What to Capture:**
- ✅ Questions asked to AI
- ✅ Answers provided
- ✅ Follow-up questions
- ✅ Clarifications needed
- ✅ Preferred answer format
- ✅ Context switches

**Example Storage:**
```json
{
  "user_id": "user_123",
  "aeo_patterns": {
    "question_types": [
      {
        "type": "how_to",
        "frequency": 45,
        "example": "¿Cómo implemento i18n en el sidebar?"
      },
      {
        "type": "what_is",
        "frequency": 23,
        "example": "¿Qué es el zero tolerance rule?"
      }
    ],
    "preferred_answer_format": {
      "structure": "step_by_step",
      "code_examples": "required",
      "language": "es",
      "detail_level": "comprehensive"
    },
    "context_retention": {
      "average_context_length": "15 messages",
      "context_switches": "minimal",
      "prefers_continuity": true
    }
  }
}
```

---

## 🧠 AI Context Building

### User Profile Schema

```typescript
interface UserContextProfile {
  // Identity
  user_id: string;
  name: string;
  email: string;
  
  // Preferences
  language: Locale;
  timezone: string;
  theme: 'light' | 'dark';
  
  // Communication Style
  speech_patterns: SpeechPatterns;
  writing_style: WritingStyle;
  
  // Behavior
  browser_activity: BrowserActivity;
  document_interactions: DocumentActivity;
  task_patterns: TaskPatterns;
  
  // Knowledge
  expertise_areas: string[];
  learning_interests: string[];
  frequent_topics: string[];
  
  // Relationships
  frequent_collaborators: Contact[];
  team_members: TeamMember[];
  
  // Metadata
  created_at: Date;
  last_updated: Date;
  context_version: string;
}
```

---

### Context Injection for AI

**Every AI interaction should include:**

```typescript
const aiContext = {
  user: {
    name: "Marcelo",
    preferred_language: "es",
    communication_style: "direct, professional, values comprehensive docs",
    current_focus: "i18n implementation for 7 languages",
    recent_activity: [
      "Implemented sidebar translations",
      "Created third-party component adaptation protocol",
      "Established zero tolerance rule for hardcoded strings"
    ],
    preferences: {
      "no_repetitive_questions": true,
      "comprehensive_documentation": true,
      "all_7_languages_mandatory": true
    }
  },
  session: {
    current_task: "Creating contextual memory system",
    open_files: ["nav-main.tsx"],
    recent_searches: ["sidebar i18n", "web tagging"],
    time_in_session: "3h 30m"
  },
  project: {
    name: "VibeThink Orchestrator",
    tech_stack: ["Next.js", "TypeScript", "i18next"],
    standards: [
      "GLOBAL_MULTILINGUAL_STANDARD.md",
      "THIRD_PARTY_COMPONENT_ADAPTATION.md",
      "PLAN_BASED_FEATURE_ACCESS.md",
      "WEB_TAGGING_COMPLETE_REFERENCE.md"
    ]
  }
};
```

---

## 🎨 Surprise & Delight Features

### 1. Proactive Suggestions

**AI should suggest:**
- "Based on your recent work on sidebar i18n, would you like me to apply the same pattern to the header?"
- "I noticed you've been working for 3 hours. Would you like me to summarize what we've accomplished?"
- "You usually commit around this time. Should I prepare a commit message?"

---

### 2. Contextual Recall

**AI should remember:**
- "Last time you mentioned you wanted zero tolerance for hardcoded strings. I've ensured all new code follows this rule."
- "You prefer comprehensive documentation. I've created a complete reference guide."
- "You asked about this 2 weeks ago. Here's the updated answer based on recent changes."

---

### 3. Pattern Recognition

**AI should notice:**
- "I see you're working on i18n again. Would you like me to pull up the multilingual standard?"
- "You typically work on frontend in the morning. Should I prioritize those tasks?"
- "This is similar to the sidebar implementation. Should I use the same approach?"

---

## 📊 Data Storage Architecture

### Database Schema

```sql
-- User Context
CREATE TABLE user_context (
  user_id UUID PRIMARY KEY,
  profile JSONB NOT NULL,
  speech_patterns JSONB,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log
CREATE TABLE user_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_context(user_id),
  activity_type VARCHAR(50), -- 'page_view', 'search', 'task', 'chat', etc.
  activity_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_context(user_id),
  messages JSONB[],
  topics TEXT[],
  key_decisions JSONB,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Documents
CREATE TABLE document_interactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_context(user_id),
  file_path TEXT,
  action VARCHAR(50), -- 'open', 'edit', 'close', 'bookmark'
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast retrieval
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_timestamp ON user_activity(timestamp);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_document_interactions_user_id ON document_interactions(user_id);
```

---

## 🔒 Privacy & Security

**CRITICAL:**
- ✅ User must explicitly consent to data collection
- ✅ Data must be encrypted at rest
- ✅ User can view all collected data
- ✅ User can delete their data (GDPR compliance)
- ✅ Data retention policies must be clear
- ✅ No sharing with third parties without consent

**Implementation:**
```typescript
// lib/privacy/consent.ts
export async function requestUserConsent() {
  return await showConsentDialog({
    title: "Contextual Memory System",
    description: "To provide the best experience, we'd like to remember your preferences, activity, and interactions. This helps us personalize your experience and never ask repetitive questions.",
    data_collected: [
      "Browser activity and navigation",
      "Document interactions",
      "Conversations and chat history",
      "Tasks and project management",
      "Communication patterns"
    ],
    retention_period: "Until you delete your account",
    can_opt_out: true,
    can_view_data: true,
    can_delete_data: true
  });
}
```

---

## ✅ Implementation Checklist

- [ ] Database schema for user context
- [ ] Activity tracking system
- [ ] Browser activity capture
- [ ] Document interaction tracking
- [ ] Conversation logging
- [ ] User profile builder
- [ ] AI context injection
- [ ] Privacy consent system
- [ ] Data export functionality
- [ ] Data deletion functionality
- [ ] GDPR compliance verification

---

## 🎯 Success Metrics

**The system is successful when:**
- AI never asks repetitive questions
- AI proactively suggests relevant actions
- AI remembers user preferences without being told
- User feels "understood" by the system
- User is surprised by how well AI knows them
- Context switches are seamless
- No information is lost between sessions

---

**Last Updated:** 2025-12-23  
**Version:** 1.0.0  
**Status:** ✅ Design Specification - Ready for Implementation
