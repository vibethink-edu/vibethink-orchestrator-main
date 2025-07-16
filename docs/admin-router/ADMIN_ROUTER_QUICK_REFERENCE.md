# AdminRouter Quick Reference

## 🚀 Quick Start Checklist

### For New Developers
- [ ] Review role hierarchy: USER < ADMIN < OWNER < SUPER_ADMIN
- [ ] Understand protection layers: ProtectedAdminRoute + PremiumRoute
- [ ] Check useAuth hook integration
- [ ] Test with debug routes first

### For Adding New Routes
- [ ] Create component in `/components/`
- [ ] Add route in AdminRouter.tsx
- [ ] Wrap with appropriate protection
- [ ] Add to DashboardNavigator (optional)
- [ ] Test with different user roles

---

## 🔑 Authentication & Roles

### User Roles (Ascending Order)
```
USER        → No admin access
ADMIN       → Standard admin features
OWNER       → Premium features + admin
SUPER_ADMIN → Full system access
```

### Protection Components
```typescript
<ProtectedAdminRoute>     // Requires ADMIN+ role
<PremiumRoute>           // Requires OWNER+ role
```

---

## 🛣️ Route Quick Reference

### Essential Routes
```
/admin/login                 # Authentication
/admin/dashboard            # Main admin dashboard
/admin/premium              # Premium dashboard
/admin/navigator            # Dashboard switcher
```

### Debug Routes (Development)
```
/admin/test                 # Protected route test
/admin/basic-test           # Component test
/admin/premium-test         # Premium component test
/admin/premium-test-enhanced # Advanced debugging
```

### Dashboard Variants
```
/admin/dashboard-default    # Business dashboard
/admin/dashboard-analytics  # Analytics & reports
/admin/dashboard-crm        # Customer management
/admin/dashboard-finance    # Financial metrics
/admin/dashboard-marketing  # Marketing analytics
/admin/dashboard-ecommerce  # E-commerce focus
```

### Specialized
```
/admin/company-dashboard    # Enterprise dashboard
/admin/super-admin          # System administration
```

---

## 🔒 Security Patterns

### Standard Route Pattern
```typescript
<Route 
  path="/your-route" 
  element={
    <ProtectedAdminRoute>
      <YourComponent />
    </ProtectedAdminRoute>
  } 
/>
```

### Premium Route Pattern
```typescript
<Route 
  path="/premium-route" 
  element={
    <ProtectedAdminRoute>
      <PremiumRoute>
        <BunduiPremiumProvider>
          <YourPremiumComponent />
        </BunduiPremiumProvider>
      </PremiumRoute>
    </ProtectedAdminRoute>
  } 
/>
```

### Check User Role
```typescript
const { user } = useAuth();
const isAdmin = user?.profile?.role === "ADMIN";
const isOwner = user?.profile?.role === "OWNER";
const isSuperAdmin = user?.profile?.role === "SUPER_ADMIN";
```

---

## 🧩 Component Templates

### Basic Dashboard Component
```typescript
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';

const MyDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Widget Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Widget content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyDashboard;
```

### Dashboard with Data Loading
```typescript
import React, { useState, useEffect } from 'react';

const DataDashboard: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/dashboard-data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Dashboard content */}
    </div>
  );
};
```

---

## 🐛 Debug & Testing

### Test User Authentication
```typescript
// Add to any component for debugging
const { user, isAuthenticated } = useAuth();
console.log('Auth State:', { user, isAuthenticated });
console.log('User Role:', user?.profile?.role);
```

### Test Routes by Role

| Route | USER | ADMIN | OWNER | SUPER_ADMIN |
|-------|------|-------|-------|-------------|
| `/admin/test` | ❌ | ✅ | ✅ | ✅ |
| `/admin/dashboard` | ❌ | ✅ | ✅ | ✅ |
| `/admin/premium` | ❌ | ❌ | ✅ | ✅ |
| `/admin/super-admin` | ❌ | ❌ | ❌ | ✅ |

### Debug Routes Order
1. Start with `/admin/basic-test` (no auth required)
2. Test `/admin/test` (requires admin auth)
3. Try `/admin/premium-test` (tests premium components)
4. Use `/admin/premium-test-enhanced` for detailed debugging

---

## 📱 Navigation Integration

### Add to DashboardNavigator
```typescript
// In DashboardNavigator.tsx dashboardOptions array
{
  id: 'my-dashboard',
  name: 'My Dashboard',
  description: 'Description of dashboard',
  path: '/admin/my-dashboard',
  icon: <MyIcon className="h-4 w-4" />,
  status: 'active', // 'active' | 'beta' | 'coming-soon'
  category: 'business' // 'business' | 'ecommerce' | 'admin' | 'analytics'
}
```

### Navigation Categories
- **business**: Standard business functions
- **ecommerce**: E-commerce specific
- **analytics**: Data analysis focused
- **admin**: System administration

---

## 🔧 Common Tasks

### Add New Dashboard
1. Create component: `src/apps/admin/components/MyDashboard.tsx`
2. Add import: `import MyDashboard from './components/MyDashboard';`
3. Add route in AdminRouter.tsx
4. Test with appropriate user role

### Change Route Access Level
```typescript
// Standard admin access
<ProtectedAdminRoute>

// Premium access only
<ProtectedAdminRoute>
  <PremiumRoute>

// No protection (testing only)
// No wrapper needed
```

### Handle Loading States
```typescript
const [loading, setLoading] = useState(true);

if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

---

## 🚨 Common Issues & Solutions

### Authentication Loop
**Problem**: Redirects between login and dashboard
**Solution**: Check useAuth hook and token persistence

### "Access Restricted" Message
**Problem**: User can't access admin routes
**Solution**: Verify user.profile.role is ADMIN, OWNER, or SUPER_ADMIN

### Component Not Rendering
**Problem**: Dashboard shows blank or errors
**Solution**: 
1. Check component imports
2. Verify BunduiPremiumProvider wrapping
3. Use `/admin/basic-test` to isolate issues

### Premium Access Denied
**Problem**: Can't access premium features
**Solution**: Ensure user role is OWNER or SUPER_ADMIN

---

## 📊 Performance Tips

### Optimize Large Dashboards
```typescript
// Use React.memo for expensive components
const MyDashboard = React.memo(() => {
  // Component logic
});

// Lazy load heavy components
const HeavyDashboard = React.lazy(() => import('./HeavyDashboard'));
```

### Optimize API Calls
```typescript
// Use proper dependency arrays
useEffect(() => {
  loadData();
}, [userId]); // Only reload when userId changes

// Implement proper cleanup
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(handleData);
    
  return () => controller.abort();
}, []);
```

---

## 📚 Essential Files

### Core Files
- `src/apps/admin/AdminRouter.tsx` - Main routing configuration
- `src/apps/admin/components/DashboardNavigator.tsx` - Navigation dropdown
- `src/shared/hooks/useAuth.tsx` - Authentication hook

### Component Locations
- **Dashboards**: `src/apps/admin/components/`
- **Authentication**: `src/apps/admin/components/AdminLoginShadcn.tsx`
- **Layout**: `src/apps/admin/components/AdminLayout.tsx`

### Documentation
- `docs/ADMIN_ROUTER_COMPLETE_DOCUMENTATION.md` - Complete system docs
- `docs/ADMIN_ROUTER_TECHNICAL_GUIDE.md` - Technical implementation
- `docs/ADMIN_ROUTER_ROUTE_MAPPING.md` - Route reference

---

## 🆘 Need Help?

### Debug Checklist
- [ ] Check user authentication state
- [ ] Verify user role assignment
- [ ] Test with debug routes
- [ ] Check browser console for errors
- [ ] Verify component imports

### Escalation Path
1. Use debug routes for initial troubleshooting
2. Check authentication state and user roles
3. Review console errors and network requests
4. Consult detailed documentation
5. Contact development team

---

*Keep this reference handy while working with AdminRouter!*
*Last updated: January 2025*
