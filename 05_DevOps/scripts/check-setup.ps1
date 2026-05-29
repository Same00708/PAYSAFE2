# PaySafe — Vérification de l'environnement de développement (Windows)
Write-Host "=== PaySafe — Diagnostic ===" -ForegroundColor Cyan

$ok = $true

# Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Node.js $(node -v)" -ForegroundColor Green
} else {
    Write-Host "[!!] Node.js non installé — https://nodejs.org" -ForegroundColor Red
    $ok = $false
}

# Docker (optionnel)
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Docker disponible (optionnel)" -ForegroundColor Green
} else {
    Write-Host "[--] Docker absent — utilisez Supabase ou PostgreSQL local (voir INSTALL_POSTGRES_WINDOWS.md)" -ForegroundColor Yellow
}

# psql (optionnel)
if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "[OK] psql disponible" -ForegroundColor Green
} else {
    Write-Host "[--] psql absent — normal si vous utilisez Supabase" -ForegroundColor Yellow
}

# Fichier .env backend
$envFile = "$env:USERPROFILE\Desktop\PaySafe_Project\03_Code\backend\.env"
if (Test-Path $envFile) {
    Write-Host "[OK] backend/.env présent" -ForegroundColor Green
} else {
    Write-Host "[!!] Copiez backend/.env.example vers backend/.env" -ForegroundColor Red
    $ok = $false
}

# node_modules backend
$backendModules = "$env:USERPROFILE\Desktop\PaySafe_Project\03_Code\backend\node_modules"
if (Test-Path $backendModules) {
    Write-Host "[OK] backend/node_modules" -ForegroundColor Green
} else {
    Write-Host "[!!] Exécutez: cd 03_Code\backend; npm install" -ForegroundColor Red
    $ok = $false
}

Write-Host ""
if ($ok) {
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Configurez DATABASE_URL dans backend\.env (Supabase ou PostgreSQL local)"
    Write-Host "  2. cd 03_Code\backend; npm run db:migrate; npm run db:seed; npm run dev"
    Write-Host "  3. cd 03_Code\web; npm install; npm run dev"
} else {
    Write-Host "Corrigez les points [!!] ci-dessus." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Guide complet: 05_DevOps\INSTALL_POSTGRES_WINDOWS.md"
