# ============================================================================
# START SHADCN UI REFERENCE
# ============================================================================
# Starts the official Shadcn UI reference server using global port assignment
# This is for visual reference and component comparison purposes
# Source: https://github.com/shadcn-ui/ui (103k stars, MIT License)
# Port Assignment: See _vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md
# ============================================================================

# Import Port Manager Module (Global Standard)
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"

if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force -ErrorAction SilentlyContinue
    $PORT = Get-ReferencePort -ReferenceName "shadcn"
    $REF_INFO = Get-ReferenceInfo -ReferenceName "shadcn"
    
    if ($PORT) {
        Write-Host "📋 Using global port assignment: $PORT" -ForegroundColor Green
    } else {
        Write-Warning "⚠️  Could not load port assignment. Using fallback port 3051"
        $PORT = 3051
        $REF_INFO = $null
    }
} else {
    Write-Warning "⚠️  PortManager module not found at: $PortManagerPath"
    Write-Warning "   Using fallback port 3051 (global standard)"
    $PORT = 3051
    $REF_INFO = $null
}
$SHADCN_DIR = "C:\IA Marcelo Labs\shadcn-ui\ui"
$V4_DIR = "$SHADCN_DIR\apps\v4"

Write-Host "📦 Starting Shadcn UI Reference (Official)..." -ForegroundColor Cyan

# Check if directory exists
if (-not (Test-Path $SHADCN_DIR)) {
    Write-Host "❌ Shadcn UI directory not found at: $SHADCN_DIR" -ForegroundColor Red
    Write-Host "Clone it with: git clone https://github.com/shadcn-ui/ui.git `"$SHADCN_DIR`"" -ForegroundColor Yellow
    exit 1
}

# Check if port is actively listening (ignore TIME_WAIT connections)
$portListening = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($portListening) {
    Write-Host "⚠️  Port $PORT is already in use" -ForegroundColor Yellow
    Write-Host "Run .\scripts\stop-shadcn-reference.ps1 first to stop existing server" -ForegroundColor Yellow
    exit 1
}

# Check if pnpm is installed
$pnpmVersion = pnpm --version 2>$null
if (-not $pnpmVersion) {
    Write-Host "📦 Installing pnpm globally..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Check if node_modules exists in root
if (-not (Test-Path "$SHADCN_DIR\node_modules")) {
    Write-Host "📦 Installing dependencies (first time setup)..." -ForegroundColor Yellow
    Push-Location $SHADCN_DIR
    pnpm install
    Pop-Location
}

# Build shadcn package if not built (required dependency)
if (-not (Test-Path "$SHADCN_DIR\packages\shadcn\dist\index.js")) {
    Write-Host "🔨 Building shadcn package..." -ForegroundColor Yellow
    Push-Location $SHADCN_DIR
    pnpm --filter=shadcn build
    Pop-Location
}

# Set required environment variables
$env:NEXT_PUBLIC_APP_URL = "http://localhost:$PORT"
$env:NEXT_PUBLIC_V0_URL = "https://v0.dev"

# Start the dev server (v4 app on custom port)
# Using webpack instead of turbopack due to monorepo conflicts
Write-Host "Starting Next.js dev server on port $PORT..." -ForegroundColor Green
Write-Host "📚 Documentation: https://ui.shadcn.com/docs" -ForegroundColor Gray
Write-Host "⚠️  Note: First load may take 30-60 seconds" -ForegroundColor Yellow
Push-Location $V4_DIR
pnpm next dev --port $PORT
Pop-Location
