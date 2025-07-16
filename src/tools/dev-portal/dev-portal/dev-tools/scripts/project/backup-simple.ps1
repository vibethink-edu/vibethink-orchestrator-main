# backup-simple.ps1 - Script de Backup Simplificado para Windows PowerShell
# Crear copias de seguridad antes de actualizaciones

Write-Host "Creating backup of current state..." -ForegroundColor Yellow

# Function to create backup
function Create-Backup {
    param([string]$SourcePath, [string]$Description)
    if (Test-Path $SourcePath) {
        $backupPath = "$SourcePath.backup"
        Copy-Item $SourcePath $backupPath -Force
        Write-Host "SUCCESS: $Description backed up to $backupPath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "WARNING: $SourcePath not found (optional)" -ForegroundColor Yellow
        return $false
    }
}

# Verify we are in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Make sure you are in the project directory." -ForegroundColor Red
    exit 1
}

Write-Host "Project directory verified" -ForegroundColor Green

# Create backups of critical files
$backups = @()

# package.json
if (Create-Backup "package.json" "package.json") {
    $backups += "package.json"
}

# package-lock.json
if (Create-Backup "package-lock.json" "package-lock.json") {
    $backups += "package-lock.json"
}

# tsconfig.json
if (Create-Backup "tsconfig.json" "tsconfig.json") {
    $backups += "tsconfig.json"
}

# tailwind.config.js
if (Create-Backup "tailwind.config.js" "tailwind.config.js") {
    $backups += "tailwind.config.js"
}

# src/index.css
if (Create-Backup "src/index.css" "index.css") {
    $backups += "src/index.css"
}

# Document current state
$currentState = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    NodeVersion = node --version
    NpmVersion = npm --version
    Dependencies = Get-Content "package.json" | ConvertFrom-Json | Select-Object -ExpandProperty dependencies
    DevDependencies = Get-Content "package.json" | ConvertFrom-Json | Select-Object -ExpandProperty devDependencies
}

$stateFile = "backup-state-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$currentState | ConvertTo-Json -Depth 10 | Out-File $stateFile -Encoding UTF8

Write-Host "Current state documented in $stateFile" -ForegroundColor Green

# Verify backups exist
Write-Host "`nVerifying created backups..." -ForegroundColor Yellow
foreach ($backup in $backups) {
    $backupPath = "$backup.backup"
    if (Test-Path $backupPath) {
        $size = (Get-Item $backupPath).Length
        Write-Host "SUCCESS: $backupPath ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $backupPath not found" -ForegroundColor Red
    }
}

Write-Host "`nBackup completed successfully!" -ForegroundColor Green
Write-Host "Files backed up: $($backups.Count)" -ForegroundColor Cyan
Write-Host "State documented: $stateFile" -ForegroundColor Cyan

Write-Host "`nTo restore, run: .\scripts\rollback-simple.ps1" -ForegroundColor Yellow
Write-Host "You can now proceed with updates safely" -ForegroundColor Green 