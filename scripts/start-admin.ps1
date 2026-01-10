# Start Admin Console Dev Server
# Port: 3002 (Admin Console standard port)

Write-Host "🔐 Starting ViTo Admin Console (Internal Staff Only)..." -ForegroundColor Cyan

$port = 3002
$projectRoot = Split-Path -Parent $PSScriptRoot
$adminPath = Join-Path $projectRoot "apps\admin"

# --- 1. HEALTH CHECKS ---

# Check admin directory structure
if (-not (Test-Path $adminPath)) {
    Write-Host "❌ Admin directory not found: $adminPath" -ForegroundColor Red
    exit 1
}

# Check .env.local (Security Critical)
$envPath = Join-Path $adminPath ".env.local"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env.local not found in apps/admin" -ForegroundColor Red
    Write-Host "👉 Action: Copy .env.local.example to .env.local and configure Supabase credentials" -ForegroundColor Yellow
    exit 1
}

# Check node_modules (Dependencies)
$nodeModulesPath = Join-Path $adminPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "⚠️  Dependencies not found (node_modules missing)" -ForegroundColor Yellow
    Write-Host "📦 Installing dependencies via pnpm..." -ForegroundColor Cyan
    try {
        Push-Location $projectRoot # Run install from root for monorepo sanity
        pnpm install --filter @vibethink/admin
        Pop-Location
        Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install dependencies. Please run 'pnpm install' manually." -ForegroundColor Red
        if ($PWD.Path -ne $projectRoot) { Pop-Location }
        exit 1
    }
}

# --- 2. PORT CHECK ---

# Check if port is already in use
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    # Handle single/multiple connections
    $uniqueProcessIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }
    
    $validProcessIds = @()
    foreach ($pidToCheck in $uniqueProcessIds) {
        try {
            $proc = Get-Process -Id $pidToCheck -ErrorAction Stop
            $validProcessIds += $pidToCheck
        }
        catch { /* TIME_WAIT process */ }
    }
    
    if ($validProcessIds.Count -gt 0) {
        Write-Host "⚠️  Port $port is already in use. Attempting to stop existing process..." -ForegroundColor Yellow
        try {
            # Auto-heal: Try to stop the process using our own stop script
            $stopScript = Join-Path $PSScriptRoot "stop-admin.ps1"
            if (Test-Path $stopScript) {
                & $stopScript
                Start-Sleep -Seconds 2 # Wait for port release
            }
            else {
                Write-Host "❌ Stop script not found. Please kill process manually." -ForegroundColor Red
                exit 1
            }
        }
        catch {
            Write-Host "❌ Failed to stop existing process." -ForegroundColor Red
            exit 1
        }
    }
}

# --- 3. START SERVER ---

Write-Host "🚀 Starting Admin Console on port $port..." -ForegroundColor Green
Write-Host "⚠️  SECURITY ALERT: Internal Tool - Do NOT expose to public internet." -ForegroundColor Yellow
Write-Host "🌐 URL: http://localhost:$port/tenants" -ForegroundColor Cyan

# Optional: Auto-open browser after slight delay
$job = Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3002/tenants"
}

try {
    Push-Location $adminPath
    # Use 'cmd /c' to allow proper signal handling in some terminals
    cmd /c "npx next dev --port $port"
}
catch {
    Write-Host "❌ Error starting dev server: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}
finally {
    Pop-Location
}
