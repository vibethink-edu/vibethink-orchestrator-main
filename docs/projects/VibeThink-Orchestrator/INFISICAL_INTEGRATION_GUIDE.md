# Guía de Integración de Infisical - Gestión Centralizada de Secretos

**Versión:** 1.0  
**Fecha:** 2024-06-20  
**Estado:** Documentación Activa

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura de Integración](#arquitectura-de-integración)
3. [Configuración de Infraestructura](#configuración-de-infraestructura)
4. [Casos de Uso por Servicio](#casos-de-uso-por-servicio)
5. [Flujos de Trabajo de Seguridad](#flujos-de-trabajo-de-seguridad)
6. [Guía de Desarrollo](#guía-de-desarrollo)
7. [Operaciones y Mantenimiento](#operaciones-y-mantenimiento)
8. [Migración desde Archivos .env](#migración-desde-archivos-env)
9. [Troubleshooting](#troubleshooting)

---

## Visión General

Infisical es nuestro **Gestor de Secretos Centralizado** que reemplaza todos los archivos `.env` y mecanismos de gestión de credenciales dispersos. Proporciona:

- **Almacenamiento seguro** de todas las credenciales
- **Distribución automática** a servicios autorizados
- **Auditoría completa** de acceso a secretos
- **Rotación automática** de credenciales
- **Integración nativa** con nuestro stack de desarrollo

### Beneficios Inmediatos

✅ **Eliminación de archivos `.env`** en el código  
✅ **Gestión centralizada** de credenciales  
✅ **Auditoría automática** de acceso  
✅ **Rotación de secretos** sin downtime  
✅ **Separación de entornos** (dev/staging/prod)  
✅ **Acceso granular** por servicio y rol  

---

## Arquitectura de Integración

### Diagrama de Flujo

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FusionAuth    │    │    Infisical    │    │   Servicios     │
│   (Identidad)   │    │   (Secretos)    │    │   (Aplicación)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Autenticación      │                       │
         │──────────────────────▶│                       │
         │                       │ 2. Solicitud Secretos │
         │                       │◀──────────────────────│
         │                       │ 3. Entrega Segura     │
         │                       │──────────────────────▶│
```

### Separación de Responsabilidades

| Componente | Responsabilidad | Ejemplo |
|------------|----------------|---------|
| **FusionAuth** | "¿Quién eres y qué permisos tienes?" | Usuario autenticado con rol ADMIN |
| **Infisical** | "Aquí están las credenciales que necesitas" | Entrega API_KEY de Resend al servicio autorizado |

---

## Configuración de Infraestructura

### Fase 1: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Infisical como servicio central
  infisical:
    image: infisical/infisical:latest
    container_name: infisical
    ports:
      - "8080:8080"  # UI Web
      - "8081:8081"  # API
    environment:
      - INFISICAL_DB_URL=postgresql://postgres:password@postgres:5432/infisical
      - INFISICAL_JWT_SECRET=${JWT_SECRET}
      - INFISICAL_ENCRYPTION_KEY=${ENCRYPTION_KEY}
    volumes:
      - infisical_data:/app/data
    depends_on:
      - postgres
    networks:
      - app-network

  # Base de datos para Infisical
  postgres:
    image: postgres:15
    container_name: infisical-postgres
    environment:
      - POSTGRES_DB=infisical
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  # Nuestro backend usando secretos de Infisical
  backend:
    image: our-backend:latest
    container_name: backend
    environment:
      - INFISICAL_URL=http://infisical:8081
      - INFISICAL_TOKEN=${BACKEND_INFISICAL_TOKEN}
    depends_on:
      - infisical
    networks:
      - app-network

volumes:
  infisical_data:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Fase 2: Kubernetes

```yaml
# k8s/infisical-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infisical
  namespace: security
spec:
  replicas: 1
  selector:
    matchLabels:
      app: infisical
  template:
    metadata:
      labels:
        app: infisical
    spec:
      containers:
      - name: infisical
        image: infisical/infisical:latest
        ports:
        - containerPort: 8080
        - containerPort: 8081
        env:
        - name: INFISICAL_DB_URL
          valueFrom:
            secretKeyRef:
              name: infisical-secrets
              key: database-url
        - name: INFISICAL_JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: infisical-secrets
              key: jwt-secret
        volumeMounts:
        - name: infisical-data
          mountPath: /app/data
      volumes:
      - name: infisical-data
        persistentVolumeClaim:
          claimName: infisical-pvc
```

---

## Casos de Uso por Servicio

### 1. Servicio de Email (Resend)

**Problema:** El servicio de email necesita la API key de Resend para enviar notificaciones.

**Solución con Infisical:**

```typescript
// services/emailService.ts
import { InfisicalClient } from '@infisical/node';

class EmailService {
  private infisical: InfisicalClient;
  private resendApiKey: string;

  constructor() {
    this.infisical = new InfisicalClient({
      token: process.env.INFISICAL_TOKEN,
      siteUrl: process.env.INFISICAL_URL
    });
  }

  async initialize() {
    // Obtener API key de Resend de forma segura
    const secret = await this.infisical.getSecret({
      secretName: 'RESEND_API_KEY',
      environment: process.env.NODE_ENV || 'development'
    });
    
    this.resendApiKey = secret.secretValue;
  }

  async sendEmail(to: string, subject: string, content: string) {
    // Usar la API key obtenida de Infisical
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, subject, html: content })
    });
    
    return response.json();
  }
}
```

### 2. Base de Datos (Supabase)

**Problema:** Cada servicio necesita credenciales de base de datos específicas.

**Solución con Infisical:**

```typescript
// config/database.ts
import { InfisicalClient } from '@infisical/node';

export class DatabaseConfig {
  private infisical: InfisicalClient;

  constructor() {
    this.infisical = new InfisicalClient({
      token: process.env.INFISICAL_TOKEN,
      siteUrl: process.env.INFISICAL_URL
    });
  }

  async getSupabaseConfig() {
    const [url, anonKey, serviceKey] = await Promise.all([
      this.infisical.getSecret({ secretName: 'SUPABASE_URL' }),
      this.infisical.getSecret({ secretName: 'SUPABASE_ANON_KEY' }),
      this.infisical.getSecret({ secretName: 'SUPABASE_SERVICE_KEY' })
    ]);

    return {
      url: url.secretValue,
      anonKey: anonKey.secretValue,
      serviceKey: serviceKey.secretValue
    };
  }
}
```

### 3. Motor de Flujos (Kestra)

**Problema:** Kestra necesita credenciales para ejecutar tareas en diferentes servicios.

**Solución con Infisical:**

```yaml
# kestra/flow-with-infisical.yaml
id: "email-notification-flow"
namespace: "notifications"

tasks:
  - id: "get-resend-key"
    type: "io.kestra.plugin.core.http.Request"
    uri: "{{ secret('INFISICAL_URL') }}/api/v3/secrets/RESEND_API_KEY"
    headers:
      Authorization: "Bearer {{ secret('INFISICAL_TOKEN') }}"
    method: "GET"

  - id: "send-email"
    type: "io.kestra.plugin.core.http.Request"
    uri: "https://api.resend.com/emails"
    headers:
      Authorization: "Bearer {{ outputs.get-resend-key.body.secretValue }}"
      Content-Type: "application/json"
    method: "POST"
    body: |
      {
        "to": "{{ inputs.recipient }}",
        "subject": "{{ inputs.subject }}",
        "html": "{{ inputs.content }}"
      }
```

### 4. Autenticación (FusionAuth)

**Problema:** FusionAuth necesita sus propias credenciales de base de datos y configuración.

**Solución con Infisical:**

```yaml
# fusionauth/config.yml
database:
  host: "{{ secret('FUSIONAUTH_DB_HOST') }}"
  port: "{{ secret('FUSIONAUTH_DB_PORT') }}"
  name: "{{ secret('FUSIONAUTH_DB_NAME') }}"
  user: "{{ secret('FUSIONAUTH_DB_USER') }}"
  password: "{{ secret('FUSIONAUTH_DB_PASSWORD') }}"

encryption:
  encryptionKey: "{{ secret('FUSIONAUTH_ENCRYPTION_KEY') }}"

jwt:
  accessTokenKeyId: "{{ secret('FUSIONAUTH_JWT_KEY_ID') }}"
  accessTokenKey: "{{ secret('FUSIONAUTH_JWT_KEY') }}"
```

### 5. AI Services (OpenAI, Firecrawl)

**Problema:** Los servicios de IA necesitan API keys costosas y sensibles.

**Solución con Infisical:**

```typescript
// services/aiService.ts
import { InfisicalClient } from '@infisical/node';

export class AIService {
  private infisical: InfisicalClient;
  private openaiKey: string;
  private firecrawlKey: string;

  constructor() {
    this.infisical = new InfisicalClient({
      token: process.env.INFISICAL_TOKEN,
      siteUrl: process.env.INFISICAL_URL
    });
  }

  async initialize() {
    const [openai, firecrawl] = await Promise.all([
      this.infisical.getSecret({ secretName: 'OPENAI_API_KEY' }),
      this.infisical.getSecret({ secretName: 'FIRECRAWL_API_KEY' })
    ]);

    this.openaiKey = openai.secretValue;
    this.firecrawlKey = firecrawl.secretValue;
  }

  async processWithAI(prompt: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    return response.json();
  }
}
```

---

## Flujos de Trabajo de Seguridad

### 1. Rotación de Credenciales

**Escenario:** Necesitamos cambiar la API key de Resend porque se comprometió.

**Proceso con Infisical:**

```bash
# 1. Generar nueva API key en Resend
# 2. Actualizar en Infisical (sin tocar código)
curl -X POST "http://localhost:8081/api/v3/secrets/RESEND_API_KEY" \
  -H "Authorization: Bearer $INFISICAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "secretName": "RESEND_API_KEY",
    "secretValue": "re_1234567890abcdef",
    "environment": "production"
  }'

# 3. Reiniciar servicios (automático con Docker)
docker-compose restart backend email-service
```

### 2. Auditoría de Acceso

**Escenario:** Queremos saber quién accedió a las credenciales de la base de datos.

**Consulta en Infisical:**

```sql
-- Logs de auditoría automáticos
SELECT 
  event_type,
  user_email,
  secret_name,
  ip_address,
  created_at
FROM audit_logs 
WHERE secret_name LIKE '%DATABASE%'
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### 3. Acceso Temporal

**Escenario:** Un desarrollador necesita acceso temporal a credenciales de producción para debugging.

**Proceso:**

```bash
# 1. Solicitar acceso temporal (90 minutos)
curl -X POST "http://localhost:8081/api/v3/access/temporary" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "developer@company.com",
    "environment": "production",
    "durationMinutes": 90,
    "secretNames": ["SUPABASE_SERVICE_KEY", "RESEND_API_KEY"]
  }'

# 2. El desarrollador recibe token temporal
# 3. Acceso se revoca automáticamente después de 90 minutos
```

---

## Guía de Desarrollo

### Configuración Local

```bash
# 1. Instalar CLI de Infisical
npm install -g @infisical/cli

# 2. Iniciar sesión
infisical login

# 3. Conectar al proyecto
infisical link

# 4. Obtener secretos para desarrollo local
infisical pull --env=development
```

### Integración en Código

```typescript
// hooks/useInfisical.ts
import { useState, useEffect } from 'react';
import { InfisicalClient } from '@infisical/node';

export function useInfisical(secretName: string) {
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const client = new InfisicalClient({
          token: process.env.REACT_APP_INFISICAL_TOKEN,
          siteUrl: process.env.REACT_APP_INFISICAL_URL
        });

        const result = await client.getSecret({
          secretName,
          environment: process.env.NODE_ENV || 'development'
        });

        setSecret(result.secretValue);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSecret();
  }, [secretName]);

  return { secret, loading, error };
}
```

### Testing con Secretos

```typescript
// tests/integration/emailService.test.ts
import { EmailService } from '../services/emailService';
import { mockInfisicalClient } from '../mocks/infisical';

jest.mock('@infisical/node', () => ({
  InfisicalClient: mockInfisicalClient
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    emailService = new EmailService();
    await emailService.initialize();
  });

  it('should send email using Resend API', async () => {
    const result = await emailService.sendEmail(
      'test@example.com',
      'Test Subject',
      'Test Content'
    );

    expect(result).toBeDefined();
  });
});
```

---

## Operaciones y Mantenimiento

### Backup de Secretos

```bash
# Backup automático de todos los secretos
infisical export --format=json --env=production > backup-$(date +%Y%m%d).json

# Restaurar desde backup
infisical import --file=backup-20240620.json
```

### Monitoreo

```yaml
# prometheus/infisical-metrics.yml
scrape_configs:
  - job_name: 'infisical'
    static_configs:
      - targets: ['infisical:8081']
    metrics_path: '/metrics'
    scrape_interval: 30s
```

### Alertas

```yaml
# grafana/alerts/infisical-alerts.yml
groups:
  - name: Infisical Alerts
    rules:
      - alert: InfisicalDown
        expr: up{job="infisical"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Infisical is down"
          
      - alert: HighSecretAccess
        expr: rate(secret_access_total[5m]) > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High rate of secret access"
```

---

## Migración desde Archivos .env

### Fase 1: Inventario

```bash
# Script para encontrar todos los archivos .env
find . -name ".env*" -type f > env-files-list.txt

# Analizar contenido (sin exponer secretos)
for file in $(cat env-files-list.txt); do
  echo "=== $file ==="
  grep -E "^[A-Z_]+=" "$file" | cut -d'=' -f1 | sort
done
```

### Fase 2: Migración Gradual

```typescript
// config/legacyEnvSupport.ts
export class LegacyEnvSupport {
  static getSecret(key: string): string {
    // 1. Intentar obtener de Infisical
    try {
      const infisicalValue = this.getFromInfisical(key);
      if (infisicalValue) return infisicalValue;
    } catch (error) {
      console.warn(`Infisical not available for ${key}, falling back to .env`);
    }

    // 2. Fallback a .env (temporal)
    const envValue = process.env[key];
    if (!envValue) {
      throw new Error(`Secret ${key} not found in Infisical or .env`);
    }

    return envValue;
  }

  private static getFromInfisical(key: string): string | null {
    // Implementación de Infisical
    return null; // Placeholder
  }
}
```

### Fase 3: Eliminación Completa

```bash
# Script para eliminar archivos .env después de migración
#!/bin/bash

echo "Verificando que todos los secretos estén en Infisical..."

# Lista de secretos requeridos
required_secrets=(
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "RESEND_API_KEY"
  "OPENAI_API_KEY"
  # ... más secretos
)

for secret in "${required_secrets[@]}"; do
  if ! infisical secret get "$secret" > /dev/null 2>&1; then
    echo "ERROR: Secret $secret not found in Infisical"
    exit 1
  fi
done

echo "Todos los secretos están en Infisical. Eliminando archivos .env..."
find . -name ".env*" -type f -delete
echo "Migración completada."
```

---

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión

```bash
# Verificar que Infisical esté corriendo
docker-compose ps infisical

# Verificar logs
docker-compose logs infisical

# Verificar conectividad
curl http://localhost:8081/health
```

#### 2. Error de Autenticación

```bash
# Verificar token
echo $INFISICAL_TOKEN

# Regenerar token si es necesario
infisical token generate --type=service
```

#### 3. Secretos No Encontrados

```bash
# Listar todos los secretos
infisical secret list

# Verificar entorno
infisical secret get SECRET_NAME --env=development

# Crear secreto si no existe
infisical secret create SECRET_NAME --value="secret_value" --env=development
```

### Logs de Debug

```typescript
// Habilitar logs detallados
const client = new InfisicalClient({
  token: process.env.INFISICAL_TOKEN,
  siteUrl: process.env.INFISICAL_URL,
  debug: true // Habilitar logs detallados
});
```

---

## Conclusión

Infisical transforma nuestra gestión de secretos de un proceso manual y propenso a errores a un sistema automatizado, seguro y escalable. Esta integración es fundamental para nuestra arquitectura de nivel empresarial y nos prepara para el crecimiento futuro.

**Próximos Pasos:**
1. Implementar Infisical en el entorno de desarrollo
2. Migrar secretos existentes
3. Actualizar documentación de despliegue
4. Capacitar al equipo en el uso de Infisical
5. Implementar monitoreo y alertas

---

**Documentación Relacionada:**
- [ADR-010: Centralized Secrets Management](./ADR-010-Centralized-Secrets-Management.md)
- [System Architecture Overview](./SYSTEM_ARCHITECTURE_OVERVIEW.md)
- [Security Architecture](./SECURITY_ARCHITECTURE.md) 