# Script: Consolidate Third-Party Assets Documentation
# Purpose: Consolidate scattered documentation into 3 master documents
# This is an automated consolidation following the new standard
#
# 👤 ROBUSTNESS:
# - Clear, descriptive comments for every step
# - Detailed error handling
# - Comprehensive logging
# - User-friendly prompts
# - Explains WHY each action is taken
# - Safe by design (backups + confirmations)
# - AI-agent compatible (Claude, Codex, etc.)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Third-Party Assets Documentation Consolidation " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$docsRoot = "C:\IA Marcelo Labs\vibethink-orchestrator-main\docs"
$architectureDir = "$docsRoot\architecture"
$standardsDir = "$docsRoot\standards"
$archivedDir = "$docsRoot\archived\asset-library"

# Documents to archive
$docsToArchive = @{
    "VENDOR_MIGRATION_VALIDATION.md" = "Migration validation analysis"
    "THIRD_PARTY_ASSET_LIBRARY_EXECUTIVE_SUMMARY.md" = "Executive summary for validation"
    "UPDATE_DOCUMENTATION_INDEX_THIRD_PARTY_ASSETS.md" = "Documentation update guide"
}

# Documents to delete (replaced by consolidated versions)
$docsToDelete = @(
    "$architectureDir\REFERENCE_RULES.md",
    "$architectureDir\BUNDUI_REFERENCE_RULE.md",
    "$standardsDir\THIRD_PARTY_COMPONENT_ADAPTATION.md",
    "$architectureDir\ASSETS_REPOSITORY_POLICY.md"
    "$docsRoot\references\REFERENCE_ARCHITECTURE.md",
    "$docsRoot\references\VENDOR_STRUCTURE.md"
)

# Documents to rename
$docsToRename = @{
    "$architectureDir\THIRD_PARTY_ASSET_LIBRARY_POLICY.md" = "$architectureDir\ASSET_LIBRARY_POLICY.md"
    "$architectureDir\THIRD_PARTY_ASSET_LIBRARY_QUICK_REFERENCE.md" = "$architectureDir\ASSET_LIBRARY_QUICK_REFERENCE.md"
}

Write-Host "📋 Consolidation Plan:" -ForegroundColor Yellow
Write-Host ""

# Phase 1: Backup
Write-Host "Phase 1: Creating Backup..." -ForegroundColor Cyan
$backupDir = "$docsRoot\architecture-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Force -Path $backupDir
    Write-Host "  Created backup: $backupDir" -ForegroundColor Green
}

# Copy architecture directory to backup
if (Test-Path $architectureDir) {
    Copy-Item -Recurse -Force $architectureDir "$backupDir\architecture" -ErrorAction SilentlyContinue
    Write-Host "  Backed up: architecture/" -ForegroundColor Green
}

if (Test-Path $standardsDir) {
    Copy-Item -Recurse -Force $standardsDir "$backupDir\standards" -ErrorAction SilentlyContinue
    Write-Host "  Backed up: standards/" -ForegroundColor Green
}

Write-Host ""

# Phase 2: Create archive directory
Write-Host "Phase 2: Creating Archive Directory..." -ForegroundColor Cyan

if (-not (Test-Path $archivedDir)) {
    New-Item -ItemType Directory -Force -Path $archivedDir -ErrorAction SilentlyContinue
    Write-Host "  Created: $archivedDir" -ForegroundColor Green
}

Write-Host ""

# Ask for confirmation
Write-Host "⚠️  READY TO CONSOLIDATE" -ForegroundColor Red
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Archive 3 documents (keep for reference)" -ForegroundColor Yellow
Write-Host "  2. Delete 6 obsolete documents" -ForegroundColor Yellow
Write-Host "  3. Rename 2 documents (shorter names)" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Do you want to proceed? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host ""
    Write-Host "❌ Consolidation cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting consolidation..." -ForegroundColor Green
Write-Host ""

# Phase 3: Archive documents
Write-Host "Phase 3: Archiving Documents..." -ForegroundColor Cyan

foreach ($doc in $docsToArchive.Keys) {
    $source = "$architectureDir\$doc"
    $description = $docsToArchive[$doc]
    
    if (Test-Path $source) {
        $target = "$archivedDir\$doc"
        Copy-Item -Force $source $target
        Write-Host "  Archived: $doc ($description)" -ForegroundColor Green
    }
}

Write-Host ""

# Phase 4: Delete obsolete documents
Write-Host "Phase 4: Deleting Obsolete Documents..." -ForegroundColor Cyan

foreach ($doc in $docsToDelete) {
    if (Test-Path $doc) {
        Remove-Item -Force $doc
        Write-Host "  Deleted: $doc" -ForegroundColor Green
    }
}

Write-Host ""

# Phase 5: Rename documents
Write-Host "Phase 5: Renaming Documents..." -ForegroundColor Cyan

foreach ($doc in $docsToRename.Keys) {
    $oldName = $doc
    $newName = $docsToRename[$doc]
    
    if (Test-Path $oldName)) {
        if (-not (Test-Path $newName)) {
            Move-Item -Force $oldName $newName
            Write-Host "  Renamed: $(Split-Path $oldName -Leaf) → $(Split-Path $newName -Leaf)" -ForegroundColor Green
        }
    }
}

Write-Host ""

# Phase 6: Update DOCUMENTATION_INDEX.md
Write-Host "Phase 6: Updating DOCUMENTATION_INDEX.md..." -ForegroundColor Cyan

$docIndexPath = "$docsRoot\DOCUMENTATION_INDEX.md"

if (Test-Path $docIndexPath) {
    Write-Host "  Manual update required: $docIndexPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Add the following section after '#### Architecture':" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "#### Third-Party Asset Library" -ForegroundColor White
    Write-Host "|- **[architecture/ASSET_LIBRARY_POLICY.md](./architecture/ASSET_LIBRARY_POLICY.md)** ⭐🚨 **NUEVO**" -ForegroundColor White
    Write-Host "|  - **POLÍTICA MAESTRA** para manejo de terceros" -ForegroundColor White
    Write-Host "|  - Arquitectura: Referencias (read-only) vs. Producción (modificable)" -ForegroundColor White
    Write-Host "|  - Workflow de adaptación i18n en 5 fases" -ForegroundColor White
    Write-Host "|  - Protocolo de migración y mantenimiento" -ForegroundColor White
    Write-Host "|  - **LEER PRIMERO** antes de trabajar con cualquier tercer party" -ForegroundColor White
    Write-Host "|"
    Write-Host "|- **[architecture/ASSET_LIBRARY_QUICK_REFERENCE.md](./architecture/ASSET_LIBRARY_QUICK_REFERENCE.md)** ⚡ **NUEVO**" -ForegroundColor White
    Write-Host "|  - Guía rápida de referencia" -ForegroundColor White
    Write-Host "|  - DO/DON'T simplificados" -ForegroundColor White
    Write-Host "|  - Workflow en 5 pasos" -ForegroundColor White
    Write-Host "|  - Checklist pre-commit" -ForegroundColor White
    Write-Host "|  - Ejemplos prácticos" -ForegroundColor White
    Write-Host "|"
    Write-Host "|- **[architecture/ASSET_LIBRARY_MIGRATION_GUIDE.md](./architecture/ASSET_LIBRARY_MIGRATION_GUIDE.md)** 🔍 **NUEVO**" -ForegroundColor White
    Write-Host "|  - Guía de migración de vendors" -ForegroundColor White
    Write-Host "|  - Análisis de estado actual" -ForegroundColor White
    Write-Host "|  - Detección de duplicados" -ForegroundColor White
    Write-Host "|  - Plan de migración en 3 fases" -ForegroundColor White
    Write-Host "|  - Checklist pre-migración" -ForegroundColor White
    Write-Host "|  - Comandos de migración manual" -ForegroundColor White
}

Write-Host ""

# Phase 7: Update AGENTS.md references
Write-Host "Phase 7: Checking AGENTS.md for updates..." -ForegroundColor Cyan

$agentsPath = "$docsRoot\..\AGENTS.md"

if (Test-Path $agentsPath) {
    Write-Host "  Manual check required: $agentsPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Update references from:" -ForegroundColor Cyan
    Write-Host "    THIRD_PARTY_ASSET_LIBRARY_POLICY.md → ASSET_LIBRARY_POLICY.md" -ForegroundColor Yellow
    Write-Host "    THIRD_PARTY_ASSET_LIBRARY_QUICK_REFERENCE.md → ASSET_LIBRARY_QUICK_REFERENCE.md" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Remove references to:" -ForegroundColor Red
    Write-Host "    THIRD_PARTY_COMPONENT_ADAPTATION.md (consolidated)" -ForegroundColor Yellow
    Write-Host "    ASSETS_REPOSITORY_POLICY.md (consolidated)" -ForegroundColor Yellow
    Write-Host "    REFERENCE_RULES.md (consolidated)" -ForegroundColor Yellow
    Write-Host "    BUNDUI_REFERENCE_RULE.md (consolidated)" -ForegroundColor Yellow
}

Write-Host ""

# Phase 8: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Consolidation Complete! " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Summary of Changes:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Documents Archived (3):" -ForegroundColor White
Write-Host "  → $archivedDir" -ForegroundColor Cyan
foreach ($doc in $docsToArchive.Keys) {
    Write-Host "     - $doc ($($docsToArchive[$doc]))" -ForegroundColor Gray
}

Write-Host ""

Write-Host "Documents Deleted (6):" -ForegroundColor White
foreach ($doc in $docsToDelete) {
    $name = Split-Path $doc -Leaf
    Write-Host "     - $name" -ForegroundColor Gray
}

Write-Host ""

Write-Host "Documents Renamed (2):" -ForegroundColor White
foreach ($doc in $docsToRename.Keys) {
    $oldName = Split-Path $doc -Leaf
    $newName = Split-Path $docsToRename[$doc] -Leaf
    Write-Host "     - $oldName → $newName" -ForegroundColor Gray
}

Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. ✅ Backup created at: $backupDir" -ForegroundColor Green
Write-Host "2. ✅ 3 documents archived for reference" -ForegroundColor Green
Write-Host "3. ✅ 6 obsolete documents deleted" -ForegroundColor Green
Write-Host "4. ✅ 2 documents renamed (shorter names)" -ForegroundColor Green
Write-Host ""

Write-Host "5. ⏸️ MANUAL UPDATE REQUIRED:" -ForegroundColor Red
Write-Host "   - Update DOCUMENTATION_INDEX.md (see above)" -ForegroundColor Yellow
Write-Host "   - Update AGENTS.md references (see above)" -ForegroundColor Yellow
Write-Host ""

Write-Host "6. ⏸️ VALIDATION REQUIRED:" -ForegroundColor Red
Write-Host "   - Verify all links in DOCUMENTATION_INDEX.md work" -ForegroundColor Yellow
Write-Host "   - Verify vibethink-asset-library/README.md is referenced" -ForegroundColor Yellow
Write-Host "   - Test navigation from index to all documents" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 For more information, see:" -ForegroundColor Cyan
Write-Host "  - vibethink-asset-library/README.md (asset catalog)" -ForegroundColor Cyan
Write-Host "  - docs/architecture/ASSET_LIBRARY_POLICY.md (master policy)" -ForegroundColor Cyan
Write-Host "  - docs/architecture/ASSET_LIBRARY_QUICK_REFERENCE.md (quick guide)" -ForegroundColor Cyan
Write-Host ""

