# 🔧 Configuración de Entornos - VThink 1.0

## 📋 Descripción

Este directorio contiene todas las configuraciones de entorno para la plataforma VThink 1.0, incluyendo variables de entorno, configuraciones por ambiente y el sistema maestro de control.

## 📁 Estructura

```
src/config/
├── environments/
│   └── master-control.env    # Sistema maestro de control
├── env.development.example   # Variables de desarrollo
├── env.production.example    # Variables de producción
└── README.md                # Esta documentación
```

## 🚀 Configuración Rápida

### 1. Desarrollo Local

```bash
# Copiar el archivo de ejemplo
cp src/config/env.development.example .env.local

# Editar con tus credenciales reales
nano .env.local
```

### 2. Producción

```bash
# Copiar el archivo de ejemplo
cp src/config/env.production.example .env

# Editar con tus credenciales reales
nano .env
```

## 🔐 Variables Críticas

### Supabase (Obligatorio)
```bash
VITE_SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### OpenAI (Opcional)
```bash
VITE_OPENAI_API_KEY=sk-your-openai-key
```

### Firecrawl (Opcional)
```bash
VITE_FIRECRAWL_API_KEY=your_firecrawl_key
```

## 🌍 Entornos Disponibles

| Entorno | URL | Propósito |
|---------|-----|-----------|
| **DEV** | `http://localhost:8080` | Desarrollo local |
| **QA** | `https://qa.vibethink.co` | Testing exhaustivo |
| **STAGING** | `https://staging.vibethink.co` | Validación final |
| **PROD** | `https://app.vibethink.co` | Producción |

## 🔄 Sistema Maestro de Control

El archivo `master-control.env` contiene todas las configuraciones por entorno, incluyendo:

- **Base de datos**: URLs y claves de Supabase
- **IA**: Configuraciones de OpenAI, Firecrawl
- **CMS**: Integraciones con Strapi, Payload
- **Pagos**: Configuraciones de Stripe
- **Email**: Configuraciones de SendGrid
- **Analytics**: Google Analytics, Sentry
- **Cache**: Redis
- **Storage**: AWS S3

## ⚠️ Seguridad

### Reglas de Oro:
1. **NUNCA** subir archivos `.env` al repositorio
2. **NUNCA** usar credenciales de producción en desarrollo
3. **SIEMPRE** usar variables de entorno para credenciales
4. **VALIDAR** todas las configuraciones antes de producción

### Archivos Seguros:
- ✅ `.env.example` - Ejemplos sin credenciales reales
- ✅ `master-control.env` - Plantillas de configuración
- ❌ `.env` - Credenciales reales (NO subir)
- ❌ `.env.local` - Credenciales locales (NO subir)

## 🛠️ Troubleshooting

### Error: "Missing VITE_SUPABASE_ANON_KEY"
```bash
# Verificar que el archivo .env existe
ls -la .env

# Verificar que las variables están definidas
grep VITE_SUPABASE .env
```

### Error: "Supabase connection failed"
```bash
# Verificar URL de Supabase
echo $VITE_SUPABASE_URL

# Verificar clave anónima
echo $VITE_SUPABASE_ANON_KEY
```

### Error: "Environment not configured"
```bash
# Verificar archivo de entorno
cat .env | grep VITE_APP_ENV
```

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Variables de Entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)
- [VThink 1.0 - Metodología](docs/methodologies/VThink-1.0/)

## 🔄 Actualización de Configuraciones

Para actualizar configuraciones:

1. **Editar** `master-control.env` para cambios globales
2. **Actualizar** archivos `.env.example` para nuevos entornos
3. **Documentar** cambios en este README
4. **Validar** configuraciones en todos los entornos

---

**VThink 1.0** - Sistema de configuración empresarial certificado 