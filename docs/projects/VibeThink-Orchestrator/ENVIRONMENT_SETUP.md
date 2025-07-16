# Configuración de Variables de Entorno

## Descripción
Este documento explica cómo configurar las variables de entorno necesarias para el funcionamiento de la plataforma AI Pair.

## Variables Requeridas

### Supabase Configuration
```bash
# URL de tu proyecto Supabase
VITE_SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co

# Clave anónima pública de Supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### Development Configuration
```bash
# Entorno de desarrollo
VITE_APP_ENV=development

# Versión de la aplicación
VITE_APP_VERSION=2.1.0
```

### AI Configuration (Opcional)
```bash
# Claves de API para servicios de IA
VITE_OPENAI_API_KEY=tu_openai_api_key_aqui
VITE_ANTHROPIC_API_KEY=tu_anthropic_api_key_aqui
```

### Feature Flags
```bash
# Habilitar/deshabilitar características
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_VOICE_INTEGRATION=false
VITE_ENABLE_MEETING_PROCESSOR=true
```

## Configuración por Entorno

### Desarrollo Local
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las variables necesarias
3. El archivo `.env.local` está en `.gitignore` por seguridad

### Producción
1. Configura las variables en tu plataforma de hosting
2. Asegúrate de que todas las variables estén definidas
3. Usa claves reales de producción

## Obtención de Claves Supabase

### 1. Accede a tu Dashboard de Supabase
- Ve a [supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto

### 2. Obtén la URL del Proyecto
- Ve a **Settings** > **API**
- Copia la **Project URL**

### 3. Obtén la Clave Anónima
- En la misma página de **Settings** > **API**
- Copia la **anon public** key

## Ejemplo de Archivo .env.local

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3l3YW9xbGVrdXBmeW5uY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4MDAsImV4cCI6MjA1MDU0ODgwMH0.tu_clave_real_aqui

# Development Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=2.1.0

# AI Configuration (opcional)
VITE_OPENAI_API_KEY=sk-tu_openai_key_aqui
VITE_ANTHROPIC_API_KEY=sk-ant-tu_anthropic_key_aqui

# Feature Flags
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_VOICE_INTEGRATION=false
VITE_ENABLE_MEETING_PROCESSOR=true
```

## Solución de Problemas

### Error: "Missing VITE_SUPABASE_ANON_KEY"
- Verifica que el archivo `.env.local` existe
- Asegúrate de que la variable esté correctamente definida
- Reinicia el servidor de desarrollo después de crear/modificar el archivo

### Error: "Invalid API Key"
- Verifica que la clave sea correcta
- Asegúrate de que sea la clave **anon public**, no la service_role
- Verifica que el proyecto Supabase esté activo

### Variables no se cargan
- Verifica que el archivo esté en la raíz del proyecto
- Asegúrate de que el nombre del archivo sea exactamente `.env.local`
- Reinicia el servidor de desarrollo

## Seguridad

### ⚠️ Importante
- **NUNCA** commits el archivo `.env.local` al repositorio
- **NUNCA** compartas tus claves de API
- Usa diferentes claves para desarrollo y producción
- Rota las claves regularmente

### Archivos Ignorados
Los siguientes archivos están en `.gitignore`:
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`

## Verificación

Para verificar que las variables están configuradas correctamente:

1. Abre la consola del navegador
2. Verifica que no hay errores de Supabase
3. Intenta hacer login/logout
4. Verifica que las funcionalidades de IA funcionan

## Recursos Adicionales

- [Documentación de Vite - Variables de Entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Documentación de Supabase - Configuración](https://supabase.com/docs/guides/getting-started/environment-variables)
- [Guía de Seguridad de API Keys](https://supabase.com/docs/guides/security/api-keys) 