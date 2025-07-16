---
complexity: 3
tokens_estimated: 1000
dependencies: ["essential/quick-context.md"]
last_updated: "2024-12-18"
relevant_for: ["automation", "development"]
---

# Complexity Detection Rules - Memory Bank Automation

## 🎯 Automatic Complexity Assessment

### Detection Algorithm
```yaml
complexity_calculation:
  base_score: 1
  
  # File Impact Scoring
  file_changes:
    single_file: +0
    2-3_files: +1
    4-10_files: +2
    10+_files: +3
  
  # Architecture Impact
  architecture_keywords:
    - "schema": +2
    - "migration": +2
    - "RLS": +2
    - "authentication": +2
    - "multi-tenant": +1
    - "security": +1
    - "performance": +1
  
  # AI Processing Impact
  ai_keywords:
    - "openai": +1
    - "whisper": +1
    - "gpt": +1
    - "edge function": +2
    - "ai processing": +1
  
  # Business Logic Impact
  business_keywords:
    - "billing": +2
    - "plan": +1
    - "limits": +1
    - "role": +1
    - "permission": +1
  
  # Technical Complexity
  technical_keywords:
    - "refactor": +2
    - "optimization": +1
    - "testing": +1
    - "deployment": +2
    - "breaking change": +3
```

## 🔍 Complexity Level Determination

### Level 1: Quick Fixes (Score 1-2)
**Indicators**:
- Single file modification
- Bug fix keywords: "fix", "bug", "error", "broken"
- UI tweaks: "styling", "css", "color", "spacing"
- Simple text changes
- Console.log removal
- Import/export fixes

**Auto-load**:
- `essential/` only
- Error context if applicable
- No specialized context

**Example Triggers**:
```
"Fix button color in login form"
"Remove debug console.log statements"
"Update error message text"
"Fix import path for component"
```

### Level 2: Standard Features (Score 3-5)
**Indicators**:
- Multiple file changes (2-5 files)
- New component creation
- Basic CRUD operations
- UI form creation
- Simple integrations
- Non-breaking API changes

**Auto-load**:
- `essential/` + `common/architecture/system-overview.md`
- `common/development/tech-stack.md`
- Feature-specific context

**Example Triggers**:
```
"Add new user profile form"
"Create document upload component"
"Implement basic search functionality"
"Add email notification feature"
```

### Level 3: Complex Features (Score 6-8)
**Indicators**:
- Database schema changes
- New AI features
- Role/permission changes
- Performance optimizations
- Integration with external APIs
- Multi-component features

**Auto-load**:
- Level 2 context +
- `common/architecture/multi-tenant-patterns.md`
- `specialized/ai-processing/` (if AI-related)
- `specialized/security-deep/` (if security-related)

**Example Triggers**:
```
"Implement meeting transcription feature"
"Add company-wide settings management"
"Create advanced user permissions system"
"Integrate with Google Workspace API"
```

### Level 4: System Integration (Score 9-11)
**Indicators**:
- Major feature additions
- Breaking API changes
- Security model changes
- Cross-system integrations
- Performance architecture changes
- Complex business logic

**Auto-load**:
- Level 3 context +
- `specialized/operations/`
- `specialized/compliance/`
- Full architecture documentation

**Example Triggers**:
```
"Implement SUPPORT role with cross-company access"
"Add enterprise SSO integration"
"Create comprehensive audit logging system"
"Implement advanced AI cost optimization"
```

### Level 5: Architecture Changes (Score 12+)
**Indicators**:
- System-wide refactoring
- Database migrations
- Security architecture changes
- Major performance overhauls
- Multi-system integrations
- Compliance implementations

**Auto-load**:
- Full context loading
- All specialized areas
- Migration and deployment guides
- Comprehensive testing documentation

**Example Triggers**:
```
"Migrate to new multi-tenant architecture"
"Implement SOC2 compliance framework"
"Major React 19 migration with concurrent features"
"Complete AI processing pipeline overhaul"
```

## 🤖 Keyword Detection Patterns

### File Path Analysis
```yaml
path_complexity:
  # High complexity paths
  "supabase/migrations/": +3
  "tests/security/": +2
  "docs/ARCHITECTURE": +2
  
  # Medium complexity paths
  "src/components/admin/": +2
  "src/hooks/": +1
  "edge-functions/": +2
  
  # Low complexity paths
  "src/components/ui/": +0
  "src/pages/": +1
  "docs/": +0
```

### Content Analysis Patterns
```yaml
content_patterns:
  # Security and Multi-tenancy
  company_id_filter: +1
  rls_policy: +2
  cross_company: +3
  
  # AI Processing
  openai_api: +1
  file_processing: +1
  cost_tracking: +2
  
  # Database Changes
  create_table: +3
  alter_table: +2
  new_index: +1
  
  # Business Logic
  billing_logic: +2
  plan_limits: +2
  role_changes: +2
```

## 📊 Context Loading Strategy

### Progressive Loading Rules
```typescript
interface ContextLoadingRules {
  level1: {
    always: ["essential/"];
    conditional: ["error-context"];
    specialized: [];
  };
  
  level2: {
    always: ["essential/", "common/architecture/system-overview.md"];
    conditional: ["common/development/"];
    specialized: ["relevant-feature"];
  };
  
  level3: {
    always: ["essential/", "common/"];
    conditional: ["specialized/relevant-area"];
    specialized: ["deep-dive-context"];
  };
  
  level4: {
    always: ["essential/", "common/", "specialized/operations/"];
    conditional: ["all-relevant-specialized"];
    specialized: ["full-context"];
  };
  
  level5: {
    always: ["all-context"];
    conditional: [];
    specialized: ["comprehensive-loading"];
  };
}
```

### Token Budget Management
```yaml
token_budgets:
  level1: 500
  level2: 1200
  level3: 2000
  level4: 3500
  level5: 5000
  
allocation_strategy:
  essential: 200 # Always loaded
  common: 800    # Cached and loaded as needed
  specialized: variable # Based on complexity
  error_context: 300 # When applicable
```

## 🔧 Auto-detection Implementation

### Detection Trigger Points
```typescript
// When to trigger complexity detection
const detectionTriggers = [
  'session_start',
  'task_description_provided',
  'file_changes_detected',
  'error_context_added',
  'user_request_analysis'
];

// Detection algorithm
function detectComplexity(context: TaskContext): ComplexityLevel {
  let score = 1; // Base score
  
  // Analyze file changes
  score += analyzeFileImpact(context.files);
  
  // Analyze keywords
  score += analyzeKeywords(context.description);
  
  // Analyze error context
  score += analyzeErrorContext(context.errors);
  
  // Return complexity level
  return mapScoreToLevel(score);
}
```

### Smart Caching Strategy
```typescript
interface CacheStrategy {
  // Cache common context across sessions
  common_cache: {
    duration: "1_hour";
    invalidate_on: ["schema_changes", "major_updates"];
  };
  
  // Cache specialized context per domain
  specialized_cache: {
    duration: "30_minutes";
    per_domain: ["ai", "security", "operations"];
  };
  
  // Essential context always fresh
  essential_cache: {
    duration: "5_minutes";
    always_refresh: true;
  };
}
```

## 📈 Performance Optimization

### Loading Time Targets
```yaml
performance_targets:
  level1: "< 1 second"
  level2: "< 2 seconds"
  level3: "< 3 seconds"
  level4: "< 4 seconds"
  level5: "< 5 seconds"

optimization_strategies:
  - lazy_loading_specialized
  - progressive_context_building
  - smart_caching
  - context_compression
  - relevance_scoring
```

### Monitoring and Tuning
```typescript
interface PerformanceMetrics {
  context_load_time: number;
  token_efficiency: number;
  relevance_score: number;
  user_satisfaction: number;
}

// Continuous optimization
function optimizeDetection(metrics: PerformanceMetrics) {
  // Adjust complexity thresholds based on performance
  // Fine-tune keyword weights
  // Optimize caching strategies
  // Improve relevance scoring
}
```

## 🔄 Feedback Loop

### Learning from Usage
```yaml
feedback_collection:
  # Track context relevance
  relevance_feedback:
    - too_much_context
    - too_little_context
    - wrong_context_type
  
  # Performance feedback
  performance_feedback:
    - load_time_acceptable
    - token_usage_efficient
    - context_complete
  
  # Accuracy feedback
  accuracy_feedback:
    - complexity_correct
    - context_helpful
    - task_completion_success
```

### Continuous Improvement
```typescript
// Weekly optimization cycle
function weeklyOptimization() {
  // Analyze feedback data
  const feedback = collectFeedbackData();
  
  // Adjust detection rules
  adjustComplexityRules(feedback);
  
  // Optimize loading strategies
  optimizeLoadingStrategy(feedback);
  
  // Update caching policies
  updateCachingPolicies(feedback);
}
```

---

**🎯 Automation Goal**: Intelligently detect task complexity and load appropriate context for maximum efficiency

**📊 Success Metrics**: 95% complexity detection accuracy, <3 second average load time, 60% token efficiency improvement

**🔄 Continuous Learning**: System improves based on usage patterns and feedback 