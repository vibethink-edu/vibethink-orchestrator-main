# Script para Archivar Reportes Completados en otras carpetas de docs/
# Mueve reportes completados a docs/sessions/archived/

$rootPath = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$archivedPath = Join-Path $rootPath "docs\sessions\archived"

# Crear subdirectorios si no existen
$uiUxArchivedPath = Join-Path $archivedPath "ui-ux"
$testingArchivedPath = Join-Path $archivedPath "testing"
$reportsArchivedPath = Join-Path $archivedPath "reports"

if (-not (Test-Path $uiUxArchivedPath)) {
    New-Item -ItemType Directory -Path $uiUxArchivedPath -Force | Out-Null
}
if (-not (Test-Path $testingArchivedPath)) {
    New-Item -ItemType Directory -Path $testingArchivedPath -Force | Out-Null
}
if (-not (Test-Path $reportsArchivedPath)) {
    New-Item -ItemType Directory -Path $reportsArchivedPath -Force | Out-Null
}

Write-Host "`n📦 Archivando reportes completados en otras carpetas de docs/...`n" -ForegroundColor Cyan

# Reportes de ui-ux (mover a archived/ui-ux)
$uiUxReports = @(
    "docs\ui-ux\BUNDUI_CLEANUP_STATUS.md",
    "docs\ui-ux\BUNDUI_MIGRATION_COMPLETE.md",
    "docs\ui-ux\MIGRATION_PROGRESS.md",
    "docs\ui-ux\PROMPT_KIT_ANALYSIS.md",
    "docs\ui-ux\PROMPT_KIT_VS_SHADCN.md",
    "docs\ui-ux\REACT_19_COMPATIBILITY_ANALYSIS.md"
)

# Reportes de testing (mover a archived/testing)
$testingReports = @(
    "docs\testing\DASHBOARD_VALIDATION_REPORT.md",
    "docs\testing\PRUEBAS_POST_LIMPIEZA.md"
)

# Reportes de reports (mover a archived/reports)
$reportsReports = @(
    "docs\reports\CONSOLIDATION_VALIDATION_REPORT.md",
    "docs\reports\DOCUMENTATION_CONSOLIDATION_REPORT.md"
)

$movedCount = 0

# Mover reportes de ui-ux
foreach ($file in $uiUxReports) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $fileName = Split-Path $file -Leaf
        $destPath = Join-Path $uiUxArchivedPath $fileName
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Archivado (ui-ux): $fileName" -ForegroundColor Green
        $movedCount++
    }
}

# Mover reportes de testing
foreach ($file in $testingReports) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $fileName = Split-Path $file -Leaf
        $destPath = Join-Path $testingArchivedPath $fileName
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Archivado (testing): $fileName" -ForegroundColor Green
        $movedCount++
    }
}

# Mover reportes de reports
foreach ($file in $reportsReports) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $fileName = Split-Path $file -Leaf
        $destPath = Join-Path $reportsArchivedPath $fileName
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Archivado (reports): $fileName" -ForegroundColor Green
        $movedCount++
    }
}

Write-Host "`n✅ Archivación completada:" -ForegroundColor Green
Write-Host "   • Archivos archivados: $movedCount" -ForegroundColor White
Write-Host "`n📁 Reportes archivados en:" -ForegroundColor Cyan
Write-Host "   • UI/UX: $uiUxArchivedPath" -ForegroundColor White
Write-Host "   • Testing: $testingArchivedPath" -ForegroundColor White
Write-Host "   • Reports: $reportsArchivedPath" -ForegroundColor White





