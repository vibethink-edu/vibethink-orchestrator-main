# Script para Archivar Reportes y Sesiones Completadas en docs/architecture/
# Mueve reportes completados a docs/sessions/archived/architecture/

$rootPath = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$archivedPath = Join-Path $rootPath "docs\sessions\archived\architecture"

# Crear directorio si no existe
if (-not (Test-Path $archivedPath)) {
    New-Item -ItemType Directory -Path $archivedPath -Force | Out-Null
}

Write-Host "`n📦 Archivando reportes y sesiones completadas en docs/architecture/...`n" -ForegroundColor Cyan

# Reportes y sesiones completadas (mover a archived/architecture)
$reportsToArchive = @(
    "docs\architecture\REPORTE_MIGRACION_2025-12-18.md",
    "docs\architecture\DEBUG_SESSION_2025-12-18.md",
    "docs\architecture\DEBUG_SESSION_2025-12-18_PROGRESS.md",
    "docs\architecture\MIGRATION_SESSION_2025-12-18.md",
    "docs\architecture\MIGRATION_SESSION_2025-12-18_FINAL.md",
    "docs\architecture\ESTADO_ACTUAL_2025-12-18.md",
    "docs\architecture\ROUTING_FIX_2025-12-18.md",
    "docs\architecture\ROUTING_STATUS_2025-12-18.md",
    "docs\architecture\CLEANUP_VERIFICATION_2025-01-17.md",
    "docs\architecture\MIGRATION_STATUS_2025-01-18.md",
    "docs\architecture\MIGRACION_DASHBOARDS_COMPLETA.md",
    "docs\architecture\MIGRACION_MENU_VERIFICATION.md"
)

$movedCount = 0

# Mover reportes completados
foreach ($file in $reportsToArchive) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $fileName = Split-Path $file -Leaf
        $destPath = Join-Path $archivedPath $fileName
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Archivado: $fileName" -ForegroundColor Green
        $movedCount++
    }
}

Write-Host "`n✅ Archivación completada:" -ForegroundColor Green
Write-Host "   • Archivos archivados: $movedCount" -ForegroundColor White
Write-Host "`n📁 Reportes archivados en: $archivedPath" -ForegroundColor Cyan









