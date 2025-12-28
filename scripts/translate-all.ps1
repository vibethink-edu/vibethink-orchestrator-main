#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Translate All Missing Translations
.DESCRIPTION
    This script translates all missing keys across all namespaces and locales
    for the projects-v2 module using the Anthropic Claude API.
.PARAMETER DryRun
    If specified, only shows what would be translated without actually doing it
.EXAMPLE
    .\scripts\translate-all.ps1
.EXAMPLE
    .\scripts\translate-all.ps1 -DryRun
#>

param(
    [switch]$DryRun
)

# Configuration
$NAMESPACES = @('projects', 'default', 'common', 'navigation')
$LOCALES = @('es', 'ar', 'zh', 'fr', 'pt', 'de', 'it', 'ko')
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ROOT_DIR = Split-Path -Parent $SCRIPT_DIR

# Check if ANTHROPIC_API_KEY is set
if (-not $env:ANTHROPIC_API_KEY) {
    Write-Host ""
    Write-Host "❌ ERROR: ANTHROPIC_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set it with:" -ForegroundColor Yellow
    Write-Host "  `$env:ANTHROPIC_API_KEY = `"your-api-key`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or add it to your PowerShell profile for persistence:" -ForegroundColor Yellow
    Write-Host "  notepad `$PROFILE" -ForegroundColor Cyan
    Write-Host "  # Add this line:" -ForegroundColor Cyan
    Write-Host "  `$env:ANTHROPIC_API_KEY = `"your-api-key`"" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Batch Translation Tool - Projects V2                                    " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Namespaces: " -NoNewline -ForegroundColor Blue
Write-Host ($NAMESPACES -join ', ')
Write-Host "  Locales:    " -NoNewline -ForegroundColor Blue
Write-Host ($LOCALES -join ', ')
Write-Host "  Total jobs: " -NoNewline -ForegroundColor Blue
Write-Host ($NAMESPACES.Count * $LOCALES.Count)

if ($DryRun) {
    Write-Host ""
    Write-Host "  [DRY RUN] No translations will be performed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Statistics
$totalJobs = $NAMESPACES.Count * $LOCALES.Count
$currentJob = 0
$successCount = 0
$failureCount = 0
$skippedCount = 0
$startTime = Get-Date

# Translation loop
foreach ($namespace in $NAMESPACES) {
    foreach ($locale in $LOCALES) {
        $currentJob++
        $percentComplete = [math]::Round(($currentJob / $totalJobs) * 100, 1)

        Write-Host "[$currentJob/$totalJobs] " -NoNewline -ForegroundColor Cyan
        Write-Host "Translating " -NoNewline
        Write-Host "$namespace" -NoNewline -ForegroundColor Yellow
        Write-Host " -> " -NoNewline
        Write-Host "$locale" -NoNewline -ForegroundColor Green
        Write-Host " ($percentComplete%)" -ForegroundColor Gray

        if ($DryRun) {
            Write-Host "  [OK] Would translate $namespace to $locale" -ForegroundColor Blue
            $skippedCount++
            Write-Host ""
            continue
        }

        # Execute translation
        $translateCmd = "node"
        $translateArgs = @(
            (Join-Path $SCRIPT_DIR "translate-namespace.js"),
            $namespace,
            $locale
        )

        try {
            $output = & $translateCmd $translateArgs 2>&1
            $exitCode = $LASTEXITCODE

            if ($exitCode -eq 0) {
                Write-Host "  [SUCCESS]" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "  [FAILED] (exit code: $exitCode)" -ForegroundColor Red
                Write-Host "  Output: $output" -ForegroundColor Gray
                $failureCount++
            }
        } catch {
            Write-Host "  [ERROR] Exception: $_" -ForegroundColor Red
            $failureCount++
        }

        Write-Host ""

        # Rate limiting - wait 1 second between API calls
        if ($currentJob -lt $totalJobs) {
            Start-Sleep -Milliseconds 1000
        }
    }
}

# Final summary
$endTime = Get-Date
$duration = $endTime - $startTime
$minutes = [math]::Floor($duration.TotalMinutes)
$seconds = $duration.Seconds

Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SUMMARY                                                                  " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Total jobs:    $totalJobs" -ForegroundColor Blue
Write-Host "  Successful:    " -NoNewline -ForegroundColor Blue
Write-Host "$successCount" -ForegroundColor Green
Write-Host "  Failed:        " -NoNewline -ForegroundColor Blue
Write-Host "$failureCount" -ForegroundColor Red
Write-Host "  Skipped:       " -NoNewline -ForegroundColor Blue
Write-Host "$skippedCount" -ForegroundColor Yellow
Write-Host "  Duration:      ${minutes}m ${seconds}s" -ForegroundColor Blue
Write-Host ""

if (-not $DryRun) {
    Write-Host "  Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run audit again: node scripts/audit-missing-translations-projects-v2.js" -ForegroundColor Cyan
    Write-Host "  2. Test the app: npm run dev" -ForegroundColor Cyan
    Write-Host "  3. Navigate to: http://localhost:3005/dashboard-bundui/projects-v2" -ForegroundColor Cyan
    Write-Host "  4. Test each language using the language selector" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Exit with appropriate code
if ($DryRun) {
    exit 0
} elseif ($failureCount -gt 0) {
    exit 1
} else {
    exit 0
}
