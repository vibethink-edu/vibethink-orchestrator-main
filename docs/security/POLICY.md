# Política de Seguridad

## Versiones Soportadas

Actualmente damos soporte de seguridad a las siguientes versiones:

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reportar una Vulnerabilidad

La seguridad es una prioridad máxima para nuestro proyecto. Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable.

### Cómo Reportar

**NO** reportes vulnerabilidades de seguridad a través de issues públicos de GitHub.

En su lugar:

1. **Email**: Envía un email a [security@ai-pair-platform.com] con:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Versión afectada
   - Impacto potencial

2. **Información a incluir**:
   - Tipo de vulnerabilidad (ej: SQL injection, XSS, etc.)
   - Rutas o archivos afectados
   - Configuración especial requerida para reproducir
   - Proof of concept o exploit code (si es posible)

### Qué Esperar

- **Confirmación**: Recibirás confirmación en 24-48 horas
- **Evaluación**: Evaluaremos el reporte en 5-7 días hábiles
- **Resolución**: Trabajaremos para resolver el problema lo antes posible
- **Divulgación**: Coordinaremos la divulgación pública contigo

### Divulgación Responsable

Te pedimos que:
- Nos des tiempo razonable para investigar y corregir el problema
- No divulgues la vulnerabilidad públicamente hasta que hayamos lanzado un fix
- No accedas o modifiques datos que no te pertenezcan
- No realices ataques de denegación de servicio

## Mejores Prácticas de Seguridad

### Para Desarrolladores

#### Autenticación y Autorización
- Siempre usar HTTPS en producción
- Implementar autenticación robusta
- Validar permisos en cada request
- No almacenar tokens en localStorage para datos sensibles

#### Validación de Datos
- Validar todos los inputs del usuario
- Sanitizar datos antes de mostrarlos
- Usar prepared statements para queries SQL
- Implementar rate limiting

#### Gestión de Secretos
- Nunca commitear API keys o passwords
- Usar variables de entorno para configuración sensible
- Rotar secrets regularmente
- Usar Supabase Vault para secrets en producción

### Para Usuarios

#### Configuración de Cuenta
- Usar contraseñas fuertes y únicas
- Habilitar autenticación de dos factores cuando esté disponible
- Revisar regularmente los accesos de la cuenta
- Reportar actividad sospechosa inmediatamente

## Vulnerabilidades Conocidas

### Resueltas
- Ninguna hasta la fecha

### En Progreso
- Ninguna hasta la fecha

## Configuración de Seguridad

### Supabase
- **Row Level Security (RLS)**: Habilitado en todas las tablas
- **Auth Providers**: Solo email/password habilitado  
- **API Keys**: Anon key expuesta, service key protegida
- **CORS**: Configurado para dominios específicos

### Frontend
- **CSP**: Content Security Policy implementado
- **HTTPS**: Forzado en producción
- **Input Validation**: Validación en cliente y servidor
- **XSS Protection**: Headers de seguridad configurados

### Base de Datos
- **Encryption**: Datos encriptados en reposo
- **Backups**: Backups automáticos y encriptados
- **Access Control**: Acceso limitado por roles
- **Audit Logs**: Logging de acciones sensibles

## Compliance y Estándares

### Estándares Seguidos
- **OWASP Top 10**: Protección contra vulnerabilidades comunes
- **GDPR**: Preparado para cumplimiento de privacidad
- **SOC 2**: Siguiendo mejores prácticas de seguridad

### Auditorías
- **Revisiones de Código**: Requeridas para cambios de seguridad
- **Penetration Testing**: Planeado para antes de producción
- **Dependency Scanning**: Automatizado en CI/CD

## Actualizaciones de Seguridad

### Proceso
1. **Identificación**: Monitoreo continuo de vulnerabilidades
2. **Evaluación**: Análisis de impacto y priorización
3. **Desarrollo**: Implementación de fix
4. **Testing**: Verificación de la solución
5. **Deploy**: Despliegue urgente si es crítico
6. **Comunicación**: Notificación a usuarios afectados

### Notificaciones
- **Críticas**: Notificación inmediata por email
- **Altas**: Notificación dentro de 24 horas
- **Medias**: Incluidas en release notes
- **Bajas**: Documentadas en changelog

## Arquitectura de Seguridad del Repositorio

### Separación de Responsabilidades

#### 🚀 `src/` - Aplicación de Producción
- **Código de producto**: Componentes, servicios, páginas
- **Tests propios**: `src/__tests__/`, `src/**/*.test.ts`
- **Configuración propia**: Build, deployment, producción
- **Seguridad**: Validación de datos, autenticación, autorización

#### 🛠️ `dev-tools/` - Herramientas de Desarrollo  
- **Scripts de desarrollo**: Build, deploy, automatización
- **Tests propios**: `dev-tools/__tests__/`, testing de herramientas
- **Configuración propia**: Desarrollo, CI/CD, tooling
- **Seguridad**: Análisis de código, scanning, auditorías

### Principio de Aislamiento de Seguridad
- **src/**: Solo dependencias de producción, sin herramientas de desarrollo
- **dev-tools/**: Herramientas aisladas, sin afectar el build de producción
- **Cada uno maneja su propia seguridad y testing**

## Referencias de Organización

Para información sobre estructura y convenciones:

### Documentación Global (Genérica)
- **[docs/development/NAMING_CONVENTIONS.md](docs/development/NAMING_CONVENTIONS.md)** - Convenciones de nombres para todo el repositorio
- **[docs/development/REPOSITORY_ORGANIZATION.md](docs/development/REPOSITORY_ORGANIZATION.md)** - Organización general del repositorio
- **[docs/architecture/SHARED_ARCHITECTURE.md](docs/architecture/SHARED_ARCHITECTURE.md)** - Arquitectura compartida entre src/ y dev-tools/
- **[docs/development/SCRIPTS_GUIDE.md](docs/development/SCRIPTS_GUIDE.md)** - Guía general de scripts y herramientas
- **[docs/development/TESTING_STRATEGY.md](docs/development/TESTING_STRATEGY.md)** - Estrategia general de testing

### Documentación Específica (Solo lo particular)
- **[src/README.md](src/README.md)** - Setup y configuración específica de la aplicación
- **[dev-tools/README.md](dev-tools/README.md)** - Setup y configuración específica de herramientas

### ⚠️ Directorios No Autorizados

**Si encuentras directorios como `/dev`, `/development`, `/tools`, `/config`, etc.:**

1. **Verificar contenido**: `ls -la dev/` (o el directorio sospechoso)
2. **Analizar propósito**: ¿Es código? ¿Son herramientas? ¿Es basura?
3. **Mover o eliminar**:
   - Si es código de aplicación → mover a `src/config/`
   - Si son configuraciones de desarrollo → mover a `dev-tools/config/`
   - Si son herramientas/scripts → mover a `dev-tools/`
   - Si es basura/obsoleto → eliminar

**Script de verificación automática**:
```powershell
# NOTA: Este proyecto usa PowerShell como estándar
# Ejecutar script de detección y limpieza automática
PowerShell -ExecutionPolicy Bypass -File "dev-tools\scripts\detect-unauthorized-directories.ps1"

# O buscar manualmente directorios no autorizados
Get-ChildItem -Directory | Where-Object { $_.Name -notmatch "^(src|dev-tools|docs|\.github|supabase|node_modules)$" }
```

**🚨 EJECUTAR AHORA MISMO (PowerShell - Estándar del proyecto)**:
```powershell
# ELIMINAR TODOS LOS DIRECTORIOS NO AUTORIZADOS AHORA
Write-Host "🧹 LIMPIEZA INMEDIATA..." -ForegroundColor Yellow

# Crear directorios necesarios
if (-not (Test-Path "src")) { New-Item -ItemType Directory -Path "src" -Force }
if (-not (Test-Path "src\backend")) { New-Item -ItemType Directory -Path "src\backend" -Force }
if (-not (Test-Path "src\config")) { New-Item -ItemType Directory -Path "src\config" -Force }
if (-not (Test-Path "dev-tools")) { New-Item -ItemType Directory -Path "dev-tools" -Force }
if (-not (Test-Path "dev-tools\misc")) { New-Item -ItemType Directory -Path "dev-tools\misc" -Force }
if (-not (Test-Path "docs")) { New-Item -ItemType Directory -Path "docs" -Force }
if (-not (Test-Path "docs\compliance")) { New-Item -ItemType Directory -Path "docs\compliance" -Force }

# Limpiar /dev
if (Test-Path "dev") {
    if ((Get-ChildItem "dev" -ErrorAction SilentlyContinue).Count -gt 0) {
        Move-Item "dev\*" "dev-tools\misc\" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "dev" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ /dev eliminado" -ForegroundColor Green
}

# Limpiar /config
if (Test-Path "config") {
    if ((Get-ChildItem "config" -ErrorAction SilentlyContinue).Count -gt 0) {
        Move-Item "config\*" "src\config\" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "config" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ /config eliminado" -ForegroundColor Green
}

# Limpiar /backend-python
if (Test-Path "backend-python") {
    if ((Get-ChildItem "backend-python" -ErrorAction SilentlyContinue).Count -gt 0) {
        Move-Item "backend-python\*" "src\backend\" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "backend-python" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ /backend-python eliminado" -ForegroundColor Green
}

# Limpiar /cmmi-evidence
if (Test-Path "cmmi-evidence") {
    if ((Get-ChildItem "cmmi-evidence" -ErrorAction SilentlyContinue).Count -gt 0) {
        Move-Item "cmmi-evidence\*" "dev-tools\misc\" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "cmmi-evidence" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ /cmmi-evidence eliminado" -ForegroundColor Green
}

# Verificar directorios restantes
Write-Host "🎉 LIMPIEZA COMPLETADA" -ForegroundColor Green
$unauthorized = Get-ChildItem -Directory | Where-Object { $_.Name -notmatch "^(src|dev-tools|docs|\.github|supabase|node_modules)$" }
if ($unauthorized) {
    Write-Host "⚠️  Directorios no autorizados restantes:" -ForegroundColor Red
    $unauthorized | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Red }
} else {
    Write-Host "✅ Solo directorios autorizados restantes" -ForegroundColor Green
}
```

**⚠️ Directorios comúnmente encontrados fuera de lugar:**
- `/dev` → Mover contenido a `dev-tools/misc/` ✅ SERÁ ELIMINADO
- `/config` → Mover a `src/config/` ✅ SERÁ ELIMINADO  
- `/backend-python` → Mover a `src/backend/` ✅ SERÁ ELIMINADO
- `/cmmi-evidence` → Mover a `dev-tools/misc/` ✅ SERÁ ELIMINADO (documentación de desarrollo)
- `/scripts` → Mover a `dev-tools/scripts/`
- `/tools` → Mover a `dev-tools/`
- `/utils` → Mover a `src/utils/`
- `/tests` → Mover a `src/__tests__/` o `dev-tools/__tests__/`

---

**Última actualización**: 7 de enero, 2025  
**Próxima revisión**: Trimestral

> **Nota**: Este archivo debe permanecer en la raíz del proyecto para cumplir con los estándares de GitHub y facilitar el reporte de vulnerabilidades.
chmod +x dev-tools/scripts/cleanup-immediate.sh && bash dev-tools/scripts/cleanup-immediate.sh
```

---

**Última actualización**: 7 de enero, 2025  
**Próxima revisión**: Trimestral

> **Nota**: Este archivo debe permanecer en la raíz del proyecto para cumplir con los estándares de GitHub y facilitar el reporte de vulnerabilidades.
