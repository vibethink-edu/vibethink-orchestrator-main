# 🎙️ Meeting Processor Setup Guide

Guía completa para configurar y probar el procesador de reuniones AI implementado en el Sprint 3.

## 📋 Resumen

El procesador de reuniones convierte archivos de audio en transcripciones y minutos estructurados usando:
- **OpenAI Whisper** para transcripción
- **GPT-4o** para análisis y estructuración
- **Multi-tenant isolation** para seguridad
- **Usage tracking** para billing y límites

## 🗄️ Migraciones de Base de Datos

### 1. Aplicar Migraciones

Las siguientes tablas y funciones se crearán:

```bash
# Aplicar todas las migraciones
npm run migrate
```

**Tablas creadas:**
- `meetings` - Almacena reuniones procesadas
- `ai_usage_logs` - Tracking de uso de AI APIs

**Funciones RPC:**
- `get_company_limits()` - Obtiene límites y uso actual
- `can_use_ai_service()` - Valida si se puede usar AI
- `get_monthly_usage_stats()` - Estadísticas de uso mensual

### 2. Estructura de Tablas

#### Tabla `meetings`
```sql
- id (UUID, PK)
- company_id (UUID, FK) -- Multi-tenant isolation
- created_by (UUID, FK)
- title (TEXT)
- meeting_date (DATE)
- attendees (TEXT[])
- transcription (TEXT)
- meeting_minutes (JSONB) -- Minutos estructurados
- processing_metadata (JSONB)
- original_filename (TEXT)
- file_size_bytes (BIGINT)
- file_type (TEXT)
- status (TEXT) -- 'processing', 'completed', 'failed'
- created_at, updated_at (TIMESTAMP)
```

#### Tabla `ai_usage_logs`
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- user_id (UUID, FK)
- operation_type (TEXT) -- 'meeting_processing', etc.
- service_provider (TEXT) -- 'openai'
- model_used (TEXT) -- 'gpt-4o', 'whisper-1'
- tokens_used (INTEGER)
- input_tokens, output_tokens (INTEGER)
- cost_estimate (DECIMAL)
- request_size_bytes, response_size_bytes (BIGINT)
- processing_duration_ms (INTEGER)
- status (TEXT)
- metadata (JSONB)
- created_at, completed_at (TIMESTAMP)
```

## 🔧 Configuración

### 1. Variables de Entorno

Crear/actualizar `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Para migraciones (service role key)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# OpenAI API (para Edge Functions)
OPENAI_API_KEY=tu_openai_key_aqui
```

### 2. Edge Functions

Desplegar la función de procesamiento:

```bash
# Instalar Supabase CLI si no está instalado
npm install -g @supabase/cli

# Autenticar (si es necesario)
supabase login

# Desplegar Edge Functions
npm run functions:deploy

# O manualmente:
supabase functions deploy meeting-processor
```

## 🧪 Testing

### 1. Tests de Conexión

```bash
# Test rápido de conexión
npm run test:connection

# Test completo con detalles
npm run dev
# Visitar: http://localhost:5173/meeting-processor-demo
```

### 2. Tests de Integración

```bash
# Tests de integración de base de datos
npm run test -- tests/integration/meeting-processor.test.ts

# Tests unitarios
npm run test:unit

# Tests E2E completos
npm run test:e2e
```

### 3. Página de Demo

Visitar: `http://localhost:5173/meeting-processor-demo`

**Características de la demo:**
- ✅ Test de conexión a Supabase
- ✅ Información del usuario y permisos
- ✅ Estadísticas de uso del plan
- ✅ Interfaz de carga de archivos
- ✅ Historial de reuniones procesadas
- ✅ Instrucciones de uso

## 🎯 Uso del Procesador

### 1. Formatos Soportados

**Audio:**
- WAV, MP3, MP4, M4A, WebM
- Tamaño máximo: 25MB
- Duración recomendada: Hasta 2 horas

### 2. Proceso de Análisis

1. **Subida**: Usuario sube archivo de audio
2. **Validación**: Verifica formato, tamaño y límites
3. **Transcripción**: OpenAI Whisper convierte audio a texto
4. **Análisis**: GPT-4o extrae puntos clave, decisiones y tareas
5. **Almacenamiento**: Guarda resultado en base de datos
6. **Tracking**: Registra uso para billing y límites

### 3. Resultado Estructurado

```typescript
interface MeetingMinutes {
  title: string
  date: string
  attendees: string[]
  summary: string
  key_points: string[]
  action_items: ActionItem[]
  decisions: string[]
  next_steps: string[]
}

interface ActionItem {
  task: string
  assignee?: string
  priority: 'low' | 'medium' | 'high'
  due_date?: string
}
```

## 🔒 Seguridad Multi-tenant

### 1. Row Level Security (RLS)

**Políticas implementadas:**
- Usuarios solo ven datos de su empresa
- Inserción solo en empresa propia
- Solo el creador puede actualizar reuniones
- Solo ADMINs pueden eliminar reuniones

### 2. Validación en Edge Function

```typescript
// Validación de empresa
const userCompanyId = await getUserCompanyId(authToken)
if (userCompanyId !== requestedCompanyId) {
  return new Response('Unauthorized', { status: 403 })
}

// Validación de límites
const canProceed = await canUseAIService(companyId)
if (!canProceed.can_proceed) {
  return new Response(canProceed.reason, { status: 429 })
}
```

## 📊 Monitoring y Limits

### 1. Usage Tracking

Cada operación registra:
- Tokens utilizados (input/output)
- Costo estimado en USD
- Duración del procesamiento
- Metadatos del archivo
- Estado de la operación

### 2. Límites del Plan

```typescript
// Ejemplo de límites por plan
STARTER: {
  max_monthly_ai_requests: 1000,
  max_users: 5,
  max_storage_gb: 1
}

PROFESSIONAL: {
  max_monthly_ai_requests: 10000,
  max_users: 25,
  max_storage_gb: 10
}

ENTERPRISE: {
  max_monthly_ai_requests: 100000,
  max_users: 100,
  max_storage_gb: 100
}
```

## 🚀 Deployment

### 1. Production Checklist

- [ ] Migraciones aplicadas en producción
- [ ] Edge Functions desplegadas
- [ ] Variables de entorno configuradas
- [ ] OpenAI API key válida y con límites apropiados
- [ ] Tests de integración pasando
- [ ] Monitoring configurado

### 2. Performance Optimizations

**Base de datos:**
- Índices en `company_id` y `created_at`
- Índices compuestos para estadísticas mensuales
- Particionado por fecha (futuro)

**Edge Functions:**
- Timeout de 30 segundos
- Retry automático en caso de fallo
- Chunking para archivos grandes

## 🐛 Troubleshooting

### 1. Problemas Comunes

**Error: "Company not found"**
```bash
# Verificar que el usuario tenga company_id
SELECT id, email, user_metadata FROM auth.users WHERE email = 'tu_email';
```

**Error: "Table meetings does not exist"**
```bash
# Aplicar migraciones
npm run migrate
```

**Error: "OpenAI API key invalid"**
```bash
# Verificar configuración en Supabase
supabase secrets list
supabase secrets set OPENAI_API_KEY=tu_key_aqui
```

### 2. Logs de Debug

**Supabase Logs:**
```bash
supabase functions logs meeting-processor
```

**Frontend Debug:**
```javascript
// En DevTools Console
localStorage.setItem('debug', 'meeting-processor:*')
```

## 📈 Next Steps

### 1. Mejoras Futuras

- **Soporte para video**: Extraer audio de archivos MP4
- **Múltiples idiomas**: Detección automática de idioma
- **Integración calendario**: Vincular con Google Calendar/Outlook
- **Plantillas personalizadas**: Formatos de minutos por empresa
- **OCR de presentaciones**: Analizar slides compartidas

### 2. Optimizaciones

- **Streaming**: Procesamiento en tiempo real
- **Caching**: Cache de transcripciones similares
- **Compression**: Compresión inteligente de audio
- **Batch processing**: Procesamiento en lotes

## 📝 API Reference

### 1. Edge Function Endpoint

```bash
POST /functions/v1/meeting-processor
Content-Type: application/json
Authorization: Bearer <supabase_token>

{
  "file_name": "meeting.mp3",
  "file_data": "<base64_encoded_audio>",
  "file_type": "audio/mp3",
  "meeting_title": "Team Standup",
  "meeting_date": "2024-01-15",
  "attendees": ["John Doe", "Jane Smith"]
}
```

### 2. Response Format

```json
{
  "success": true,
  "meeting_id": "uuid",
  "transcription": "texto completo...",
  "meeting_minutes": {
    "title": "Team Standup",
    "date": "2024-01-15",
    "attendees": ["John Doe", "Jane Smith"],
    "summary": "Resumen del meeting...",
    "key_points": ["Punto 1", "Punto 2"],
    "action_items": [
      {
        "task": "Revisar propuesta",
        "assignee": "John Doe",
        "priority": "high"
      }
    ],
    "decisions": ["Decisión tomada"],
    "next_steps": ["Próximo paso"]
  },
  "processing_metadata": {
    "transcription_duration": 120,
    "ai_tokens_used": 1500,
    "cost_estimate": 0.075
  }
}
```

---

## 🎉 ¡Listo!

El procesador de reuniones está configurado y listo para usar. Visita `/meeting-processor-demo` para probarlo en acción.

**¿Problemas?** Revisa la sección de troubleshooting o consulta los logs de Supabase. 