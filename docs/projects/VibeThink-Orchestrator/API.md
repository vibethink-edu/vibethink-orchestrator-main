
# API Documentation

## Introducción

Esta documentación describe las APIs disponibles en el Sistema de Gestión Empresarial, incluyendo endpoints internos, integración con Supabase y futuros endpoints públicos.

## Arquitectura API

### Supabase Integration
- **Base URL**: `https://pikywaoqlekupfynnclg.supabase.co`
- **Authentication**: JWT tokens via Supabase Auth
- **Database**: PostgreSQL con Row Level Security (RLS)
- **Real-time**: WebSocket subscriptions disponibles

### Endpoints Actuales

#### Authentication
```typescript
// Login (Mock)
POST /auth/login
Content-Type: application/json
{
  "email": "string",
  "password": "string"
}

Response: {
  "user": User,
  "token": "string"
}
```

#### User Management
```typescript
// Get current user
GET /auth/user
Authorization: Bearer <token>

Response: {
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "EMPLOYEE | MANAGER | ADMIN | OWNER",
  "department": "string"
}
```

### Futuros Endpoints (Planeados)

#### Users API (v0.3.0)
```typescript
// List users
GET /api/users
Authorization: Bearer <token>
Query: ?limit=10&offset=0&role=ADMIN&department=IT

// Create user
POST /api/users
Content-Type: application/json
{
  "name": "string",
  "email": "string",
  "role": "EMPLOYEE | MANAGER | ADMIN | OWNER",
  "department": "string"
}

// Update user
PUT /api/users/:id
Content-Type: application/json
{
  "name": "string",
  "role": "EMPLOYEE | MANAGER | ADMIN | OWNER",
  "department": "string"
}

// Delete user
DELETE /api/users/:id
```

#### Permissions API (v0.4.0)
```typescript
// Get user permissions
GET /api/users/:id/permissions

// Assign permission
POST /api/users/:id/permissions
{
  "module": "string",
  "action": "read | write | delete | admin",
  "granted": boolean
}

// List role permissions
GET /api/roles/:role/permissions
```

#### Analytics API (v0.5.0)
```typescript
// Dashboard metrics
GET /api/analytics/dashboard
Query: ?period=30d&department=IT

// User activity
GET /api/analytics/users/:id/activity
Query: ?from=2025-01-01&to=2025-01-31

// System usage
GET /api/analytics/usage
Query: ?granularity=day&metric=active_users
```

## Esquemas de Datos

### User Schema
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER';
  department: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}
```

### Permission Schema
```typescript
interface Permission {
  id: string;
  user_id: string;
  module: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  granted: boolean;
  granted_by: string;
  granted_at: string;
}
```

### Activity Schema
```typescript
interface Activity {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
```

## Autenticación y Autorización

### JWT Tokens
```typescript
// Token structure
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Role Hierarchy
1. **EMPLOYEE** (Level 1): Acceso básico
2. **MANAGER** (Level 2): Gestión de equipo
3. **ADMIN** (Level 3): Administración completa
4. **OWNER** (Level 4): Control total

### Headers Requeridos
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Version: v1
```

## Error Handling

### Códigos de Estado
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Formato de Errores
```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Rate Limiting

### Límites por Endpoint
- Authentication: 5 requests/min
- User operations: 100 requests/min
- Analytics: 50 requests/min
- General API: 1000 requests/hour

### Headers de Rate Limit
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Supabase APIs

### Database API
```typescript
// Direct table access
import { supabase } from '@/integrations/supabase/client';

// Select with RLS
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('department', 'IT');

// Insert with validation
const { data, error } = await supabase
  .from('users')
  .insert([
    { name: 'John Doe', email: 'john@example.com', role: 'EMPLOYEE' }
  ]);
```

### Real-time Subscriptions
```typescript
// Listen to table changes
const subscription = supabase
  .channel('users')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'users' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe();
```

### Storage API
```typescript
// File upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file);

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`);
```

## SDK y Clients

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pikywaoqlekupfynnclg.supabase.co',
  'your-anon-key'
);
```

### React Query Integration
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch users
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      if (error) throw error;
      return data;
    }
  });
};

// Create user mutation
const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData]);
      if (error) throw error;
      return data;
    }
  });
};
```

## Testing

### API Testing
```typescript
// Jest + Supertest example
describe('Users API', () => {
  test('GET /api/users should return users list', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### Mock Data
```typescript
// Test fixtures
export const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test User',
  email: 'test@example.com',
  role: 'EMPLOYEE',
  department: 'Engineering',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  is_active: true
};
```

## Changelog

### v1.0.0 (Current)
- ✅ Mock authentication API
- ✅ Supabase client configuration
- ✅ Basic user management structure

### v1.1.0 (Planned)
- 🔄 Real Supabase authentication
- 🔄 User CRUD operations
- 🔄 Role-based permissions

### v1.2.0 (Future)
- 📋 Public REST API
- 📋 Rate limiting
- 📋 API documentation portal

---

**Última actualización**: Enero 2025  
**Versión de API**: v1.0.0  
**Status**: En desarrollo
