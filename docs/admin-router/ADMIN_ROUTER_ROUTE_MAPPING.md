# AdminRouter Route Mapping & API Documentation

## Overview

This document provides a complete mapping of all routes in the AdminRouter system, including their purpose, access levels, components, and API integrations.

---

## Route Categories

### 🔐 Authentication Routes
| Route | Component | Access Level | Purpose |
|-------|-----------|--------------|---------|
| `/admin/login` | `AdminLoginShadcn` | Public | Admin authentication |

### 🧪 Test & Debug Routes
| Route | Component | Access Level | Purpose |
|-------|-----------|--------------|---------|
| `/admin/test` | `TestDashboard` | Protected Admin | Protected route testing |
| `/admin/explorer` | `EmergencyTest` | Public | Emergency test component |
| `/admin/test-explorer` | `TestBunduiExplorer` | Public | Component exploration |
| `/admin/basic-test` | `BasicTest` | Public | Basic component testing |
| `/admin/premium-test` | `BunduiPremiumDashboard` | Public | Premium component testing |
| `/admin/premium-test-enhanced` | `PremiumTestPageEnhanced` | Public | Advanced debugging |

### 📊 Main Dashboard Routes
| Route | Component | Access Level | Purpose |
|-------|-----------|--------------|---------|
| `/admin/dashboard` | `CleanDashboard` | Protected Admin | Standard admin dashboard |
| `/admin/premium` | `BunduiPremiumDashboard` | Premium Only | Premium dashboard |
| `/admin/dashboards` | `DashboardVariationsPage` | Protected Admin | Dashboard overview |
| `/admin/navigator` | `DashboardNavigator` | Protected Admin | Dashboard navigation |

### 🎯 Dashboard Variants
| Route | Component | Access Level | Category | Purpose |
|-------|-----------|--------------|----------|---------|
| `/admin/dashboard-default` | `DefaultDashboard` | Protected Admin | Business | Standard business metrics |
| `/admin/dashboard-ecommerce` | `EcommerceDashboard` | Protected Admin | E-commerce | Online sales analytics |
| `/admin/dashboard-analytics` | `AnalyticsDashboard` | Protected Admin | Analytics | Advanced reporting |
| `/admin/dashboard-crm` | `CRMDashboard` | Protected Admin | Business | Customer management |
| `/admin/dashboard-finance` | `FinanceDashboard` | Protected Admin | Business | Financial metrics |
| `/admin/dashboard-marketing` | `MarketingDashboard` | Protected Admin | Business | Marketing analytics |

### 🏢 Specialized Dashboards
| Route | Component | Access Level | Purpose |
|-------|-----------|--------------|---------|
| `/admin/company-dashboard` | `CompanyDashboard` | Protected Admin | Enterprise dashboard |
| `/admin/super-admin` | `SuperAdminDashboard` | Premium Only | System administration |

### 🔄 Default & Fallback Routes
| Route | Behavior | Access Level |
|-------|----------|--------------|
| `/admin/` | Redirect to explorer (auth) or login | Dynamic |
| `/admin/*` | Redirect to explorer | Public |

---

## Detailed Route Analysis

### Authentication Routes

#### `/admin/login`
```typescript
Route Configuration:
- Element: AdminLoginShadcn
- Protection: Conditional redirect if authenticated
- Redirect Target: /admin/test (if authenticated)
- Features:
  - Form validation
  - Error handling
  - Remember me functionality
  - Social login options (if configured)
```

**API Integration:**
```typescript
POST /api/auth/admin/login
Body: { email: string, password: string, remember?: boolean }
Response: { token: string, user: User, expires: number }
```

### Test & Debug Routes

#### `/admin/test` - Protected Test Dashboard
```typescript
Route Configuration:
- Element: TestDashboard
- Protection: ProtectedAdminRoute
- Purpose: Testing authenticated admin functionality
- Features:
  - Authentication state display
  - Role verification
  - Permission testing
  - Component rendering tests
```

#### `/admin/premium-test-enhanced` - Advanced Debugging
```typescript
Route Configuration:
- Element: PremiumTestPageEnhanced
- Protection: None (for debugging)
- Purpose: Comprehensive component and integration testing
- Features:
  - BUNDUI component testing
  - Provider context testing
  - API integration testing
  - Error boundary testing
```

### Main Dashboard Routes

#### `/admin/dashboard` - Standard Admin Dashboard
```typescript
Route Configuration:
- Element: CleanDashboard (wrapped in AdminLayout)
- Protection: ProtectedAdminRoute
- Provider: None (uses standard components)
- Purpose: Primary admin interface
```

**Key Features:**
- User management interface
- System monitoring widgets
- Recent activity feed
- Quick action buttons
- Notification center

**API Integration:**
```typescript
GET /api/admin/dashboard/stats
GET /api/admin/users/recent
GET /api/admin/activities/latest
GET /api/admin/notifications
```

#### `/admin/premium` - Premium Dashboard
```typescript
Route Configuration:
- Element: BunduiPremiumDashboard
- Protection: ProtectedAdminRoute + PremiumRoute
- Provider: BunduiPremiumProvider
- Purpose: Advanced admin interface with premium components
```

**Key Features:**
- Advanced analytics widgets
- Interactive charts and graphs
- Real-time data updates
- Export functionality
- Customizable layouts

### Dashboard Variants

#### `/admin/dashboard-analytics` - Analytics Dashboard
```typescript
Route Configuration:
- Element: AnalyticsDashboard
- Protection: ProtectedAdminRoute
- Provider: BunduiPremiumProvider
- Category: Analytics
```

**Key Features:**
- Advanced reporting widgets
- Custom metric builders
- Data visualization tools
- Export capabilities
- Real-time analytics

**API Integration:**
```typescript
GET /api/analytics/overview
GET /api/analytics/reports
GET /api/analytics/metrics/:timeRange
POST /api/analytics/custom-report
```

#### `/admin/dashboard-crm` - CRM Dashboard
```typescript
Route Configuration:
- Element: CRMDashboard
- Protection: ProtectedAdminRoute
- Provider: BunduiPremiumProvider
- Category: Business
```

**Key Features:**
- Customer interaction tracking
- Lead management pipeline
- Contact management tools
- Activity timeline
- Sales funnel visualization

**API Integration:**
```typescript
GET /api/crm/customers
GET /api/crm/leads
GET /api/crm/activities
GET /api/crm/pipeline
POST /api/crm/interactions
```

#### `/admin/dashboard-finance` - Finance Dashboard
```typescript
Route Configuration:
- Element: FinanceDashboard
- Protection: ProtectedAdminRoute
- Provider: BunduiPremiumProvider
- Category: Business
```

**Key Features:**
- Revenue tracking widgets
- Expense management
- Financial KPIs
- Budget monitoring
- Payment processing metrics

**API Integration:**
```typescript
GET /api/finance/revenue
GET /api/finance/expenses
GET /api/finance/budgets
GET /api/finance/kpis
GET /api/finance/transactions
```

#### `/admin/dashboard-marketing` - Marketing Dashboard
```typescript
Route Configuration:
- Element: MarketingDashboard
- Protection: ProtectedAdminRoute
- Provider: BunduiPremiumProvider
- Category: Business
```

**Key Features:**
- Campaign performance metrics
- Social media analytics
- Conversion tracking
- A/B testing results
- Marketing ROI calculation

**API Integration:**
```typescript
GET /api/marketing/campaigns
GET /api/marketing/social-stats
GET /api/marketing/conversions
GET /api/marketing/ab-tests
GET /api/marketing/roi
```

### Specialized Dashboards

#### `/admin/company-dashboard` - Company Dashboard
```typescript
Route Configuration:
- Element: CompanyDashboard
- Protection: ProtectedAdminRoute
- Provider: BunduiPremiumProvider
- Purpose: Enterprise-focused dashboard
```

**Key Features:**
- Company-wide metrics
- Department analytics
- Team performance tracking
- Resource allocation
- Compliance monitoring

**API Integration:**
```typescript
GET /api/company/metrics
GET /api/company/departments
GET /api/company/teams
GET /api/company/resources
GET /api/company/compliance
```

#### `/admin/super-admin` - Super Admin Dashboard
```typescript
Route Configuration:
- Element: SuperAdminDashboard
- Protection: ProtectedAdminRoute + PremiumRoute
- Provider: BunduiPremiumProvider
- Purpose: System administration
```

**Key Features:**
- System monitoring and health
- User administration
- Global settings management
- Audit log viewing
- System maintenance tools

**API Integration:**
```typescript
GET /api/system/health
GET /api/system/users
GET /api/system/settings
GET /api/system/audit-logs
POST /api/system/maintenance
```

---

## Security & Access Control

### Role-Based Access Matrix

| Route Category | USER | ADMIN | OWNER | SUPER_ADMIN |
|----------------|------|-------|-------|-------------|
| Authentication | ✅ | ✅ | ✅ | ✅ |
| Test Routes | ❌ | ✅ | ✅ | ✅ |
| Main Dashboards | ❌ | ✅ | ✅ | ✅ |
| Dashboard Variants | ❌ | ✅ | ✅ | ✅ |
| Company Dashboard | ❌ | ✅ | ✅ | ✅ |
| Premium Features | ❌ | ❌ | ✅ | ✅ |
| Super Admin | ❌ | ❌ | ❌ | ✅ |

### Permission System

#### ProtectedAdminRoute Logic
```typescript
const isAdmin = user?.profile?.role === "ADMIN" || 
                user?.profile?.role === "OWNER" || 
                user?.profile?.role === "SUPER_ADMIN";
```

#### PremiumRoute Logic
```typescript
const isPremium = user?.profile?.role === "OWNER" || 
                 user?.profile?.role === "SUPER_ADMIN";
```

### Session Management

**Authentication Flow:**
1. User logs in via `/admin/login`
2. JWT token stored in localStorage/httpOnly cookie
3. Token validated on each protected route access
4. Automatic refresh before expiration
5. Logout clears all authentication data

**Security Headers:**
```typescript
// Recommended security headers
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}
```

---

## Component Dependencies

### Core Dependencies
```typescript
// Required for all routes
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/hooks/useAuth';

// Required for premium routes
import { BunduiPremiumProvider } from '@/shared/components/bundui-premium/BunduiPremiumProvider';

// Required for protected routes
// ProtectedAdminRoute (defined in AdminRouter.tsx)
// PremiumRoute (defined in AdminRouter.tsx)
```

### Component Import Map
```typescript
// Authentication
import AdminLoginShadcn from './components/AdminLoginShadcn';

// Layout
import AdminLayout from './components/AdminLayout';

// Main Dashboards
import CleanDashboard from './components/CleanDashboard';
import BunduiPremiumDashboard from './components/BunduiPremiumDashboard';

// Dashboard Variants
import DefaultDashboard from './components/DefaultDashboard';
import EcommerceDashboard from './components/EcommerceDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CRMDashboard from './components/CRMDashboard';
import FinanceDashboard from './components/FinanceDashboard';
import MarketingDashboard from './components/MarketingDashboard';

// Specialized
import CompanyDashboard from './components/CompanyDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

// Navigation
import DashboardVariationsPage from './components/DashboardVariationsPage';
import DashboardNavigator from './components/DashboardNavigator';

// Test Components
import TestDashboard from './components/TestDashboard';
import TestBunduiExplorer from './components/TestBunduiExplorer';
import BasicTest from './components/BasicTest';
import EmergencyTest from './components/EmergencyTest';
import PremiumTestPageEnhanced from './components/PremiumTestPageEnhanced';
```

---

## API Integration Points

### Authentication Endpoints
```typescript
// Login
POST /api/auth/admin/login
Body: { email: string, password: string }
Response: { token: string, user: User }

// Logout
POST /api/auth/logout
Headers: { Authorization: "Bearer {token}" }

// Refresh Token
POST /api/auth/refresh
Body: { refreshToken: string }
Response: { token: string, refreshToken: string }

// User Profile
GET /api/auth/me
Headers: { Authorization: "Bearer {token}" }
Response: { user: User }
```

### Dashboard Data Endpoints
```typescript
// General dashboard stats
GET /api/admin/dashboard/stats
Response: {
  totalUsers: number,
  activeUsers: number,
  revenue: number,
  growth: number
}

// User management
GET /api/admin/users?page=1&limit=10
GET /api/admin/users/:id
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

// Analytics data
GET /api/analytics/overview?timeRange=30d
GET /api/analytics/reports
GET /api/analytics/metrics/:metric?timeRange=7d

// CRM data
GET /api/crm/customers
GET /api/crm/leads
GET /api/crm/activities
GET /api/crm/pipeline

// Finance data
GET /api/finance/revenue?period=monthly
GET /api/finance/expenses
GET /api/finance/budgets
GET /api/finance/transactions

// Marketing data
GET /api/marketing/campaigns
GET /api/marketing/conversions
GET /api/marketing/ab-tests
```

### Error Handling
```typescript
// Standard error response format
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}

// Common error codes
- AUTH_REQUIRED: 401
- INSUFFICIENT_PERMISSIONS: 403
- RESOURCE_NOT_FOUND: 404
- VALIDATION_ERROR: 422
- SERVER_ERROR: 500
```

---

## Performance Optimization

### Route-Level Optimizations

#### Lazy Loading Implementation
```typescript
// For large dashboard components
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));

<Route 
  path="/dashboard-analytics" 
  element={
    <Suspense fallback={<DashboardSkeleton />}>
      <ProtectedAdminRoute>
        <BunduiPremiumProvider>
          <AnalyticsDashboard />
        </BunduiPremiumProvider>
      </ProtectedAdminRoute>
    </Suspense>
  } 
/>
```

#### Code Splitting Strategy
```typescript
// Bundle splitting configuration
{
  'admin-auth': ['./src/apps/admin/components/AdminLoginShadcn.tsx'],
  'admin-dashboards': ['./src/apps/admin/components/dashboards/'],
  'admin-variants': ['./src/apps/admin/components/variants/'],
  'bundui-premium': ['@/shared/components/bundui-premium']
}
```

### Caching Strategy
```typescript
// Route-level caching
- Dashboard data: 5 minutes
- User data: 15 minutes
- Analytics data: 1 hour
- Static resources: 24 hours
```

---

## Testing Strategy

### Route Testing
```typescript
// Test authentication flows
describe('AdminRouter Authentication', () => {
  test('redirects to login when not authenticated', () => {
    // Test implementation
  });
  
  test('allows access to admin routes when authenticated', () => {
    // Test implementation
  });
});

// Test role-based access
describe('Role-based Access Control', () => {
  test('ADMIN role can access standard dashboards', () => {
    // Test implementation
  });
  
  test('OWNER role can access premium features', () => {
    // Test implementation
  });
});
```

### Integration Testing
```typescript
// Test API integration
describe('Dashboard API Integration', () => {
  test('loads dashboard data correctly', () => {
    // Test implementation
  });
  
  test('handles API errors gracefully', () => {
    // Test implementation
  });
});
```

---

## Monitoring & Analytics

### Route Analytics
Track usage of different routes:
- Most accessed dashboards
- User journey patterns
- Route performance metrics
- Error rates by route

### Performance Metrics
Monitor key performance indicators:
- Route load times
- Component render times
- API response times
- Bundle sizes

---

This comprehensive route mapping provides complete documentation for all AdminRouter functionality, serving as both a reference guide and implementation manual for developers working with the system.

*Last updated: January 2025*
*Version: 1.0*
