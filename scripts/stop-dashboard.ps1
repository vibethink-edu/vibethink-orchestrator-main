# Stop Dashboard Dev Server
# Kills all Node processes on port 3005

Write-Host "🛑 Stopping ViTo Dashboard (VibeThink Orchestrator)..." -ForegroundColor Cyan

$port = 3005
$processStopped = $false

# Find process using port 3005
# Get-NetTCPConnection can return multiple connections or array
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    # Handle both single connection and array
    $uniqueProcessIds = $connections | 
        Select-Object -ExpandProperty OwningProcess -Unique | 
        Where-Object { $_ -gt 0 }  # Filter out system processes (Idle = 0)
    
    foreach ($processId in $uniqueProcessIds) {
        # Validate process exists and is not a system process
        try {
            $proc = Get-Process -Id $processId -ErrorAction Stop
            Write-Host "Found process $processId ($($proc.ProcessName)) on port $port" -ForegroundColor Yellow
            
            # Kill the process
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "✅ Stopped process $processId" -ForegroundColor Green
            $processStopped = $true
        }
        catch {
            # Process might already be gone, but port still in TIME_WAIT
            Write-Host "⚠️  Process $processId not found (may have already terminated)" -ForegroundColor Yellow
            # Try to force close the connection
            try {
                $connection = $connections | Where-Object { $_.OwningProcess -eq $processId } | Select-Object -First 1
                if ($connection) {
                    Write-Host "   Connection may be in TIME_WAIT state, will clear on next check" -ForegroundColor Gray
                }
            } catch {
                # Ignore connection cleanup errors
            }
        }
    }
    
    if (-not $processStopped) {
        Write-Host "ℹ️  No valid processes found on port $port (connections may be in TIME_WAIT)" -ForegroundColor Gray
        Write-Host "   Waiting 2 seconds for connections to clear..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}
else {
    Write-Host "ℹ️  No process found on port $port" -ForegroundColor Gray
}

# Also kill any orphaned node processes for this project
$projectPath = Split-Path -Parent $PSScriptRoot
try {
    # Get node processes with their command line to filter by project path
    $nodeProcesses = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.CommandLine -and $_.CommandLine -like "*$projectPath*" 
    }
    
    if ($nodeProcesses) {
        Write-Host "Cleaning up orphaned node processes..." -ForegroundColor Yellow
        foreach ($proc in $nodeProcesses) {
            try {
                Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
                Write-Host "✅ Stopped orphaned process $($proc.ProcessId)" -ForegroundColor Green
            }
            catch {
                Write-Host "⚠️  Could not stop orphaned process $($proc.ProcessId)" -ForegroundColor Yellow
            }
        }
    }
}
catch {
    # Fallback: try simple Get-Process if CIM fails
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Cleaning up orphaned node processes (fallback method)..." -ForegroundColor Yellow
        $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "✅ Dashboard stopped" -ForegroundColor Green
