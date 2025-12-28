# Script para actualizar DOCS_INDEX.md con el nuevo documento de arquitectura multi-departamento

$filePath = "DOCS_INDEX.md"
$backupPath = "DOCS_INDEX.md.backup"

# Crear backup
if (Test-Path $filePath) {
    Copy-Item $filePath $backupPath
    Write-Host "Backup creado en $backupPath"
}

# Leer el archivo
$content = Get-Content $filePath -Raw

# Reemplazar la línea específica
$oldText = '- [ViTo Architecture Implementation Status](./docs/architecture/VITO_ARCHITECTURE_IMPLEMENTATION_STATUS.md) 📊 **ESTADO ACTUAL** - Phase A completada, Phase B y C pendientes'
$newText = '- [ViTo Architecture Implementation Status](./docs/architecture/VITO_ARCHITECTURE_IMPLEMENTATION_STATUS.md) 📊 **ESTADO ACTUAL** - Phase A completada, Phase B y C pendientes'
$newText += "`n- [Arquitectura Multi-Departamento](./docs/architecture/I18N_MULTI_DEPARTMENT_ARCHITECTURE.md) 🚀 **NUEVO MILESTONE** - Infinitos departamentos con sistema i18n de 3 capas"

$content = $content -replace [regex]::Escape($oldText), $newText

# Guardar el archivo
Set-Content -Path $filePath -Value $content

Write-Host "DOCS_INDEX.md actualizado correctamente"
Write-Host "Backup guardado en $backupPath"





