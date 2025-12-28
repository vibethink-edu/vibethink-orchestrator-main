# Script de Consolidación de Archivos de Sesión
# Mueve archivos completados a docs/sessions/archived/

$rootPath = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$archivedPath = Join-Path $rootPath "docs\sessions\archived"

# Crear directorio archived si no existe
if (-not (Test-Path $archivedPath)) {
    New-Item -ItemType Directory -Path $archivedPath -Force | Out-Null
    Write-Host "✅ Creado directorio: $archivedPath" -ForegroundColor Green
}

# Archivos de análisis completados (raíz)
$rootFilesToArchive = @(
    "ANALISIS_DIFF_0632_vs_1414.md",
    "ANALISIS_PROBLEMA_LOGO_COLAPSADO.md",
    "PLAN_RECUPERACION_SEGURO_PASO_A_PASO.md",
    "RESUMEN_EJECUTIVO_RECUPERACION.md",
    "RESUMEN_CAMBIOS_LOCALES.md"
)

# Archivos de sesión completados (docs/sessions)
$sessionFilesToArchive = @(
    "CIRUGIA_RECUPERACION_2025-12-20.md",
    "FIX_RUNTIME_ERROR_2025-12-20.md",
    "FIX_I18N_DASHBOARDS_2025-12-20.md",
    "FIX_THEME_CONFIGURATOR_2025-12-20.md",
    "GIT_HEALTH_REPORT_2025-12-20.md",
    "LISTA_MODULOS_PERDIDOS_2025-12-20.md",
    "ANALISIS_MODULOS_OCULTOS_2025-12-20.md"
)

# Logs temporales a eliminar (raíz)
$logsToDelete = @(
    "build_output.log",
    "build_output_2.log",
    "build_output_3.log",
    "build_output_4.log",
    "build_output_clean.log",
    "server_components_to_fix.log",
    "nul"
)

Write-Host "`n📦 Consolidando archivos de sesión...`n" -ForegroundColor Cyan

# Mover archivos de raíz
$movedCount = 0
foreach ($file in $rootFilesToArchive) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $archivedPath $file
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Movido: $file" -ForegroundColor Green
        $movedCount++
    }
}

# Mover archivos de sesión
$sessionsPath = Join-Path $rootPath "docs\sessions"
foreach ($file in $sessionFilesToArchive) {
    $sourcePath = Join-Path $sessionsPath $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $archivedPath $file
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Movido: $file" -ForegroundColor Green
        $movedCount++
    }
}

# Eliminar logs temporales
$deletedCount = 0
foreach ($log in $logsToDelete) {
    $logPath = Join-Path $rootPath $log
    if (Test-Path $logPath) {
        Remove-Item -Path $logPath -Force
        Write-Host "  🗑️  Eliminado: $log" -ForegroundColor Yellow
        $deletedCount++
    }
}

Write-Host "`n✅ Consolidación completada:" -ForegroundColor Green
Write-Host "   • Archivos movidos: $movedCount" -ForegroundColor White
Write-Host "   • Logs eliminados: $deletedCount" -ForegroundColor White
Write-Host "`n📁 Archivos archivados en: $archivedPath" -ForegroundColor Cyan










