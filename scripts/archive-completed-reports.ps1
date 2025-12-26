# Script para Archivar Reportes Completados
# Mueve reportes completados a docs/sessions/archived/

$rootPath = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$archivedPath = Join-Path $rootPath "docs\sessions\archived"
$reorgArchivedPath = Join-Path $archivedPath "reorg-2025"

# Crear directorios si no existen
if (-not (Test-Path $archivedPath)) {
    New-Item -ItemType Directory -Path $archivedPath -Force | Out-Null
}
if (-not (Test-Path $reorgArchivedPath)) {
    New-Item -ItemType Directory -Path $reorgArchivedPath -Force | Out-Null
}

Write-Host "`n📦 Archivando reportes completados...`n" -ForegroundColor Cyan

# Reportes de reorganización 2025 (mover a subdirectorio)
$reorgFiles = @(
    "docs\reorg-2025\REORGANIZATION_FINAL_REPORT.md",
    "docs\reorg-2025\CLOSURE_REPORT.md",
    "docs\reorg-2025\BUNDUI_CONSOLIDATION_REPORT.md",
    "docs\reorg-2025\REORGANIZATION_MOVES_LOG.md",
    "docs\reorg-2025\ROOT_INVENTORY_AND_ACTIONS.md",
    "docs\reorg-2025\ESTRUCTURA_IDEAL_VTHINK_1.0_REPLANTEADA.md",
    "docs\reorg-2025\PLAN_ACCION_REPLANTEADO.md"
)

# Reportes completados (mover a archived)
$completedReports = @(
    "docs\FASE4_ARCHITECTURE_UPGRADE_REPORT.md",
    "docs\BUNDUI_FASE1_RESULTADOS.md",
    "docs\BUNDUI_REVIEW_RESULTS.md",
    "docs\COMPATIBILITY_REPORT.md",
    "docs\ui-ux\SHADCN_ALIGNMENT_REPORT.md",
    "docs\architecture\CLEANUP_REPORT_2025-01-17.md",
    "docs\architecture\VALIDATION_REPORT_2025-01-17.md",
    "docs\architecture\VALIDATION_REPORT_2025-12-18.md"
)

$movedCount = 0

# Mover reportes de reorganización
foreach ($file in $reorgFiles) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $fileName = Split-Path $file -Leaf
        $destPath = Join-Path $reorgArchivedPath $fileName
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Archivado (reorg-2025): $fileName" -ForegroundColor Green
        $movedCount++
    }
}

# Mover reportes completados
foreach ($file in $completedReports) {
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
Write-Host "📁 Reorganización 2025 en: $reorgArchivedPath" -ForegroundColor Cyan





