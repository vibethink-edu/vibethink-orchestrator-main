# Script PowerShell para evaluar componentes
# Uso: .\scripts\evaluate-component.ps1 <component-path>

param(
    [Parameter(Mandatory=$true)]
    [string]$ComponentPath
)

Write-Host "🔍 Evaluando componente: $ComponentPath" -ForegroundColor Green

# Verificar que el archivo existe
if (-not (Test-Path $ComponentPath)) {
    Write-Host "❌ Error: Archivo no encontrado: $ComponentPath" -ForegroundColor Red
    exit 1
}

# Ejecutar el evaluador de componentes
try {
    node scripts/component-evaluator.js $ComponentPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Evaluación completada exitosamente" -ForegroundColor Green
        
        # Generar documentación IA-friendly
        $componentName = [System.IO.Path]::GetFileNameWithoutExtension($ComponentPath)
        $docPath = "docs/components/$componentName.md"
        
        Write-Host "📄 Generando documentación IA-friendly en: $docPath" -ForegroundColor Yellow
        
        # Crear directorio si no existe
        $docDir = Split-Path $docPath -Parent
        if (-not (Test-Path $docDir)) {
            New-Item -ItemType Directory -Path $docDir -Force | Out-Null
        }
        
        # Copiar template y personalizar
        Copy-Item "docs/templates/ai-friendly-doc.md" $docPath -Force
        
        Write-Host "✅ Documentación generada: $docPath" -ForegroundColor Green
        Write-Host "📝 Edita el archivo para personalizar la documentación" -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ Error en la evaluación" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error ejecutando evaluador: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Proceso completado!" -ForegroundColor Green 