# ============================================================================
# CHECK VENDOR VERSIONS
# ============================================================================
# Verifica las versiones de todos los vendors y compara con el stack principal
# ============================================================================

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  VENDOR VERSION CHECK - VibeThink Stack  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Paths
$VTHINK_PATH = "C:\IA Marcelo Labs\vibethink-orchestrator-main"
$BUNDUI_PATH = "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
$SHADCN_PATH = "C:\IA Marcelo Labs\shadcn-ui\ui"
$XYFLOW_PATH = "C:\IA Marcelo Labs\xyflow\xyflow"

# Function to get version from package.json
function Get-PackageVersion {
    param([string]$Path, [string]$Package)
    
    if (Test-Path $Path) {
        $json = Get-Content $Path | ConvertFrom-Json
        if ($Package -eq "self") {
            return $json.version
        }
        $version = $json.dependencies.$Package
        if (-not $version) {
            $version = $json.devDependencies.$Package
        }
        if (-not $version) {
            $version = $json.peerDependencies.$Package
        }
        return $version
    }
    return "N/A"
}

# ============================================================================
# VIBETHINK ORCHESTRATOR
# ============================================================================
Write-Host "🏠 VIBETHINK ORCHESTRATOR" -ForegroundColor Green
Write-Host "   Path: $VTHINK_PATH" -ForegroundColor Gray

$vthinkPkg = "$VTHINK_PATH\package.json"
$vthinkReact = Get-PackageVersion $vthinkPkg "react"
$vthinkNext = Get-PackageVersion $vthinkPkg "next"
$vthinkTS = Get-PackageVersion $vthinkPkg "typescript"
$vthinkTailwind = Get-PackageVersion $vthinkPkg "tailwindcss"
$vthinkZustand = Get-PackageVersion $vthinkPkg "zustand"

Write-Host "   React:      $vthinkReact" -ForegroundColor White
Write-Host "   Next.js:    $vthinkNext" -ForegroundColor White
Write-Host "   TypeScript: $vthinkTS" -ForegroundColor White
Write-Host "   Tailwind:   $vthinkTailwind" -ForegroundColor White
Write-Host "   Zustand:    $vthinkZustand" -ForegroundColor White
Write-Host ""

# ============================================================================
# BUNDUI
# ============================================================================
Write-Host "🎨 BUNDUI (shadcn-ui-kit-dashboard)" -ForegroundColor Yellow
Write-Host "   Path: $BUNDUI_PATH" -ForegroundColor Gray

if (Test-Path "$BUNDUI_PATH\package.json") {
    $bunduiPkg = "$BUNDUI_PATH\package.json"
    $bunduiVersion = Get-PackageVersion $bunduiPkg "self"
    $bunduiReact = Get-PackageVersion $bunduiPkg "react"
    $bunduiNext = Get-PackageVersion $bunduiPkg "next"
    $bunduiTS = Get-PackageVersion $bunduiPkg "typescript"
    $bunduiTailwind = Get-PackageVersion $bunduiPkg "tailwindcss"

    Write-Host "   Version:    $bunduiVersion" -ForegroundColor Cyan
    Write-Host "   React:      $bunduiReact" -ForegroundColor White
    Write-Host "   Next.js:    $bunduiNext" -ForegroundColor White
    Write-Host "   TypeScript: $bunduiTS" -ForegroundColor White
    Write-Host "   Tailwind:   $bunduiTailwind" -ForegroundColor White
} else {
    Write-Host "   ❌ Not installed" -ForegroundColor Red
}
Write-Host ""

# ============================================================================
# SHADCN UI
# ============================================================================
Write-Host "📦 SHADCN UI (CLI)" -ForegroundColor Blue
Write-Host "   Path: $SHADCN_PATH" -ForegroundColor Gray

if (Test-Path "$SHADCN_PATH\packages\shadcn\package.json") {
    $shadcnPkg = "$SHADCN_PATH\packages\shadcn\package.json"
    $shadcnVersion = Get-PackageVersion $shadcnPkg "self"
    $shadcnTS = Get-PackageVersion $shadcnPkg "typescript"
    $shadcnZod = Get-PackageVersion $shadcnPkg "zod"

    Write-Host "   Version:    $shadcnVersion" -ForegroundColor Cyan
    Write-Host "   TypeScript: $shadcnTS" -ForegroundColor White
    Write-Host "   Zod:        $shadcnZod" -ForegroundColor White
} else {
    Write-Host "   ❌ Not installed" -ForegroundColor Red
}
Write-Host ""

# ============================================================================
# REACT FLOW
# ============================================================================
Write-Host "🔄 REACT FLOW (xyflow)" -ForegroundColor Magenta
Write-Host "   Path: $XYFLOW_PATH" -ForegroundColor Gray

if (Test-Path "$XYFLOW_PATH\packages\react\package.json") {
    $xyflowPkg = "$XYFLOW_PATH\packages\react\package.json"
    $xyflowVersion = Get-PackageVersion $xyflowPkg "self"
    $xyflowReact = Get-PackageVersion $xyflowPkg "react"
    $xyflowZustand = Get-PackageVersion $xyflowPkg "zustand"

    Write-Host "   Version:    $xyflowVersion" -ForegroundColor Cyan
    Write-Host "   React:      $xyflowReact (peer)" -ForegroundColor White
    Write-Host "   Zustand:    $xyflowZustand" -ForegroundColor White
} else {
    Write-Host "   ❌ Not installed" -ForegroundColor Red
}
Write-Host ""

# ============================================================================
# COMPATIBILITY CHECK
# ============================================================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  COMPATIBILITY ANALYSIS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# React compatibility
Write-Host "React Compatibility:" -ForegroundColor White
if ($vthinkReact -match "19") {
    Write-Host "   ✅ VThink uses React 19" -ForegroundColor Green
    if ($bunduiReact -match "19") {
        Write-Host "   ✅ Bundui compatible (React 19)" -ForegroundColor Green
    }
    if ($xyflowReact -match ">=17" -or $xyflowReact -match ">=18") {
        Write-Host "   ✅ React Flow compatible (supports React 17+)" -ForegroundColor Green
    }
}
Write-Host ""

# Next.js check
Write-Host "Next.js Versions:" -ForegroundColor White
Write-Host "   VThink: $vthinkNext" -ForegroundColor Gray
Write-Host "   Bundui: $bunduiNext" -ForegroundColor Gray
if ([version]($bunduiNext -replace '[^\d.]','') -gt [version]($vthinkNext -replace '[^\d.]','')) {
    Write-Host "   ⚠️  Bundui uses newer Next.js - consider upgrading VThink" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Next.js versions aligned" -ForegroundColor Green
}
Write-Host ""

# Zustand check
Write-Host "Zustand Versions:" -ForegroundColor White
Write-Host "   VThink:     $vthinkZustand" -ForegroundColor Gray
Write-Host "   React Flow: $xyflowZustand" -ForegroundColor Gray
if ($vthinkZustand -match "^5" -and $xyflowZustand -match "^\^4") {
    Write-Host "   ⚠️  Different major versions - verify compatibility in workflows" -ForegroundColor Yellow
}
Write-Host ""

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  QUICK REFERENCE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ports:" -ForegroundColor White
Write-Host "    Dashboard:   http://localhost:3005" -ForegroundColor Gray
Write-Host "    Bundui:      http://localhost:3006" -ForegroundColor Gray
Write-Host "    Shadcn:      http://localhost:3007" -ForegroundColor Gray
Write-Host "    React Flow:  http://localhost:3008" -ForegroundColor Gray
Write-Host ""
Write-Host "  Documentation: docs/references/VENDOR_VERSIONS.md" -ForegroundColor Gray
Write-Host ""






