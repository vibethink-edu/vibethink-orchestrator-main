# Troubleshooting Guide - AI Pair Orchestrator Pro

## 🔧 Guía de Resolución de Problemas

Esta guía proporciona soluciones paso a paso para los problemas más comunes durante el desarrollo, deployment y operación de AI Pair Orchestrator Pro.

**Última actualización**: Diciembre 2024  
**Audiencia**: Desarrolladores, DevOps, Support Team

## 📋 Problemas Más Comunes

### 1. Error de Variables de Entorno
**Síntoma**: `Missing VITE_SUPABASE_ANON_KEY environment variable`

**Solución**:
```bash
# Crear .env.local
cp .env.example .env.local

# Configurar variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Reiniciar servidor
npm run dev
```

### 2. Error de Compilación TypeScript
**Síntoma**: `Property 'user' does not exist on type 'User | null'`

**Solución**:
```typescript
// ❌ Incorrecto
const userName = user.name;

// ✅ Correcto
const userName = user?.name || 'Unknown';
```

### 3. Error de Autenticación
**Síntoma**: `JWT expired` o `Invalid login credentials`

**Solución**:
```typescript
// Verificar refresh automático
const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
```

### 4. Error Multi-tenant
**Síntoma**: `RLS policy violation`

**Solución**:
```typescript
// ✅ Siempre filtrar por company_id
const { data } = await supabase
  .from('documents')
  .select('*')
  .eq('company_id', user.company_id);
```

### 5. Error de AI Processing
**Síntoma**: `OpenAI API rate limit exceeded`

**Solución**:
```typescript
// Implementar retry con backoff
async function callOpenAIWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

### 6. Error de Plugin Tailwind: tailwindcss-animate faltante
**Síntoma**: `[postcss] Cannot find module 'tailwindcss-animate'` o errores similares al iniciar Vite o compilar CSS.

**Causa**: El archivo `tailwind.config.js` incluye el plugin `tailwindcss-animate` en la sección `plugins`, pero el paquete no está instalado en el proyecto.

**Solución**:
```bash
npm install -D tailwindcss-animate
npm run dev
```
- Instala el plugin faltante como dependencia de desarrollo.
- Reinicia el servidor de desarrollo para que Vite lo detecte.

**Notas**:
- Si agregas más plugins a Tailwind, asegúrate de instalarlos siempre con `npm install -D`.
- Este error detiene la compilación de CSS y ningún estilo de Tailwind se aplicará hasta resolverlo.

### 7. Script de Verificación de Estilos Tailwind CSS
**Propósito**: Permite verificar rápidamente que la configuración de Tailwind CSS, PostCSS y los estilos principales están correctamente instalados y funcionando en el proyecto.

**Ubicación**: `scripts/verify-styles.js`

**Uso**:
```bash
node scripts/verify-styles.js
```

**¿Qué verifica?**
- Existencia de archivos críticos (`tailwind.config.js`, `postcss.config.js`, `src/index.css`, `package.json`)
- Instalación de dependencias clave (`tailwindcss`, `postcss`, `autoprefixer`, `tailwindcss-animate`)
- Configuración de rutas y plugins en `tailwind.config.js`
- Presencia de directivas y variables CSS en `src/index.css`

**Checklist visual sugerido:**
- Fondo oscuro y texto claro
- Botones con colores primarios
- Cards con bordes y sombras
- Grid responsive
- Hover effects en botones

**Recomendación:**
Ejecuta este script después de instalar dependencias, actualizar Tailwind o al migrar el proyecto para asegurarte de que la base de estilos está operativa antes de depurar problemas visuales complejos.

### 8. Problema de redirección del SUPER_ADMIN en SimpleLogin
**Síntoma**: Al hacer login como SUPER_ADMIN usando SimpleLogin, el usuario es redirigido a `/auth` en lugar de `/super-admin`.

**Causa**: 
1. El hook `useSuperAdmin` tenía credenciales incorrectas (`@VibeThink.com` en lugar de `@VibeThink.co`)
2. El `window.location.reload()` en SimpleLogin interrumpía la navegación programática
3. **El hook `useAuth` no leía los datos del localStorage** que SimpleLogin guardaba

**Solución completa**:
1. **Corregir credenciales en useSuperAdmin**:
   ```typescript
   // En src/hooks/useSuperAdmin.tsx
   const superAdminEmails = [
     'admin@VibeThink.co',        // ✅ Corregido
     'superadmin@VibeThink.co',   // ✅ Corregido  
     'root@VibeThink.co'          // ✅ Corregido
   ];
   ```

2. **Eliminar window.location.reload() en SimpleLogin**:
   ```typescript
   // En src/pages/SimpleLogin.tsx
   // Navigate based on role
   if (role === 'SUPER_ADMIN' && companyData.slug === 'VibeThink-platform') {
     navigate('/super-admin');
   } else if (role === 'ADMIN' || role === 'OWNER') {
     navigate('/admin');
   } else {
     navigate('/dashboard');
   }
   // ❌ Eliminar: window.location.reload();
   ```

3. **Agregar lectura de localStorage en useAuth**:
   ```typescript
   // En src/hooks/useAuth.tsx - useEffect de inicialización
   useEffect(() => {
     // Check for mock user in localStorage first (for SimpleLogin)
     const storedAuthUser = localStorage.getItem('auth_user');
     const storedAuthSession = localStorage.getItem('auth_session');
     
     if (storedAuthUser && storedAuthSession) {
       try {
         const mockUser = JSON.parse(storedAuthUser);
         const mockSession = JSON.parse(storedAuthSession);
         
         setMockUser(mockUser);
         setSession(mockSession);
         setIsMockMode(true);
         setLoading(false);
         return; // Don't continue with Supabase auth if we have mock data
       } catch (error) {
         // Clear invalid data
         localStorage.removeItem('auth_user');
         localStorage.removeItem('auth_session');
       }
     }
     // ... resto del código de Supabase
   }, []);
   ```

4. **Actualizar signOut para limpiar localStorage**:
   ```typescript
   // En src/hooks/useAuth.tsx - función signOut
   const signOut = async () => {
     // Clear localStorage if in mock mode
     if (isMockMode) {
       localStorage.removeItem('auth_user');
       localStorage.removeItem('auth_session');
     }
     // ... resto del código
   };
   ```

**Verificación**:
- Usar el script: `node scripts/test-login-flow.js`
- Credenciales correctas: `superadmin@VibeThink.co` / `12345`
- Debe redirigir a: `http://localhost:8080/super-admin`

**Flujo esperado**:
1. SimpleLogin guarda datos en localStorage
2. useAuth lee localStorage al inicializar
3. useSuperAdmin verifica credenciales correctas
4. ProtectedRoute permite acceso a /super-admin
5. Usuario ve panel de super administración

**Notas**:
- El SUPER_ADMIN debe tener role `SUPER_ADMIN` y company `VibeThink-platform`
- El badge "SUPER_ADMIN" debe aparecer en el header
- El botón de escudo (🛡️) debe estar disponible para alternar el panel lateral

## 🚨 Diagnóstico Rápido

### Script de Diagnóstico
```bash
#!/bin/bash
echo "=== Diagnóstico AI Pair Orchestrator Pro ==="

echo "1. Node.js version..."
node --version

echo "2. Environment variables..."
if [ -f .env.local ]; then
  echo "✅ .env.local exists"
else
  echo "❌ .env.local missing"
fi

echo "3. TypeScript check..."
npx tsc --noEmit && echo "✅ TypeScript OK" || echo "❌ TypeScript errors"

echo "4. Build test..."
npm run build > /dev/null 2>&1 && echo "✅ Build OK" || echo "❌ Build failed"

echo "=== Diagnóstico Complete ==="
```

## 📞 Escalación

### Niveles de Soporte
1. **Documentación**: Revisar docs relevantes
2. **Team Channel**: #dev-help
3. **Senior Developer**: Para problemas complejos
4. **Tech Lead**: Para decisiones arquitectónicas

### Información para Reportes
- Descripción detallada del problema
- Pasos para reproducir
- Screenshots/logs relevantes
- Información del entorno
- Hora del incidente

---

**💡 Tip**: Para problemas no cubiertos aquí, consulta la [documentación completa](./README.md) o contacta al equipo de desarrollo. 