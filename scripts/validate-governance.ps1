<#
.SYNOPSIS
ViTo Governance Baseline v1 (VGB-1) Validator for Windows
Enforces static norms defined in docs/governance/VITO_GOVERNANCE_BASELINE_V1.md

.DESCRIPTION
Runs governance checks (Blocker G1, G2) against the codebase.
EXIT CODES: 0=PASS, 1=FAIL

.EXAMPLE
.\scripts\validate-governance.ps1
#>

$ErrorActionPreference = "Stop"
$ExitCode = 0

Write-Host "🔍 ViTo Governance Validator (VGB-1)" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray

# Define exclusions
$ExcludeDirs = @("_legacy", "node_modules", "dist", "build", ".next", ".turbo", ".git")
$ExcludeFiles = @("pnpm-lock.yaml", "package-lock.json", "validate-governance.sh", "validate-governance.ps1")

# Rule G1: Methodology Branding (BLOCKER)
Write-Host "Running G1: Methodology Branding Check..." -ForegroundColor White
$ForbiddenPatterns = @("XTP", "\bXTR\b", "AIPAIR", "xtp-", "xtr-", "aipair-", "XTP v", "XTP v4")

$BrandingMatches = Get-ChildItem -Recurse -File -Path . | 
    Where-Object { 
        $pathParts = $_.FullName.Split([System.IO.Path]::DirectorySeparatorChar)
        # Check if file is in excluded dir
        $inExcludedDir = ($pathParts | Where-Object { $ExcludeDirs -contains $_ })
        if ($inExcludedDir) { return $false }
        if ($ExcludeFiles -contains $_.Name) { return $false }
        return $true
    } | 
    Select-String -Pattern $ForbiddenPatterns -SimpleMatch:$false -CaseSensitive:$false

if ($BrandingMatches) {
    Write-Host "❌ FAIL: Forbidden methodology branding found:" -ForegroundColor Red
    $BrandingMatches | ForEach-Object { Write-Host "  $($_.Path):$($_.LineNumber) -> $($_.Line.Trim())" }
    $ExitCode = 1
} else {
    Write-Host "✅ PASS: No forbidden branding found." -ForegroundColor Green
}

# Rule G2: Licensing (BLOCKER)
Write-Host "`nRunning G2: Licensing Check (package.json)..." -ForegroundColor White
$LicensePatterns = @("\bGPL\b", "\bAGPL\b")

$LicenseMatches = Get-ChildItem -Recurse -Filter "package.json" -Path . | 
    Where-Object { 
        $pathParts = $_.FullName.Split([System.IO.Path]::DirectorySeparatorChar)
        $inExcludedDir = ($pathParts | Where-Object { $ExcludeDirs -contains $_ })
        if ($inExcludedDir) { return $false }
        return $true
    } | 
    Select-String -Pattern $LicensePatterns -SimpleMatch:$false -CaseSensitive:$false

if ($LicenseMatches) {
    Write-Host "❌ FAIL: Forbidden licenses (GPL/AGPL) found:" -ForegroundColor Red
    $LicenseMatches | ForEach-Object { Write-Host "  $($_.Path):$($_.LineNumber) -> $($_.Line.Trim())" }
    $ExitCode = 1
} else {
    Write-Host "✅ PASS: No forbidden licenses found." -ForegroundColor Green
}

# Summary
Write-Host "`n-----------------------------------" -ForegroundColor Gray
if ($ExitCode -eq 0) {
    Write-Host "✅ VGB-1 VALIDATION PASSED" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ VGB-1 VALIDATION FAILED" -ForegroundColor Red
    exit 1
}
