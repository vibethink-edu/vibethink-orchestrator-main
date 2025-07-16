# Monorepo Management Rules - XTP v4.6

## 🏗️ **Monorepo Architecture**

### **Structure Organization**
```
src/
├── apps/                    # Independent applications
│   ├── admin/              # Admin panel app
│   ├── dashboard/          # Main dashboard app
│   ├── ai-chat/            # AI chat application
│   ├── helpdesk/           # Support system app
│   └── login/              # Authentication app
├── shared/                 # Shared components & utilities
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   ├── types/              # Type definitions
│   └── services/           # Shared services
├── integrations/           # External integrations
├── common/                 # Common patterns
├── specialized/            # Specialized modules
└── modules/                # Business logic modules
```

### **Import Patterns**
```typescript
// ✅ Correct: Use aliases for monorepo imports
import { Component } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { apiClient } from '@/shared/services';

// ❌ Incorrect: Relative imports across apps
import { Component } from '../../../shared/components';
```

## 🔧 **Lerna Configuration**

### **Package Management**
```json
{
  "lerna": {
    "version": "independent",
    "npmClient": "npm",
    "useWorkspaces": true,
    "packages": [
      "src/apps/*",
      "src/shared/*",
      "src/integrations/*"
    ]
  }
}
```

### **Workspace Commands**
```bash
# ✅ Lerna commands for monorepo
npx lerna run build
npx lerna run test
npx lerna run lint
npx lerna run clean
npx lerna publish
npx lerna version
```

## 📦 **Dependency Management**

### **Shared Dependencies**
```json
{
  "dependencies": {
    "@shared/components": "workspace:*",
    "@shared/hooks": "workspace:*",
    "@shared/utils": "workspace:*",
    "@shared/types": "workspace:*",
    "@shared/services": "workspace:*"
  }
}
```

### **App-Specific Dependencies**
```json
{
  "dependencies": {
    "@admin/components": "workspace:*",
    "@dashboard/components": "workspace:*",
    "@ai-chat/components": "workspace:*"
  }
}
```

## 🔄 **Git Synchronization**

### **Git Sync Script**
```javascript
// scripts/git-sync.js
const gitSync = {
  commitMessage: "feat(monorepo): synchronized changes across apps",
  branchStrategy: "feature branches per app",
  mergeStrategy: "squash and merge",
  conflictResolution: "manual review required"
};
```

### **Branch Management**
```bash
# ✅ Feature branch workflow
git checkout -b feature/admin-user-management
git add .
git commit -m "feat(admin): add user management with multi-tenant security"
git push origin feature/admin-user-management

# ✅ Merge strategy
git checkout main
git merge --squash feature/admin-user-management
git commit -m "feat(admin): add user management - XTP v4.6 compliant"
```

## 🧪 **Testing Strategy**

### **App-Level Testing**
```typescript
// ✅ Test each app independently
describe('Admin App', () => {
  it('should load admin components', () => {
    // Test admin-specific functionality
  });
});

describe('Dashboard App', () => {
  it('should load dashboard components', () => {
    // Test dashboard-specific functionality
  });
});
```

### **Shared Component Testing**
```typescript
// ✅ Test shared components across apps
describe('Shared Components', () => {
  it('should work in admin context', () => {
    // Test in admin app context
  });

  it('should work in dashboard context', () => {
    // Test in dashboard app context
  });
});
```

## 🚀 **Build and Deployment**

### **Build Configuration**
```json
{
  "scripts": {
    "build:all": "lerna run build",
    "build:admin": "lerna run build --scope=@admin/*",
    "build:dashboard": "lerna run build --scope=@dashboard/*",
    "build:shared": "lerna run build --scope=@shared/*"
  }
}
```

### **Deployment Strategy**
```yaml
# ✅ Independent deployment per app
deployment:
  admin:
    path: "src/apps/admin"
    build: "npm run build"
    deploy: "deploy-admin.sh"
  
  dashboard:
    path: "src/apps/dashboard"
    build: "npm run build"
    deploy: "deploy-dashboard.sh"
```

## 📊 **Performance Optimization**

### **Bundle Splitting**
```typescript
// ✅ Lazy load apps
const AdminApp = lazy(() => import('@/apps/admin/AdminApp'));
const DashboardApp = lazy(() => import('@/apps/dashboard/DashboardApp'));
const AIChatApp = lazy(() => import('@/apps/ai-chat/AIChatApp'));
```

### **Shared Bundle Optimization**
```typescript
// ✅ Optimize shared dependencies
const sharedDependencies = {
  react: 'shared',
  'react-dom': 'shared',
  '@supabase/supabase-js': 'shared',
  'lucide-react': 'shared'
};
```

## 🔍 **Code Quality**

### **Linting Configuration**
```json
{
  "eslintConfig": {
    "extends": [
      "@shared/eslint-config",
      "@admin/eslint-config",
      "@dashboard/eslint-config"
    ]
  }
}
```

### **Type Checking**
```json
{
  "typescript": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["src/shared/*"],
      "@admin/*": ["src/apps/admin/*"],
      "@dashboard/*": ["src/apps/dashboard/*"]
    }
  }
}
```

## 🚫 **Anti-Patterns**

### **Monorepo Violations**
```typescript
// ❌ NEVER do this:
// Relative imports across apps
import { Component } from '../../../shared/components';

// Circular dependencies between apps
// App-specific logic in shared components
// Inconsistent naming conventions
```

### **Dependency Violations**
```typescript
// ❌ NEVER do this:
// Duplicate dependencies across apps
// Version conflicts in shared packages
// Missing peer dependencies
```

---

**Follow these rules to maintain a clean and efficient monorepo architecture.** 