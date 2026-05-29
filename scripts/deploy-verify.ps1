# Vérifie que PaySafe est prêt à être déployé (build Docker + checklist)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "=== PaySafe — vérification déploiement ===" -ForegroundColor Cyan

if (-not (Test-Path "03_Code\backend\.env")) {
  Write-Warning "03_Code\backend\.env absent — copiez .env.example"
}

Push-Location 03_Code\backend
npm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run check:integrations
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nCorrigez la BDD (npm run db:discover-pooler) puis relancez." -ForegroundColor Yellow
  exit 1
}
npm run build:all
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Pop-Location

Write-Host "`nBuild Docker (racine repo)…" -ForegroundColor Cyan
docker build -f 03_Code/Dockerfile -t paysafe:local .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n=== OK — Poussez sur GitHub puis déployez sur Render ===" -ForegroundColor Green
Write-Host "Voir DEPLOYMENT.md"
