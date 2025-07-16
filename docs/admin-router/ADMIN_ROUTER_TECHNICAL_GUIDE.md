# AdminRouter Technical Implementation Guide

## Quick Start for Developers

This guide provides step-by-step instructions for working with the AdminRouter system, including setup, development, and common tasks.

---

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Understanding the Route Structure](#understanding-the-route-structure)
3. [Working with Authentication](#working-with-authentication)
4. [Creating New Dashboards](#creating-new-dashboards)
5. [Implementing Security Features](#implementing-security-features)
6. [Testing and Debugging](#testing-and-debugging)
7. [Common Development Tasks](#common-development-tasks)
8. [Code Examples](#code-examples)

---

## Development Environment Setup

### Prerequisites

```bash
# Required dependencies
npm install react-router-dom@^6.0.0
npm install lucide-react
npm install @types/react @types/react-dom

# BUNDUI Premium (if not already installed)
# Follow BUNDUI Premium installation guide
```

### Project Structure

Ensure your project has this structure:

```
src/
├── apps/admin/
│   ├── AdminRouter.tsx
│   └── components/
│       ├── dashboards/
│       ├── auth/
│       └── navigation/
├── shared/
│   ├── hooks/useAuth.tsx
│   └── components/bundui-premium/
└── types/
    └── auth.types.ts
```

### Configuration Files

Update your `tsconfig.json` to include proper path mapping:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/shared/*": ["src/shared/*"],
      "@/apps/*": ["src/apps/*"]
    }
  }
}
```

---

## Understanding the Route Structure

### Route Hierarchy

```typescript
/admin                          # Root admin path
├── /login                     # Authentication
├── /test                      # Development routes
│   ├── /basic-test
│   ├── /premium-test
│   └── /premium-test-enhanced
├── /dashboard                 # Main dashboard routes
│   ├── /premium
│   ├── /dashboards            # Overview page
│   └── /navigator             # Navigation interface
├── /dashboard-[variant]       # Dashboard variants
│   ├── /dashboard-default
│   ├── /dashboard-analytics
│   ├── /dashboard-crm
│   ├── /dashboard-finance
│   └── /dashboard-marketing
└── /company-dashboard         # Specialized dashboards
    └── /super-admin
```

### Route Components

Each route consists of:

1. **Path Definition**: URL pattern
2. **Element**: Component to render
3. **Protection**: Authentication wrapper
4. **Provider**: BUNDUI context wrapper

Example route structure:

```typescript
<Route 
  path="/dashboard-analytics" 
  element={
    <ProtectedAdminRoute>
      <BunduiPremiumProvider>
        <AnalyticsDashboard />
      </BunduiPremiumProvider>
    </ProtectedAdminRoute>
  } 
/>
```

---

## Working with Authentication

### useAuth Hook Integration

The AdminRouter depends on the `useAuth` hook. Ensure it provides:

```typescript
interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface User {
  id: string;
  email: string;
  profile: {
    role: 'USER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
    company_id?: string;
  };
}
```

### Authentication Flow

1. **User accesses admin route**
2. **ProtectedAdminRoute checks authentication**
3. **If not authenticated**: Redirect to `/admin/login`
4. **If authenticated**: Check role permissions
5. **If authorized**: Render component
6. **If not authorized**: Show access denied message

### Role-Based Access Control

```typescript
// Role hierarchy (highest to lowest)
const ROLE_HIERARCHY = {
  SUPER_ADMIN: 4,
  OWNER: 3,
  ADMIN: 2,
  USER: 1
};

// Check if user has required role
const hasRole = (userRole: string, requiredRole: string) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
```

---

## Creating New Dashboards

### Step 1: Create Dashboard Component

```typescript
// src/apps/admin/components/MyNewDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';

interface MyNewDashboardProps {
  className?: string;
}

const MyNewDashboard: React.FC<MyNewDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My New Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Widget 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dashboard content here</p>
          </CardContent>
        </Card>
        
        {/* Add more widgets */}
      </div>
    </div>
  );
};

export default MyNewDashboard;
```

### Step 2: Add Route to AdminRouter

```typescript
// In AdminRouter.tsx, add import
import MyNewDashboard from './components/MyNewDashboard';

// Add route definition
<Route 
  path="/my-new-dashboard" 
  element={
    <ProtectedAdminRoute>
      <BunduiPremiumProvider>
        <MyNewDashboard />
      </BunduiPremiumProvider>
    </ProtectedAdminRoute>
  } 
/>
```

### Step 3: Update Navigation (Optional)

```typescript
// In DashboardNavigator.tsx, add to dashboardOptions array
{
  id: 'my-new-dashboard',
  name: 'My New Dashboard',
  description: 'Description of my new dashboard',
  path: '/admin/my-new-dashboard',
  icon: <MyIcon className="h-4 w-4" />,
  status: 'active',
  category: 'business'
}
```

---

## Implementing Security Features

### Custom Protection Wrapper

Create specialized protection for specific features:

```typescript
// CustomProtectionWrapper.tsx
interface CustomProtectionProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackComponent?: React.ComponentType;
}

const CustomProtectionWrapper: React.FC<CustomProtectionProps> = ({
  children,
  requiredRole = 'ADMIN',
  requiredPermission,
  fallbackComponent: FallbackComponent
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && !hasRole(user.profile.role, requiredRole)) {
    return FallbackComponent ? <FallbackComponent /> : <AccessDenied />;
  }

  if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
    return FallbackComponent ? <FallbackComponent /> : <AccessDenied />;
  }

  return <>{children}</>;
};
```

### Usage Example

```typescript
<Route 
  path="/sensitive-feature" 
  element={
    <CustomProtectionWrapper 
      requiredRole="SUPER_ADMIN"
      requiredPermission="SYSTEM_ADMIN"
    >
      <SensitiveFeatureComponent />
    </CustomProtectionWrapper>
  } 
/>
```

---

## Testing and Debugging

### Test Routes

Use these routes for development and testing:

```typescript
// Basic component testing
/admin/basic-test          # Simple component rendering
/admin/test               # Protected route testing
/admin/premium-test       # Premium component testing
/admin/premium-test-enhanced  # Advanced debugging
```

### Debug Tools

1. **Authentication State Debugging**:
```typescript
// Add to any component for debugging
const { user, isAuthenticated } = useAuth();
console.log('Auth State:', { user, isAuthenticated });
```

2. **Route Debugging**:
```typescript
// Add to AdminRouter.tsx
import { useLocation } from 'react-router-dom';

const DebugInfo = () => {
  const location = useLocation();
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'yellow', padding: '10px' }}>
      Current Path: {location.pathname}
    </div>
  );
};
```

3. **Role Testing**:
```typescript
// Temporarily override user role for testing
const testUser = {
  ...user,
  profile: { ...user.profile, role: 'SUPER_ADMIN' }
};
```

### Common Debugging Scenarios

| Issue | Debug Route | What to Check |
|-------|-------------|---------------|
| Authentication | `/admin/test` | useAuth hook state |
| Premium Access | `/admin/premium-test` | User role, PremiumRoute logic |
| Component Rendering | `/admin/basic-test` | Component imports, props |
| BUNDUI Integration | `/admin/premium-test-enhanced` | Provider wrapping, component usage |

---

## Common Development Tasks

### 1. Adding a New Role

```typescript
// Update user types
interface UserProfile {
  role: 'USER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN' | 'NEW_ROLE';
}

// Update ProtectedAdminRoute
const isAdmin = user?.profile?.role === "ADMIN" || 
                user?.profile?.role === "OWNER" || 
                user?.profile?.role === "SUPER_ADMIN" ||
                user?.profile?.role === "NEW_ROLE";
```

### 2. Creating a Conditional Route

```typescript
// Route that appears only for certain conditions
<Route 
  path="/conditional-feature" 
  element={
    <ProtectedAdminRoute>
      {user?.profile?.company_id ? (
        <CompanySpecificDashboard />
      ) : (
        <GeneralDashboard />
      )}
    </ProtectedAdminRoute>
  } 
/>
```

### 3. Adding Loading States

```typescript
const LoadingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return <>{children}</>;
};

// Use in routes
<Route 
  path="/dashboard" 
  element={
    <LoadingRoute>
      <ProtectedAdminRoute>
        <Dashboard />
      </ProtectedAdminRoute>
    </LoadingRoute>
  } 
/>
```

### 4. Implementing Route Guards

```typescript
// RouteGuard.tsx
interface RouteGuardProps {
  children: React.ReactNode;
  guards: Array<(user: User) => boolean>;
  fallback?: React.ComponentType;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, guards, fallback: Fallback }) => {
  const { user } = useAuth();
  
  const hasAccess = guards.every(guard => guard(user));
  
  if (!hasAccess) {
    return Fallback ? <Fallback /> : <AccessDenied />;
  }
  
  return <>{children}</>;
};

// Usage
<Route 
  path="/guarded-route" 
  element={
    <RouteGuard guards={[
      (user) => user.profile.role === 'ADMIN',
      (user) => user.profile.verified === true
    ]}>
      <GuardedComponent />
    </RouteGuard>
  } 
/>
```

---

## Code Examples

### Complete Dashboard Component Template

```typescript
// DashboardTemplate.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardData {
  metrics: {
    totalUsers: number;
    revenue: number;
    growth: number;
  };
  loading: boolean;
}

const DashboardTemplate: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    metrics: { totalUsers: 0, revenue: 0, growth: 0 },
    loading: true
  });

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/dashboard-data');
        const result = await response.json();
        setData({ metrics: result, loading: false });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.metrics.revenue}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.metrics.growth}%</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Activity content here...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Create New User
              </Button>
              <Button variant="outline" className="w-full">
                Generate Report
              </Button>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTemplate;
```

### Enhanced Route Protection

```typescript
// EnhancedRouteProtection.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

interface EnhancedProtectionProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  companyRequired?: boolean;
  onAccessDenied?: () => void;
}

const EnhancedProtection: React.FC<EnhancedProtectionProps> = ({
  children,
  requiredRole = 'ADMIN',
  requiredPermissions = [],
  companyRequired = false,
  onAccessDenied
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role
  if (requiredRole && !hasRole(user.profile.role, requiredRole)) {
    onAccessDenied?.();
    return <AccessDeniedComponent requiredRole={requiredRole} />;
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasPermissions = requiredPermissions.every(permission => 
      user.permissions?.includes(permission)
    );
    
    if (!hasPermissions) {
      onAccessDenied?.();
      return <AccessDeniedComponent requiredPermissions={requiredPermissions} />;
    }
  }

  // Check company requirement
  if (companyRequired && !user.profile.company_id) {
    return <CompanyRequiredComponent />;
  }

  return <>{children}</>;
};

// Usage example
<Route 
  path="/advanced-feature" 
  element={
    <EnhancedProtection 
      requiredRole="SUPER_ADMIN"
      requiredPermissions={['SYSTEM_ADMIN', 'USER_MANAGEMENT']}
      companyRequired={true}
      onAccessDenied={() => console.log('Access denied to advanced feature')}
    >
      <AdvancedFeatureComponent />
    </EnhancedProtection>
  } 
/>
```

---

## Best Practices Summary

### Code Organization
- Keep components modular and reusable
- Use TypeScript interfaces for prop definitions
- Implement proper error boundaries
- Follow consistent naming conventions

### Security
- Always validate user roles on both client and server
- Implement proper session management
- Use HTTPS in production
- Sanitize user inputs

### Performance
- Use React.memo for expensive components
- Implement lazy loading for large dashboard components
- Optimize bundle size with proper imports
- Use proper dependency arrays in useEffect

### Testing
- Test all authentication flows
- Verify role-based access control
- Test route navigation and redirects
- Implement integration tests for critical paths

---

This technical guide provides everything needed to work effectively with the AdminRouter system. For additional help, consult the main documentation or contact the development team.

*Last updated: January 2025*
