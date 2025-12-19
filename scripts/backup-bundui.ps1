# ============================================================================
# SCRIPT DE BACKUP BUNDUI MONOREPO
# ============================================================================
# Propósito: Crear backup incremental antes de cambios importantes
# Uso: .\scripts\backup-bundui.ps1 -Description "Descripción del cambio"
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Description = "Backup automático"
)

$ErrorActionPreference = "Stop"

# Configuración
$ProjectRoot = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$BackupRoot = "C:\IA Marcelo Labs\vibethink-orchestrator-main\backups"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$BackupName = "bundui-backup_$Timestamp"
$BackupPath = Join-Path $BackupRoot $BackupName

# Directorios a respaldar
$DirsToBackup = @(
    "apps\dashboard\app\dashboard-bundui",
    "packages\ui\src\components\bundui",
    "packages\ui\src\index.ts"
)

Write-Host ""
Write-Host "🛡️  BUNDUI BACKUP SYSTEM" -ForegroundColor Cyan
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Descripción: $Description" -ForegroundColor White
Write-Host "📁 Destino:     $BackupPath" -ForegroundColor White
Write-Host ""

# Crear directorio de backups si no existe
if (-not (Test-Path $BackupRoot)) {
    Write-Host "📁 Creando directorio de backups..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $BackupRoot | Out-Null
}

# Crear directorio de este backup
Write-Host "📦 Creando backup..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $BackupPath | Out-Null

# Respaldar cada directorio
$TotalSize = 0
$FileCount = 0

foreach ($dir in $DirsToBackup) {
    $SourcePath = Join-Path $ProjectRoot $dir
    
    if (Test-Path $SourcePath) {
        $DestPath = Join-Path $BackupPath $dir
        $ParentDir = Split-Path $DestPath -Parent
        
        Write-Host "   📂 Respaldando: $dir..." -ForegroundColor Gray
        
        # Crear directorio padre si no existe
        if (-not (Test-Path $ParentDir)) {
            New-Item -ItemType Directory -Path $ParentDir -Force | Out-Null
        }
        
        # Copiar
        if (Test-Path $SourcePath -PathType Container) {
            Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
            
            # Calcular tamaño
            $Size = (Get-ChildItem -Path $DestPath -Recurse -File | Measure-Object -Property Length -Sum).Sum
            $Count = (Get-ChildItem -Path $DestPath -Recurse -File).Count
            
            $TotalSize += $Size
            $FileCount += $Count
            
            Write-Host "      ✅ Copiados $Count archivos" -ForegroundColor Green
        } else {
            Copy-Item -Path $SourcePath -Destination $DestPath -Force
            $Size = (Get-Item $DestPath).Length
            $TotalSize += $Size
            $FileCount++
            Write-Host "      ✅ Copiado 1 archivo" -ForegroundColor Green
        }
    } else {
        Write-Host "      ⚠️  No existe: $dir" -ForegroundColor Yellow
    }
}

# Crear archivo de metadata
$MetadataPath = Join-Path $BackupPath "BACKUP_INFO.txt"
$Metadata = @"
BUNDUI BACKUP INFORMATION
========================

Fecha/Hora:  $Timestamp
Descripción: $Description
Archivos:    $FileCount
Tamaño:      $([math]::Round($TotalSize / 1MB, 2)) MB

Directorios respaldados:
$($DirsToBackup | ForEach-Object { "  - $_" } | Out-String)

Cómo restaurar:
===============
1. Detener servidor: .\scripts\stop-dashboard.ps1
2. Copiar contenido de este backup a la raíz del proyecto
3. Reiniciar servidor: .\scripts\start-dashboard.ps1

Comando de restauración:
------------------------
Copy-Item -Path "$BackupPath\*" -Destination "$ProjectRoot\" -Recurse -Force

"@

$Metadata | Out-File -FilePath $MetadataPath -Encoding UTF8

# Crear índice de backups
$IndexPath = Join-Path $BackupRoot "BACKUP_INDEX.txt"
$IndexEntry = "$Timestamp | $Description | $FileCount archivos | $([math]::Round($TotalSize / 1MB, 2)) MB"

Add-Content -Path $IndexPath -Value $IndexEntry

Write-Host ""
Write-Host "✅ BACKUP COMPLETADO" -ForegroundColor Green
Write-Host "═" * 80 -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estadísticas:" -ForegroundColor White
Write-Host "   Archivos:  $FileCount" -ForegroundColor Gray
Write-Host "   Tamaño:    $([math]::Round($TotalSize / 1MB, 2)) MB" -ForegroundColor Gray
Write-Host "   Ubicación: $BackupPath" -ForegroundColor Gray
Write-Host ""
Write-Host "🔄 Para restaurar:" -ForegroundColor Yellow
Write-Host "   .\scripts\restore-bundui.ps1 -BackupName '$BackupName'" -ForegroundColor White
Write-Host ""

# Listar backups recientes
Write-Host "📋 Backups recientes:" -ForegroundColor Cyan
Get-ChildItem -Path $BackupRoot -Directory | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 5 | 
    ForEach-Object {
        $Age = (Get-Date) - $_.LastWriteTime
        $AgeStr = if ($Age.TotalHours -lt 1) {
            "$([math]::Round($Age.TotalMinutes)) minutos"
        } elseif ($Age.TotalDays -lt 1) {
            "$([math]::Round($Age.TotalHours)) horas"
        } else {
            "$([math]::Round($Age.TotalDays)) días"
        }
        Write-Host "   📦 $($_.Name) (hace $AgeStr)" -ForegroundColor Gray
    }

Write-Host ""


