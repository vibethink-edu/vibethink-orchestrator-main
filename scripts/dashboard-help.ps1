# Dashboard Helper - Recordatorio de Scripts
# Muestra información rápida sobre qué script usar

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 VIBETHINK ORCHESTRATOR - DASHBOARD SCRIPTS             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Leer configuración
$configPath = Join-Path $PSScriptRoot ".dashboards.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath | ConvertFrom-Json
    
    Write-Host "📦 DASHBOARD PRINCIPAL (Base para desarrollo):" -ForegroundColor Green
    Write-Host "   Dashboard-Bundui - Puerto 3005" -ForegroundColor Yellow
    Write-Host "   Comando: .\scripts\start-dashboard-bundui.ps1" -ForegroundColor White
    Write-Host "   URL: http://localhost:3005/dashboard-bundui/projects-v2`n" -ForegroundColor Cyan
    
    Write-Host "🔧 OTROS DASHBOARDS:" -ForegroundColor Green
    Write-Host "   Dashboard-Admin  - Puerto 3006 - .\scripts\start-dashboard-admin.ps1" -ForegroundColor White
    Write-Host "   Dashboard-Tenant - Puerto 3007 - .\scripts\start-dashboard-tenant.ps1`n" -ForegroundColor White
    
    Write-Host "🛑 DETENER TODOS:" -ForegroundColor Red
    Write-Host "   .\scripts\stop-all-dashboards.ps1`n" -ForegroundColor White
    
    Write-Host "💡 RECORDATORIOS:" -ForegroundColor Magenta
    foreach ($reminder in $config.reminders.PSObject.Properties) {
        Write-Host "   • $($reminder.Value)" -ForegroundColor Yellow
    }
    
    Write-Host "`n📚 DOCUMENTACIÓN:" -ForegroundColor Green
    Write-Host "   Quick Start: QUICK_START.md" -ForegroundColor White
    Write-Host "   Arquitectura: apps/dashboard/DASHBOARD_ARCHITECTURE.md" -ForegroundColor White
    Write-Host "   Scripts: scripts/DASHBOARD_SCRIPTS_README.md`n" -ForegroundColor White
}
else {
    Write-Host "⚠️  Configuración no encontrada. Usando valores por defecto.`n" -ForegroundColor Yellow
    
    Write-Host "📦 DASHBOARD PRINCIPAL:" -ForegroundColor Green
    Write-Host "   .\scripts\start-dashboard-bundui.ps1 (Puerto 3005)`n" -ForegroundColor White
    
    Write-Host "🔧 OTROS DASHBOARDS:" -ForegroundColor Green
    Write-Host "   .\scripts\start-dashboard-admin.ps1 (Puerto 3006)" -ForegroundColor White
    Write-Host "   .\scripts\start-dashboard-tenant.ps1 (Puerto 3007)`n" -ForegroundColor White
}

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Ejecuta este script siempre que necesites recordar         ║" -ForegroundColor Cyan
Write-Host "║  Comando: .\scripts\dashboard-help.ps1                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
