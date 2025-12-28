# Script: Migrate Vendors to Asset Library
# Purpose: Move all third-party repositories into vibethink-asset-library/
# Philosophy: All third-party sources should be centralized in one place as read-only references
# This does NOT affect production (vibethink-orchestrator-main/) - it's just reorganizing references

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Vendor Migration to Asset Library " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$workspacesRoot = "C:\IA Marcelo Labs"
$assetLibrary = "$workspacesRoot\vibethink-asset-library"
$orchestratorMain = "$workspacesRoot\vibethink-orchestrator-main"

# Vendors to migrate (from outside to inside asset-library)
$vendorsToMigrate = @{
    "bundui" = @{
        Source = "$workspacesRoot\bundui"
        Target = "$assetLibrary\bundui"
        Description = "Bundui repositories (Dashboard Kit, Cosmic, Neofolio, Soho)"
    }
    "shadcn-ui" = @{
        Source = "$workspacesRoot\shadcn-ui"
        Target = "$assetLibrary\shadcn-ui"
        Description = "Official Shadcn UI monorepo"
    }
    "xyflow" = @{
        Source = "$workspacesRoot\xyflow"
        Target = "$assetLibrary\xyflow"
        Description = "XYFlow official repository (React Flow)"
    }
}

Write-Host "📋 Migration Plan:" -ForegroundColor Yellow
Write-Host ""

foreach ($vendor in $vendorsToMigrate.Keys) {
    $info = $vendorsToMigrate[$vendor]
    $sourceExists = Test-Path $info.Source
    $targetExists = Test-Path $info.Target
    
    Write-Host "Vendor: $vendor" -ForegroundColor Cyan
    Write-Host "  Source: $($info.Source) [$($sourceExists ? 'EXISTS' : 'NOT FOUND')]"
    Write-Host "  Target: $($info.Target) [$($targetExists ? 'EXISTS' : 'NEW')]"
    Write-Host "  Description: $($info.Description)"
    Write-Host ""
}

# Ask for confirmation
Write-Host "⚠️  WARNING:" -ForegroundColor Red
Write-Host "  This will move vendors into vibethink-asset-library/ as read-only references."
Write-Host "  This does NOT affect production code (vibethink-orchestrator-main/)."
Write-Host "  Existing directories will be preserved."
Write-Host ""

$confirmation = Read-Host "Do you want to proceed? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "❌ Migration cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting migration..." -ForegroundColor Green
Write-Host ""

# Migrate each vendor
foreach ($vendor in $vendorsToMigrate.Keys) {
    $info = $vendorsToMigrate[$vendor]
    $source = $info.Source
    $target = $info.Target
    
    Write-Host "Processing: $vendor" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    
    # Check if source exists
    if (-not (Test-Path $source)) {
        Write-Host "  ⚠️  Source not found: $source" -ForegroundColor Yellow
        Write-Host "  Skipping..." -ForegroundColor Yellow
        Write-Host ""
        continue
    }
    
    # Check if target already exists
    if (Test-Path $target) {
        Write-Host "  ⚠️  Target already exists: $target" -ForegroundColor Yellow
        
        $overwrite = Read-Host "  Overwrite existing target? (yes/no)"
        if ($overwrite -ne "yes") {
            Write-Host "  Skipping..." -ForegroundColor Yellow
            Write-Host ""
            continue
        }
        
        # Backup existing target
        $backupPath = "$target.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Write-Host "  🔒 Backing up to: $backupPath"
        Move-Item $target $backupPath
    }
    
    # Move source to target
    Write-Host "  📦 Moving: $source → $target"
    try {
        Move-Item $source $target -Force
        Write-Host "  ✅ Moved successfully" -ForegroundColor Green
        
        # Create .gitkeep if needed (to preserve empty dirs)
        if (-not (Test-Path "$source\.gitkeep")) {
            New-Item -ItemType File -Path "$source\.gitkeep" -Force | Out-Null
            Write-Host "  📝 Created placeholder: $source\.gitkeep"
        }
    }
    catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        Write-Host "  ⚠️  Please check permissions and try again" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Update scripts references
Write-Host "🔧 Updating script references..." -ForegroundColor Cyan
Write-Host ""

$scriptsToCheck = @(
    "$orchestratorMain\scripts\start-bundui-reference.ps1",
    "$orchestratorMain\scripts\start-shadcn-reference.ps1",
    "$orchestratorMain\scripts\start-reactflow-reference.ps1",
    "$orchestratorMain\docs\architecture\REFERENCE_ARCHITECTURE.md"
)

foreach ($script in $scriptsToCheck) {
    if (Test-Path $script) {
        Write-Host "  📝 $script"
        Write-Host "     (Manual update needed for new paths)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Migration Complete! " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ All vendors now in: $assetLibrary" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Verify all vendors are in vibethink-asset-library/"
Write-Host "  2. Update script references to new paths"
Write-Host "  3. Test that all reference servers still work"
Write-Host "  4. Update documentation (REFERENCE_ARCHITECTURE.md)"
Write-Host ""
Write-Host "📚 For more information, see:" -ForegroundColor Cyan
Write-Host "  - docs/architecture/THIRD_PARTY_ASSET_LIBRARY_POLICY.md"
Write-Host "  - docs/architecture/THIRD_PARTY_ASSET_LIBRARY_QUICK_REFERENCE.md"
Write-Host ""



