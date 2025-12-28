#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Run a single translation job
.PARAMETER Namespace
    The namespace to translate (e.g., 'projects', 'default')
.PARAMETER Locale
    The target locale (e.g., 'es', 'ar', 'zh')
.EXAMPLE
    .\scripts\run-translation.ps1 -Namespace projects -Locale es
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Namespace,

    [Parameter(Mandatory=$true)]
    [string]$Locale
)

# Check if API key is set
if (-not (Test-Path env:ANTHROPIC_API_KEY)) {
    Write-Host ""
    Write-Host "❌ ERROR: ANTHROPIC_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set it with:" -ForegroundColor Yellow
    Write-Host "  `$env:ANTHROPIC_API_KEY = `"your-api-key`"" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# Run the translation
node (Join-Path $SCRIPT_DIR "translate-namespace.js") $Namespace $Locale

exit $LASTEXITCODE
