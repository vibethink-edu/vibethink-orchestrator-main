# 🔍 DIAGNÓSTICO RÁPIDO - Dashboard Bundui
# Ejecuta este script y comparte el resultado

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔍 DIAGNÓSTICO DASHBOARD-BUNDUI                            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. Verificar servidor
Write-Host "1️⃣ SERVIDOR:" -ForegroundColor Yellow
$port = 3005
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($connections) {
    $pid = $connections | Select-Object -First 1 -ExpandProperty OwningProcess
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    Write-Host "   ✅ Corriendo en puerto $port (PID: $pid)" -ForegroundColor Green
    Write-Host "   📊 Proceso: $($process.ProcessName)" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ NO está corriendo en puerto $port" -ForegroundColor Red
    Write-Host "   💡 Ejecuta: .\scripts\start-dashboard-bundui.ps1`n" -ForegroundColor Yellow
    exit
}

# 2. Verificar CSS import
Write-Host "`n2️⃣ CSS GLOBAL:" -ForegroundColor Yellow
$layoutPath = "apps\dashboard\app\layout.tsx"
$layoutContent = Get-Content $layoutPath -Raw
if ($layoutContent -match '@vibethink/ui/globals.css') {
    Write-Host "   ✅ Usando @vibethink/ui/globals.css (CORRECTO)" -ForegroundColor Green
} else {
    Write-Host "   ❌ NO usa @vibethink/ui/globals.css" -ForegroundColor Red
}

# 3. Verificar archivo CSS existe
Write-Host "`n3️⃣ ARCHIVO CSS:" -ForegroundColor Yellow
$cssPath = "packages\ui\src\globals.css"
if (Test-Path $cssPath) {
    $cssSize = (Get-Item $cssPath).Length
    Write-Host "   ✅ packages/ui/src/globals.css existe ($cssSize bytes)" -ForegroundColor Green
} else {
    Write-Host "   ❌ packages/ui/src/globals.css NO existe" -ForegroundColor Red
}

# 4. Verificar errores TypeScript
Write-Host "`n4️⃣ ERRORES TYPESCRIPT:" -ForegroundColor Yellow
Push-Location "apps\dashboard"
$errors = pnpm tsc --noEmit 2>&1 | Select-String -Pattern "dashboard-bundui.*error"
$errorCount = ($errors | Measure-Object).Count
if ($errorCount -eq 0) {
    Write-Host "   ✅ 0 errores en dashboard-bundui" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  $errorCount errores en dashboard-bundui" -ForegroundColor Yellow
    $errors | Select-Object -First 3 | ForEach-Object {
        Write-Host "      $_" -ForegroundColor Red
    }
}
Pop-Location

# 5. Verificar página projects-v2
Write-Host "`n5️⃣ PÁGINA PROJECTS-V2:" -ForegroundColor Yellow
$pagePath = "apps\dashboard\app\dashboard-bundui\projects-v2\page.tsx"
if (Test-Path $pagePath) {
    Write-Host "   ✅ page.tsx existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ page.tsx NO existe" -ForegroundColor Red
}

# 6. Test HTTP
Write-Host "`n6️⃣ TEST HTTP:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$port" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ Servidor responde: HTTP $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Servidor no responde: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Verificar .next build
Write-Host "`n7️⃣ BUILD CACHE:" -ForegroundColor Yellow
$nextPath = "apps\dashboard\.next"
if (Test-Path $nextPath) {
    Write-Host "   ✅ .next folder existe" -ForegroundColor Green
    Write-Host "   💡 Si hay problemas, prueba: Remove-Item -Recurse -Force .next" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  .next folder NO existe (primera compilación)" -ForegroundColor Yellow
}

# Resumen
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📋 RESUMEN                                                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "URL de prueba: http://localhost:$port/dashboard-bundui/projects-v2`n" -ForegroundColor Green

Write-Host "💡 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "   1. Abre el browser en la URL de arriba" -ForegroundColor White
Write-Host "   2. Presiona F12 para abrir DevTools" -ForegroundColor White
Write-Host "   3. Ve a la pestaña Console" -ForegroundColor White
Write-Host "   4. Comparte cualquier error que veas en rojo`n" -ForegroundColor White

Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
