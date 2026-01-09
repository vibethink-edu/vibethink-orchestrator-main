param(
    [string]$m = "CHORE: Auto-formalize state"
)

# Set common encoding for emojis
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 Starting Formalization Process..." -ForegroundColor Cyan

# 1. Check branch
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne "main") {
    Write-Warning "⚠️  You are on branch '$branch', not 'main'."
}

# 2. Add all changes (including deletions)
Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
git add -A

# 3. Commit
Write-Host "📝 Committing with message: '$m'..." -ForegroundColor Yellow
$commitResult = git commit -m "$m" 2>&1
Write-Host $commitResult

# 4. Pull & Push
Write-Host "🔄 Syncing with origin..." -ForegroundColor Yellow
git pull origin $branch --rebase 2>&1
git push origin $branch 2>&1

Write-Host "✅ SUCCESS: State is now FORMALIZED in GitHub ($branch)" -ForegroundColor Green
