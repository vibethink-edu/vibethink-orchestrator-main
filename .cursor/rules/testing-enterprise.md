# Enterprise Testing Rules - XTP v4.6

## 🧪 **Testing Strategy Overview**

### **Testing Pyramid**
```
    E2E Tests (10%)
   ┌─────────────┐
   │ Integration │ (20%)
   │    Tests    │
   └─────────────┘
  ┌─────────────────┐
  │   Unit Tests    │ (70%)
  │                 │
  └─────────────────┘
```

### **Test Categories**
```typescript
const testCategories = {
  unit: "Individual functions and components",
  integration: "API interactions and data flow",
  e2e: "Complete user workflows",
  security: "Multi-tenant isolation and permissions",
  performance: "Load time and resource usage",
  accessibility: "WCAG 2.1 AA compliance"
};
```

## 🔒 **Security Testing - Multi-tenant**

### **Company Isolation Tests**
```typescript
describe('Multi-tenant Security', () => {
  it('should not access cross-company data', async () => {
    const company1User = createTestUser({ 
      company_id: 'company1',
      role: 'ADMIN' 
    });
    
    const company2Data = await fetchCompanyData(company1User, 'company2');
    expect(company2Data).toBeNull();
  });

  it('should enforce RLS policies', async () => {
    const user = createTestUser({ company_id: 'company1' });
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', user.company_id);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should validate company_id in all queries', async () => {
    const queries = [
      'SELECT * FROM users',
      'SELECT * FROM companies',
      'SELECT * FROM projects'
    ];
    
    queries.forEach(query => {
      expect(query).toContain('company_id');
    });
  });
});
```

### **Role-based Access Tests**
```typescript
describe('Role-based Access Control', () => {
  const roles = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'OWNER', 'SUPER_ADMIN'];
  
  roles.forEach(role => {
    it(`should respect ${role} permissions`, () => {
      const user = createTestUser({ role });
      const permissions = getUserPermissions(user);
      
      expect(permissions).toMatchRoleExpectations(role);
    });
  });

  it('should deny unauthorized access', () => {
    const employee = createTestUser({ role: 'EMPLOYEE' });
    const canAccessAdmin = hasPermission(employee, 'ADMIN');
    
    expect(canAccessAdmin).toBe(false);
  });

  it('should allow authorized access', () => {
    const admin = createTestUser({ role: 'ADMIN' });
    const canAccessAdmin = hasPermission(admin, 'ADMIN');
    
    expect(canAccessAdmin).toBe(true);
  });
});
```

## 🧩 **Component Testing**

### **React Component Tests**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserManagement } from '@/apps/admin/components/UserManagement';

describe('UserManagement Component', () => {
  const mockUser = {
    id: 'user1',
    company_id: 'company1',
    role: 'ADMIN',
    email: 'admin@company1.com'
  };

  it('should render user management interface', () => {
    render(<UserManagement user={mockUser} />);
    
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should filter users by company', async () => {
    render(<UserManagement user={mockUser} />);
    
    const userRows = await screen.findAllByTestId('user-row');
    userRows.forEach(row => {
      expect(row).toHaveAttribute('data-company-id', 'company1');
    });
  });

  it('should handle permission checks', () => {
    const employee = { ...mockUser, role: 'EMPLOYEE' };
    render(<UserManagement user={employee} />);
    
    expect(screen.queryByText('Add User')).not.toBeInTheDocument();
  });
});
```

### **Hook Testing**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/shared/hooks/useAuth';

describe('useAuth Hook', () => {
  it('should provide user authentication state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBeDefined();
    expect(result.current.hasPermission).toBeDefined();
  });

  it('should validate permissions correctly', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login(mockUser);
    });
    
    expect(result.current.hasPermission('ADMIN')).toBe(true);
    expect(result.current.hasPermission('SUPER_ADMIN')).toBe(false);
  });
});
```

## 🔄 **Integration Testing**

### **API Integration Tests**
```typescript
describe('API Integration', () => {
  it('should handle user CRUD operations', async () => {
    const newUser = {
      email: 'test@company1.com',
      role: 'EMPLOYEE',
      company_id: 'company1'
    };

    // Create
    const createdUser = await createUser(newUser);
    expect(createdUser.id).toBeDefined();

    // Read
    const fetchedUser = await getUser(createdUser.id);
    expect(fetchedUser.email).toBe(newUser.email);

    // Update
    const updatedUser = await updateUser(createdUser.id, { role: 'MANAGER' });
    expect(updatedUser.role).toBe('MANAGER');

    // Delete
    await deleteUser(createdUser.id);
    const deletedUser = await getUser(createdUser.id);
    expect(deletedUser).toBeNull();
  });

  it('should handle error scenarios', async () => {
    // Test invalid company_id
    await expect(createUser({ company_id: 'invalid' }))
      .rejects.toThrow('Invalid company');

    // Test unauthorized access
    await expect(accessAdminPanel('EMPLOYEE'))
      .rejects.toThrow('Access denied');
  });
});
```

## 🚀 **E2E Testing**

### **User Workflow Tests**
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Management E2E', () => {
  test('should complete user management workflow', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@company1.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    // Navigate to user management
    await page.click('[data-testid="admin-menu"]');
    await page.click('[data-testid="user-management"]');

    // Create new user
    await page.click('[data-testid="add-user-button"]');
    await page.fill('[data-testid="user-email"]', 'newuser@company1.com');
    await page.selectOption('[data-testid="user-role"]', 'EMPLOYEE');
    await page.click('[data-testid="save-user"]');

    // Verify user created
    await expect(page.locator('text=newuser@company1.com')).toBeVisible();
  });

  test('should enforce company isolation', async ({ page }) => {
    // Login as company1 admin
    await loginAsAdmin(page, 'company1');
    
    // Try to access company2 data
    await page.goto('/admin/companies/company2/users');
    
    // Should be denied access
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});
```

## 📊 **Performance Testing**

### **Load Testing**
```typescript
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function () {
  const response = http.get('https://api.company.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
}
```

### **Bundle Size Testing**
```typescript
describe('Bundle Size', () => {
  it('should maintain acceptable bundle sizes', () => {
    const bundleSizes = {
      main: '2.5MB',
      admin: '1.8MB',
      dashboard: '2.1MB',
      shared: '500KB'
    };

    Object.entries(bundleSizes).forEach(([name, size]) => {
      const sizeInKB = parseFloat(size) * 1024;
      expect(sizeInKB).toBeLessThan(3000); // Max 3MB
    });
  });
});
```

## ♿ **Accessibility Testing**

### **WCAG 2.1 AA Compliance**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should meet WCAG 2.1 AA standards', async () => {
    const { container } = render(<UserManagement />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels', () => {
    render(<UserManagement />);
    
    expect(screen.getByLabelText('User email')).toBeInTheDocument();
    expect(screen.getByLabelText('User role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    render(<UserManagement />);
    
    // Tab through all interactive elements
    const interactiveElements = screen.getAllByRole('button', 'input', 'select');
    
    for (const element of interactiveElements) {
      element.focus();
      expect(element).toHaveFocus();
    }
  });
});
```

## 🚫 **Testing Anti-Patterns**

### **What NOT to do**
```typescript
// ❌ NEVER do this:
// Test implementation details instead of behavior
// Mock everything instead of testing real integrations
// Skip security tests for convenience
// Ignore accessibility testing
// Test only happy paths
// Use hardcoded test data
// Skip performance testing
```

### **Best Practices**
```typescript
// ✅ ALWAYS do this:
// Test user behavior and business logic
// Use realistic test data
// Test error scenarios and edge cases
// Include security and accessibility tests
// Test performance and bundle size
// Use descriptive test names
// Keep tests maintainable and readable
```

---

**Follow these rules to ensure comprehensive and reliable testing coverage.**
