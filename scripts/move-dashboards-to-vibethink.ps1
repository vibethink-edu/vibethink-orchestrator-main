# Script para mover dashboards de dashboard-bundui a dashboard-vibethink
# Ejecutar cuando el servidor NO esté corriendo

$dashboards = @(
    'ai-chat',
    'calendar',
    'crypto',
    'file-manager',
    'finance',
    'mail',
    'notes',
    'pos-system',
    'project-management',
    'tasks'
)

$basePath = "apps/dashboard/app"
$source = "$basePath/dashboard-bundui"
$dest = "$basePath/dashboard-vibethink"

Write-Host "🔄 Moviendo dashboards de dashboard-bundui a dashboard-vibethink..." -ForegroundColor Cyan

foreach ($dash in $dashboards) {
    $sourcePath = Join-Path $source $dash
    $destPath = Join-Path $dest $dash
    
    if (Test-Path $sourcePath) {
        if (Test-Path $destPath) {
            Write-Host "⚠️  $dash ya existe en destino, saltando..." -ForegroundColor Yellow
        } else {
            try {
                Write-Host "📦 Moviendo: $dash..." -ForegroundColor Green
                git mv $sourcePath $destPath
                Write-Host "  ✅ $dash movido correctamente" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Error moviendo $dash : $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "⚠️  $dash no existe en origen" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Proceso completado!" -ForegroundColor Cyan

