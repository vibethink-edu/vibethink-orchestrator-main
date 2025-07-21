# Endpoints Overview

Vista general de todos los endpoints disponibles en las APIs de VThink.

## 🔐 Autenticación

Todos los endpoints requieren autenticación excepto los marcados como públicos.

### Headers Requeridos
```http
Authorization: Bearer <your-token>
Content-Type: application/json
X-API-Version: 2.1
```

## 📊 Base URLs

| Ambiente | URL Base |
|----------|----------|
| Producción | `https://api.vthink.com/v2` |
| Staging | `https://staging-api.vthink.com/v2` |
| Desarrollo | `https://dev-api.vthink.com/v2` |

## 🔗 Endpoints por Categoría

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/refresh` | Renovar token |
| `POST` | `/auth/logout` | Cerrar sesión |
| `POST` | `/auth/forgot-password` | Recuperar contraseña |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/users/me` | Obtener perfil actual |
| `PUT` | `/users/me` | Actualizar perfil |
| `GET` | `/users/{id}` | Obtener usuario por ID |
| `PUT` | `/users/{id}` | Actualizar usuario |
| `DELETE` | `/users/{id}` | Eliminar usuario |

### Empresas (Multi-tenant)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/companies/me` | Obtener empresa actual |
| `PUT` | `/companies/me` | Actualizar empresa |
| `GET` | `/companies/{id}` | Obtener empresa por ID |
| `POST` | `/companies` | Crear empresa |
| `DELETE` | `/companies/{id}` | Eliminar empresa |

### Contenido
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/content/pages` | Listar páginas |
| `POST` | `/content/pages` | Crear página |
| `GET` | `/content/pages/{id}` | Obtener página |
| `PUT` | `/content/pages/{id}` | Actualizar página |
| `DELETE` | `/content/pages/{id}` | Eliminar página |

### IA
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/ai/chat` | Chat con IA |
| `POST` | `/ai/analyze` | Análisis de contenido |
| `POST` | `/ai/generate` | Generación de contenido |
| `GET` | `/ai/models` | Listar modelos disponibles |

## 📈 Rate Limiting

| Plan | Requests/min | Burst |
|------|-------------|-------|
| Free | 60 | 100 |
| Pro | 300 | 500 |
| Enterprise | 1000 | 2000 |

### Headers de Rate Limiting
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
```

## 🔄 Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Recurso no encontrado |
| `429` | Too Many Requests - Rate limit |
| `500` | Internal Server Error |

## 📝 Ejemplo de Respuesta

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## 🛡️ Seguridad

### Autenticación
- **JWT Tokens**: Tokens de acceso con expiración
- **Refresh Tokens**: Renovación automática de tokens
- **API Keys**: Para integraciones de servidor

### Autorización
- **Roles**: EMPLOYEE, MANAGER, ADMIN, OWNER, SUPER_ADMIN
- **Permisos**: Control granular por recurso
- **Multi-tenant**: Aislamiento por empresa

### Validación
- **Input Sanitization**: Limpieza de datos de entrada
- **Schema Validation**: Validación de esquemas JSON
- **Rate Limiting**: Protección contra abuso

## 🔧 SDKs y Herramientas

### SDKs Oficiales
- [JavaScript/TypeScript](../api/sdks/javascript.md)
- [Python](../api/sdks/python.md)
- [PHP](../api/sdks/php.md)
- [Java](../api/sdks/java.md)

### Herramientas
- [Postman Collection](../api/postman-collection.md)
- [OpenAPI Spec](../api/openapi-spec.md)
- [cURL Examples](../examples/curl.md)

---

**Próximo paso**: [Autenticación](../api/authentication.md) 