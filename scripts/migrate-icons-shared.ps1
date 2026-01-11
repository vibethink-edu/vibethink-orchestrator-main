
$targetDir = "C:\IA Marcelo Labs\vibethink-orchestrator-main\apps\dashboard\src\shared"
$files = Get-ChildItem -Path $targetDir -Recurse -Filter "*.tsx"
$tsFiles = Get-ChildItem -Path $targetDir -Recurse -Filter "*.ts"

$allFiles = $files + $tsFiles

foreach ($file in $allFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $originalContent = $content
        
        $modified = $false
        
        if ($content -match 'from "lucide-react"') {
            $content = $content -replace 'from "lucide-react"', 'from "@vibethink/ui/icons"'
            $modified = $true
        }
        if ($content -match "from 'lucide-react'") {
            $content = $content -replace "from 'lucide-react'", 'from "@vibethink/ui/icons"'
            $modified = $true
        }
        
        if ($modified) {
            Write-Host "Updating $($file.FullName)"
            [System.IO.File]::WriteAllText($file.FullName, $content)
        }
    }
    catch {
        Write-Error "Failed to process $($file.FullName): $_"
    }
}
Write-Host "Migration complete."
