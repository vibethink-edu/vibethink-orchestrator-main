# ============================================================================
# STOP SHADCN UI REFERENCE
# ============================================================================
# Stops the official Shadcn UI reference server using global port assignment
# Port Assignment: 3051 (See _vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md)
# ============================================================================

# Import Port Manager Module (Global Standard)
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"

if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force -ErrorAction SilentlyContinue
    $PORT = Get-ReferencePort -ReferenceName "shadcn"
    if (-not $PORT) {
        $PORT = 3051  # Fallback to global standard
    }
} else {
    $PORT = 3051  # Fallback to global standard
}

Write-Host "🛑 Stopping Shadcn UI Reference..." -ForegroundColor Cyan

$processStopped = $false

# Find process using port
# Get-NetTCPConnection can return multiple connections or array
$connections = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue

if ($connections) {
    # Handle both single connection and array
    $uniqueProcessIds = $connections | 
        Select-Object -ExpandProperty OwningProcess -Unique | 
        Where-Object { $_ -gt 0 }  # Filter out system processes (Idle = 0)
    
    foreach ($processId in $uniqueProcessIds) {
        # Validate process exists and is not a system process
        try {
            $proc = Get-Process -Id $processId -ErrorAction Stop
            Write-Host "Found process $processId ($($proc.ProcessName)) on port $PORT" -ForegroundColor Yellow
            
            # Kill the process
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "✅ Stopped process $processId" -ForegroundColor Green
            $processStopped = $true
        } catch {
            Write-Host "⚠️  Could not stop process $processId : $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    if (-not $processStopped) {
        Write-Host "ℹ️  No valid processes found on port $PORT" -ForegroundColor Gray
    }
} else {
    Write-Host "ℹ️  No process found on port $PORT" -ForegroundColor Gray
}

Write-Host "✅ Shadcn UI Reference stopped" -ForegroundColor Green
