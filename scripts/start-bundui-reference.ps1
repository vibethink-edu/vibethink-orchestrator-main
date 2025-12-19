# ============================================================================
# START BUNDUI REFERENCE
# ============================================================================
# Starts the Bundui Premium reference server using global port assignment
# This is for visual reference and comparison purposes only
# Source: https://github.com/bundui/shadcn-ui-kit-dashboard
# Port Assignment: See _vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md
# ============================================================================

# Import Port Manager Module (Global Standard)
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"

if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force -ErrorAction SilentlyContinue
    $PORT = Get-ReferencePort -ReferenceName "bundui"
    $REF_INFO = Get-ReferenceInfo -ReferenceName "bundui"
    
    if ($PORT) {
        Write-Host "📋 Using global port assignment: $PORT" -ForegroundColor Green
    } else {
        Write-Warning "⚠️  Could not load port assignment. Using fallback port 3050"
        $PORT = 3050
        $REF_INFO = $null
    }
} else {
    Write-Warning "⚠️  PortManager module not found at: $PortManagerPath"
    Write-Warning "   Using fallback port 3050 (global standard)"
    $PORT = 3050
    $REF_INFO = $null
}

# Get reference info or use defaults
if ($REF_INFO) {
    $BUNDUI_DIR = $REF_INFO.location
    $REF_NAME = $REF_INFO.name
} else {
    $BUNDUI_DIR = "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
    $REF_NAME = "Bundui Premium Dashboard Kit"
}

Write-Host "🎨 Starting $REF_NAME..." -ForegroundColor Cyan

# Validate port assignment (if module loaded)
if (Get-Command Test-PortAssignment -ErrorAction SilentlyContinue) {
    if (-not (Test-PortAssignment -Port $PORT -ReferenceName "bundui")) {
        Write-Warning "⚠️  Port validation failed! Check global assignment."
    }
}

# Check if directory exists
if (-not (Test-Path $BUNDUI_DIR)) {
    Write-Host "❌ Bundui directory not found at: $BUNDUI_DIR" -ForegroundColor Red
    Write-Host "Clone it with: git clone https://github.com/bundui/shadcn-ui-kit-dashboard.git `"$BUNDUI_DIR`"" -ForegroundColor Yellow
    exit 1
}

# Check if port is actively listening (ignore TIME_WAIT connections)
# Get-NetTCPConnection can return multiple connections or array
$portListening = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($portListening) {
    # Handle both single connection and array
    $uniqueProcessIds = $portListening | 
        Select-Object -ExpandProperty OwningProcess -Unique | 
        Where-Object { $_ -gt 0 }  # Filter out system processes (Idle = 0)
    
    if ($uniqueProcessIds) {
        # Get process info for better error message
        $processInfo = @()
        foreach ($processId in $uniqueProcessIds) {
            try {
                $proc = Get-Process -Id $processId -ErrorAction Stop
                $processInfo += "$($proc.ProcessName) (PID: $processId)"
            } catch {
                $processInfo += "Unknown (PID: $processId)"
            }
        }
        
        Write-Host "⚠️  Port $PORT is already in use by:" -ForegroundColor Yellow
        $processInfo | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
        Write-Host "Run .\scripts\stop-bundui-reference.ps1 first to stop existing server" -ForegroundColor Yellow
        exit 1
    }
}

# Check if node_modules exists
if (-not (Test-Path "$BUNDUI_DIR\node_modules")) {
    Write-Host "📦 Installing dependencies (first time setup)..." -ForegroundColor Yellow
    Push-Location $BUNDUI_DIR
    npm install --legacy-peer-deps
    Pop-Location
}

# Start the dev server
Write-Host "Starting Next.js dev server on port $PORT..." -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:$PORT" -ForegroundColor Cyan
Push-Location $BUNDUI_DIR
npm run dev -- -p $PORT
Pop-Location
