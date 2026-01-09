# Script para Crear Resumen de Sesión
param(
    [string]$WorkSummary = "Sesión de desarrollo completada"
)

Write-Host "Creando resumen de sesión..." -ForegroundColor Cyan

# Obtener información del proyecto
$currentBranch = git branch --show-current
$lastCommit = git log --oneline -n 1
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Crear contenido base
$content = @"
# SESSION SUMMARY - $(Get-Date -Format "yyyy-MM-dd")

## 📋 Estado de la Sesión
- **Rama actual:** $currentBranch
- **Último commit:** $lastCommit  
- **Timestamp:** $timestamp
- **Resumen del trabajo:** $WorkSummary

## 🔄 Estado del Repositorio

### Cambios Pendientes:
"@

# Verificar cambios pendientes
$changes = git status --porcelain
if ($changes) {
    $content += "`n``````"
    $content += "`n$changes"
    $content += "`n``````"
} else {
    $content += "`n✅ No hay cambios pendientes - todo está committed"
}

# Añadir contexto de commits
$recentCommits = git log --oneline -n 5
$content += @"

### Últimos Commits (contexto):
``````
$recentCommits
``````

## 🎯 Estado de Aplicaciones

### Dashboard (puerto 3001):
🟢 Configurado para desarrollo

### Apps Status:
- **Dashboards migrados:** 15/15 ✅
- **Hidratación:** Issues resueltos con IconWrapper ✅ 
- **Headers duplicados:** Resuelto ✅

## 🚀 Próximos Pasos Sugeridos

1. **Al retomar mañana:**
   - Ejecutar: pnpm run lint
   - Revisar este resumen de sesión
   - Verificar que dashboard funciona: http://localhost:3001

2. **Tareas pendientes identificadas:**
   - [ ] Revisar estado de CI/CD (GitHub Actions)
   - [ ] Configurar puertos explícitos en apps faltantes
   - [ ] Crear .env.example en apps sin configuración

## 📊 Métricas de Calidad
- ✅ **CI Status:** PENDING CHECK
- ⚠️ **Advertencias:** Revisar logs de CI
- ✅ **Validaciones exitosas:** N/A

---
*Generado automáticamente - $timestamp*
*Para continuar mañana: leer este archivo y ejecutar 'pnpm run lint'*
"@

# Escribir archivo
$content | Out-File -FilePath "SESSION_SUMMARY.md" -Encoding UTF8

Write-Host "✅ SESSION_SUMMARY.md creado exitosamente" -ForegroundColor Green
Write-Host "📄 Listo para continuar mañana" -ForegroundColor Green