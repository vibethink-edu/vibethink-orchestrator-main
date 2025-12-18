# Start Dashboard Dev Server
# Port: 3005 (consistent)

Write-Host "🚀 Starting Pana Dashboard..." -ForegroundColor Cyan

# Check if port 3005 is already in use
$port = 3005
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($process) {
    Write-Host "⚠️  Port $port is already in use" -ForegroundColor Yellow
    Write-Host "Run ./stop.ps1 first to stop existing server" -ForegroundColor Yellow
    exit 1
}

# Start dev server
Write-Host "Starting Next.js dev server on port $port..." -ForegroundColor Green
cd apps/dashboard
npm run dev -- -p $port
