# ============================================================================
# START SHADCN UI REFERENCE
# ============================================================================
# Starts the official Shadcn UI reference server using global port assignment
# This is for visual reference and comparison purposes only
# Source: https://github.com/shadcn-ui/ui
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
    }
    else {
        Write-Warning "⚠️  Could not load port assignment. Using fallback port 3051"
        $PORT = 3051
        $REF_INFO = $null
    }
}
else {
    Write-Warning "⚠️  PortManager module not found at: $PortManagerPath"
    Write-Warning "   Using fallback port 3051 (global standard)"
    $PORT = 3051
    $REF_INFO = $null
}

# Get reference info or use defaults
if ($REF_INFO) {
    $SHADCN_DIR = $REF_INFO.location
    $REF_NAME = $REF_INFO.name
}
else {
    $SHADCN_DIR = "C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4"
    $REF_NAME = "Shadcn UI Official"
}

Write-Host "🎨 Starting $REF_NAME..." -ForegroundColor Cyan

# Validate port assignment (if module loaded)
if (Get-Command Test-PortAssignment -ErrorAction SilentlyContinue) {
    if (-not (Test-PortAssignment -Port $PORT -ReferenceName "shadcn")) {
        Write-Warning "⚠️  Port validation failed! Check global assignment."
    }
}

# Check if directory exists
if (-not (Test-Path $SHADCN_DIR)) {
    Write-Host "❌ Shadcn UI directory not found at: $SHADCN_DIR" -ForegroundColor Red
    Write-Host "Clone it with: git clone https://github.com/shadcn-ui/ui.git `"$SHADCN_DIR`"" -ForegroundColor Yellow
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
            }
            catch {
                $processInfo += "Unknown (PID: $processId)"
            }
        }
        
        Write-Host "⚠️  Port $PORT is already in use by:" -ForegroundColor Yellow
        $processInfo | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
        Write-Host "Run .\scripts\stop-shadcn-reference.ps1 first to stop existing server" -ForegroundColor Yellow
        exit 1
    }
}

# Check if node_modules exists
if (-not (Test-Path "$SHADCN_DIR\node_modules")) {
    Write-Host "📦 Installing dependencies (first time setup)..." -ForegroundColor Yellow
    Push-Location $SHADCN_DIR
    pnpm install
    Pop-Location
}

# Start the dev server
Write-Host "Starting Next.js dev server on port $PORT..." -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:$PORT" -ForegroundColor Cyan
try {
    Push-Location $SHADCN_DIR
    pnpm run dev -- -p $PORT
}
catch {
    Write-Host "❌ Error starting dev server: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}
finally {
    Pop-Location
}
