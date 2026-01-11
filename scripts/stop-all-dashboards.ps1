# Stop All Dashboards
# Detiene todos los dashboards en ejecución

Write-Host "`n🛑 Stopping All Dashboards..." -ForegroundColor Cyan

$scriptPath = $PSScriptRoot

# Stop Dashboard-Bundui (Port 3005)
Write-Host "`n📦 Dashboard-Bundui (Port 3005):" -ForegroundColor Yellow
& "$scriptPath\stop-dashboard-bundui.ps1"

# Stop Dashboard-Admin (Port 3006)
Write-Host "`n🔧 Dashboard-Admin (Port 3006):" -ForegroundColor Yellow
& "$scriptPath\stop-dashboard-admin.ps1"

# Stop Dashboard-Tenant (Port 3007)
Write-Host "`n👥 Dashboard-Tenant (Port 3007):" -ForegroundColor Yellow
& "$scriptPath\stop-dashboard-tenant.ps1"

Write-Host "`n✅ All dashboards stopped successfully!`n" -ForegroundColor Green
