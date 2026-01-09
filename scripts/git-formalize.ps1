param(
    [string]$m = "CHORE: Auto-formalize state"
)

git add -A
git commit -m "$m"
git pull origin main --rebase
git push origin main
Write-Host "FORMALIZED"
