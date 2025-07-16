# Task Management Rules - XTP v4.6

## 🎯 **Task Complexity Levels**

### **Level 1: Quick Fix (500 tokens)**
```typescript
const level1Task = {
  scope: "Bug fixes, small tweaks, immediate issues",
  context: "Error + immediate fix + verification",
  tokenBudget: 500,
  loadTime: "<1 second",
  documentation: "Minimal - inline comments only",
  testing: "Basic validation",
  review: "Self-review",
  examples: [
    "Fix typo in component",
    "Update CSS class name",
    "Add missing import",
    "Fix console error"
  ]
};
```

### **Level 2-4: Standard Feature (2000 tokens)**
```typescript
const level2_4Task = {
  scope: "New features, integrations, moderate changes",
  context: "Business requirement + technical approach + testing",
  tokenBudget: 2000,
  loadTime: "1-3 seconds",
  documentation: "Progressive - component docs + examples",
  testing: "Comprehensive - unit + integration",
  review: "Peer review",
  examples: [
    "Add new form component",
    "Implement API integration",
    "Create new page/route",
    "Add new feature to existing component"
  ]
};
```

### **Level 5: Architecture Change (5000 tokens)**
```typescript
const level5Task = {
  scope: "Major refactoring, security changes, system evolution",
  context: "Full system understanding + impact analysis + migration",
  tokenBudget: 5000,
  loadTime: "3-5 seconds",
  documentation: "Comprehensive - ADR + technical docs + migration guide",
  testing: "Full suite - unit + integration + e2e + performance",
  review: "Architecture review + security review",
  examples: [
    "Refactor authentication system",
    "Implement new security feature",
    "Major database schema change",
    "System-wide performance optimization"
  ]
};
```

## 📋 **Task Creation Template**

### **XTP v4.6 Task Template**
```typescript
interface XTPTask {
  id: string;
  title: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5;
  complexity: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  estimatedTime: string;
  xtpCompliance: boolean;
  securityReview: boolean;
  testingRequired: boolean;
  documentationRequired: boolean;
  acceptanceCriteria: string[];
  dependencies: string[];
  tags: string[];
  createdAt: Date;
  dueDate?: Date;
  status: 'todo' | 'in-progress' | 'review' | 'testing' | 'done';
}
```

### **Task Creation Example**
```typescript
const newTask: XTPTask = {
  id: 'TASK-001',
  title: 'Add User Management with Multi-tenant Security',
  description: 'Implement user management interface with company isolation and role-based access control',
  level: 4,
  complexity: 'high',
  priority: 'high',
  assignee: 'Marcelo Developer',
  estimatedTime: '2-3 days',
  xtpCompliance: true,
  securityReview: true,
  testingRequired: true,
  documentationRequired: true,
  acceptanceCriteria: [
    'Users can only see users from their company',
    'Role-based permissions are enforced',
    'RLS policies are validated',
    'Comprehensive testing coverage >90%',
    'XTP v4.6 documentation complete'
  ],
  dependencies: ['AUTH-001', 'DB-002'],
  tags: ['security', 'multi-tenant', 'admin', 'xtp-v4.6'],
  createdAt: new Date(),
  status: 'todo'
};
```

## 🔧 **Development Workflow**

### **Task Execution Process**
```typescript
const taskExecutionWorkflow = {
  start: {
    actions: [
      'Load session protocol',
      'Assess task complexity',
      'Load appropriate context',
      'Create task branch'
    ]
  },
  development: {
    actions: [
      'Follow XTP v4.6 coding standards',
      'Implement security requirements',
      'Write comprehensive tests',
      'Update documentation'
    ]
  },
  review: {
    actions: [
      'Self-review against checklist',
      'Peer review for level 2-4',
      'Architecture review for level 5',
      'Security review if required'
    ]
  },
  testing: {
    actions: [
      'Run unit tests',
      'Run integration tests',
      'Run security tests',
      'Run performance tests',
      'Run accessibility tests'
    ]
  },
  completion: {
    actions: [
      'Update task status',
      'Create pull request',
      'Update documentation',
      'Archive task context'
    ]
  }
};
```

## 🧪 **Testing Requirements by Level**

### **Level 1 Testing**
```typescript
const level1Testing = {
  required: [
    'Basic functionality test',
    'No regression test',
    'Console error check'
  ],
  optional: [
    'Unit test if time permits',
    'Manual verification'
  ]
};
```

### **Level 2-4 Testing**
```typescript
const level2_4Testing = {
  required: [
    'Unit tests for business logic',
    'Integration tests for API calls',
    'Component tests for UI',
    'Security tests for permissions',
    'Error handling tests'
  ],
  optional: [
    'E2E tests for critical flows',
    'Performance tests',
    'Accessibility tests'
  ]
};
```

### **Level 5 Testing**
```typescript
const level5Testing = {
  required: [
    'Comprehensive unit test suite',
    'Full integration test coverage',
    'E2E tests for all user flows',
    'Security penetration tests',
    'Performance load tests',
    'Accessibility compliance tests',
    'Migration tests',
    'Rollback tests'
  ]
};
```

## 📚 **Documentation Requirements**

### **Level 1 Documentation**
```markdown
# Quick Fix: [Task Title]

## Problem
Brief description of the issue

## Solution
What was changed and why

## Verification
How to verify the fix works

---
*Level: 1 | Time: [duration] | Reviewer: [name]*
```

### **Level 2-4 Documentation**
```markdown
# Feature: [Task Title]

## Business Requirement
What business need this addresses

## Technical Approach
How the solution was implemented

## Security Considerations
- Company_id filtering implemented
- Role-based access enforced
- RLS policies validated

## Testing Coverage
- Unit tests: [coverage %]
- Integration tests: [coverage %]
- Security tests: [coverage %]

## Usage Examples
```typescript
// Example usage code
```

---
*Level: [2-4] | Time: [duration] | Reviewer: [name] | XTP v4.6 Compliant*
```

### **Level 5 Documentation**
```markdown
# Architecture Change: [Task Title]

## Business Context
Why this change is necessary

## Technical Design
Detailed technical implementation

## Security Architecture
- Multi-tenant isolation strategy
- Role-based access implementation
- Audit logging approach
- Compliance considerations

## Migration Strategy
- Step-by-step migration plan
- Rollback procedures
- Data validation steps

## Testing Strategy
- Unit test coverage: [%]
- Integration test coverage: [%]
- E2E test coverage: [%]
- Security test coverage: [%]
- Performance test results

## Impact Analysis
- Performance impact
- Security impact
- User experience impact
- Maintenance impact

## Rollback Plan
Detailed rollback procedures

---
*Level: 5 | Time: [duration] | Reviewers: [names] | XTP v4.6 Compliant*
```

## 🚫 **Task Anti-Patterns**

### **What NOT to do**
```typescript
// ❌ NEVER do this:
const badTaskPractices = {
  skipSessionProtocol: "Start coding without session info",
  ignoreSecurity: "Skip security review for convenience",
  noTesting: "Ship without tests",
  noDocumentation: "Leave no trace of changes",
  scopeCreep: "Add features not in acceptance criteria",
  skipReview: "Merge without proper review",
  ignorePerformance: "Don't consider performance impact",
  skipAccessibility: "Ignore accessibility requirements"
};
```

### **Best Practices**
```typescript
// ✅ ALWAYS do this:
const goodTaskPractices = {
  sessionProtocol: "Always start with session info",
  securityFirst: "Consider security implications first",
  testDriven: "Write tests before implementation",
  documentEverything: "Document decisions and changes",
  scopeControl: "Stick to acceptance criteria",
  properReview: "Get appropriate level of review",
  performanceAware: "Consider performance impact",
  accessibilityIncluded: "Include accessibility testing"
};
```

## 📊 **Task Metrics**

### **Quality Metrics**
```typescript
const taskQualityMetrics = {
  completionRate: ">95% tasks completed on time",
  defectRate: "<5% tasks require rework",
  testCoverage: ">90% for level 2-4, >95% for level 5",
  documentationCompleteness: "100% tasks documented",
  securityCompliance: "100% security requirements met",
  xtpCompliance: "100% XTP v4.6 standards met"
};
```

### **Performance Metrics**
```typescript
const taskPerformanceMetrics = {
  averageCompletionTime: {
    level1: "<2 hours",
    level2_4: "<1 week",
    level5: "<2 weeks"
  },
  reviewTime: {
    level1: "<30 minutes",
    level2_4: "<2 hours",
    level5: "<1 day"
  },
  testingTime: {
    level1: "<1 hour",
    level2_4: "<4 hours",
    level5: "<2 days"
  }
};
```

---

**Follow these rules to ensure efficient and high-quality task management.** 