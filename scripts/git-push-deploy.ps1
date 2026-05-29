# Prépare le commit Git pour déploiement Render (ne pousse pas sans remote configuré)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

if (Test-Path "03_Code\backend\.env") {
  Write-Host "OK — .env local présent (non envoyé sur Git)" -ForegroundColor Green
} else {
  Write-Warning "Créez 03_Code\backend\.env avec DATABASE_POOLER_URL avant Render"
}

git init 2>$null
git add .
$status = git status --porcelain
if (-not $status) {
  Write-Host "Rien à committer." -ForegroundColor Yellow
} else {
  git commit -m "PaySafe — déploiement initial"
  Write-Host "Commit créé." -ForegroundColor Green
}

$remote = git remote get-url origin 2>$null
if ($remote) {
  Write-Host "Remote: $remote"
  Write-Host "Lancement: git push -u origin main"
  git push -u origin main
} else {
  Write-Host @"

Prochaine étape — créez le repo GitHub puis :

  git remote add origin https://github.com/VOTRE_COMPTE/PaySafe_Project.git
  git branch -M main
  git push -u origin main

Puis Render → New → Blueprint → repo PaySafe_Project
Voir DEPLOY_NOW.md
"@ -ForegroundColor Cyan
}
