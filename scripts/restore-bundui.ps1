# ============================================================================
# SCRIPT DE RESTAURACIÓN BUNDUI MONOREPO
# ============================================================================
# Propósito: Restaurar backup de Bundui
# Uso: .\scripts\restore-bundui.ps1 -BackupName "bundui-backup_2025-12-18_123456"
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$BackupName = ""
)

$ErrorActionPreference = "Stop"

$ProjectRoot = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$BackupRoot = "C:\IA Marcelo Labs\vibethink-orchestrator-main\backups"

Write-Host ""
Write-Host "🔄 BUNDUI RESTORE SYSTEM" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""

# Si no se especificó backup, listar disponibles
if ([string]::IsNullOrEmpty($BackupName)) {
    Write-Host "📋 Backups disponibles:" -ForegroundColor Yellow
    Write-Host ""
    
    $Backups = Get-ChildItem -Path $BackupRoot -Directory | 
        Sort-Object LastWriteTime -Descending
    
    if ($Backups.Count -eq 0) {
        Write-Host "❌ No hay backups disponibles" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
    
    $Index = 1
    foreach ($backup in $Backups) {
        $InfoPath = Join-Path $backup.FullName "BACKUP_INFO.txt"
        
        Write-Host "   [$Index] $($backup.Name)" -ForegroundColor White
        
        if (Test-Path $InfoPath) {
            $InfoContent = Get-Content $InfoPath -Raw
            if ($InfoContent -match "Descripción:\s*(.+)") {
                Write-Host "       📝 $($matches[1])" -ForegroundColor Gray
            }
            if ($InfoContent -match "Tamaño:\s*(.+)") {
                Write-Host "       📊 $($matches[1])" -ForegroundColor Gray
            }
        }
        
        $Age = (Get-Date) - $backup.LastWriteTime
        $AgeStr = if ($Age.TotalHours -lt 1) {
            "$([math]::Round($Age.TotalMinutes)) minutos"
        } elseif ($Age.TotalDays -lt 1) {
            "$([math]::Round($Age.TotalHours)) horas"
        } else {
            "$([math]::Round($Age.TotalDays)) días"
        }
        Write-Host "       ⏰ Hace $AgeStr" -ForegroundColor Gray
        Write-Host ""
        
        $Index++
    }
    
    Write-Host "🎯 Uso:" -ForegroundColor Yellow
    Write-Host "   .\scripts\restore-bundui.ps1 -BackupName 'bundui-backup_YYYY-MM-DD_HHMMSS'" -ForegroundColor White
    Write-Host ""
    exit 0
}

# Validar que existe el backup
$BackupPath = Join-Path $BackupRoot $BackupName

if (-not (Test-Path $BackupPath)) {
    Write-Host "❌ ERROR: Backup no encontrado" -ForegroundColor Red
    Write-Host "   Ruta: $BackupPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Usa sin parámetros para ver backups disponibles:" -ForegroundColor Yellow
    Write-Host "   .\scripts\restore-bundui.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Mostrar información del backup
$InfoPath = Join-Path $BackupPath "BACKUP_INFO.txt"
if (Test-Path $InfoPath) {
    Write-Host "📋 Información del backup:" -ForegroundColor White
    Write-Host ""
    Get-Content $InfoPath | Select-Object -First 10 | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Gray
    }
    Write-Host ""
}

# Confirmación
Write-Host "⚠️  ADVERTENCIA:" -ForegroundColor Yellow
Write-Host "   Esta operación sobrescribirá los archivos actuales" -ForegroundColor Red
Write-Host ""
$Confirmation = Read-Host "¿Continuar? (escribe 'SI' para confirmar)"

if ($Confirmation -ne "SI") {
    Write-Host ""
    Write-Host "❌ Restauración cancelada" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "🔄 Restaurando backup..." -ForegroundColor Yellow
Write-Host ""

# Detener servidor
Write-Host "   🛑 Deteniendo servidor..." -ForegroundColor Gray
& "$ProjectRoot\scripts\stop-dashboard.ps1" 2>&1 | Out-Null
Start-Sleep -Seconds 2

# Restaurar archivos
$DirsToRestore = Get-ChildItem -Path $BackupPath -Directory -Recurse | 
    Where-Object { $_.Name -ne "BACKUP_INFO.txt" }

$FileCount = 0

# Copiar directorios principales
$MainDirs = Get-ChildItem -Path $BackupPath -Directory | 
    Where-Object { $_.Name -in @("apps", "packages") }

foreach ($dir in $MainDirs) {
    $DestPath = Join-Path $ProjectRoot $dir.Name
    
    Write-Host "   📂 Restaurando: $($dir.Name)..." -ForegroundColor Gray
    
    Copy-Item -Path $dir.FullName -Destination $ProjectRoot -Recurse -Force
    
    $Count = (Get-ChildItem -Path $dir.FullName -Recurse -File).Count
    $FileCount += $Count
    
    Write-Host "      ✅ Restaurados $Count archivos" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ RESTAURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "═" * 80 -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estadísticas:" -ForegroundColor White
Write-Host "   Archivos restaurados: $FileCount" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Reinicia el servidor:" -ForegroundColor Yellow
Write-Host "   .\scripts\start-dashboard.ps1" -ForegroundColor White
Write-Host ""


