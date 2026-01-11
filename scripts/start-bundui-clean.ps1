# 🚀 Start Dashboard-Bundui con idioma EN por defecto
# Este script inicia el dashboard y resetea el idioma a inglés

Write-Host "`n🚀 Iniciando Dashboard-Bundui (EN)...`n" -ForegroundColor Cyan

# 1. Limpiar cache si existe
if (Test-Path "apps\dashboard\.next") {
    Write-Host "🧹 Limpiando cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "apps\dashboard\.next" -ErrorAction SilentlyContinue
    Write-Host "✅ Cache limpiado`n" -ForegroundColor Green
}

# 2. Iniciar servidor
Write-Host "🚀 Iniciando servidor en puerto 3005..." -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:3005/dashboard-bundui/projects-v2" -ForegroundColor Cyan
Write-Host "🇺🇸 Idioma: English (por defecto)`n" -ForegroundColor Yellow

# 3. Mostrar instrucciones para cambiar idioma si es necesario
Write-Host "💡 Para cambiar idioma:" -ForegroundColor Magenta
Write-Host "   1. Abre el dashboard" -ForegroundColor White
Write-Host "   2. Busca el selector de idioma (arriba a la derecha)" -ForegroundColor White
Write-Host "   3. Selecciona tu idioma preferido`n" -ForegroundColor White

# 4. Iniciar servidor
$projectRoot = Split-Path -Parent $PSScriptRoot
$dashboardPath = Join-Path $projectRoot "apps\dashboard"

Push-Location $dashboardPath
pnpm run dev -- -p 3005
Pop-Location
