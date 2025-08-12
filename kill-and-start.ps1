# kill-and-start.ps1 - Script rápido para matar Node.js y iniciar dashboard
# Uso: .\kill-and-start.ps1 [puerto]

param(
    [Parameter(Mandatory=$false)]
    [int]$Port = 3001
)

Write-Host "🔥 Matando todos los procesos Node.js..." -ForegroundColor Red

# Matar todos los procesos Node.js sin preguntas
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Procesos Node.js eliminados" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No había procesos Node.js activos" -ForegroundColor Yellow
}

# Esperar un momento
Start-Sleep -Seconds 2

# Cambiar al directorio dashboard
Set-Location "apps\dashboard"

Write-Host "🚀 Iniciando Dashboard en puerto $Port..." -ForegroundColor Green

# Iniciar servidor
npx next@15.3.4 dev -p $Port