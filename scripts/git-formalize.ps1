param(
    [string]$m = "CHORE: Auto-formalize state"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Formalization Process..." -ForegroundColor Cyan

# 1. Check branch
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne "main") {
    Write-Warning "⚠️  You are on branch '$branch', not 'main'."
    $confirm = Read-Host "Continue pushing to $branch? (y/n)"
    if ($confirm -ne "y") { exit }
}

# 2. Add all changes (including deletions)
Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
git add -A

# 3. Commit
Write-Host "📝 Committing with message: '$m'..." -ForegroundColor Yellow
try {
    git commit -m "$m"
}
catch {
    Write-Warning "No changes to commit (working tree clean)."
}

# 4. Pull & Push
Write-Host "🔄 Syncing with origin..." -ForegroundColor Yellow
git pull origin $branch --rebase
git push origin $branch

Write-Host "✅ SUCCESS: State is now FORMALIZED in GitHub ($branch)" -ForegroundColor Green
