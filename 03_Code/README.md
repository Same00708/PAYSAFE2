# PaySafe — Code source

## Structure

| Dossier | Description |
|---------|-------------|
| `backend/` | API REST (Express + TypeScript) |
| `web/` | Site web / portail (Vite + React + TypeScript) |

## Prérequis

- Node.js 20+
- npm 10+

## Démarrage rapide

> **Pas de Docker ?** C’est normal sur beaucoup de PC Windows.  
> Suivez **`05_DevOps/INSTALL_POSTGRES_WINDOWS.md`** (Supabase gratuit ou PostgreSQL local).

Diagnostic rapide :
```powershell
powershell -ExecutionPolicy Bypass -File ..\..\05_DevOps\scripts\check-setup.ps1
```

### 1. Base de données (choisir une option)

| Option | Quand l’utiliser |
|--------|------------------|
| **Supabase** (cloud) | Rien à installer — **recommandé sans Docker** |
| **PostgreSQL Windows** | Install local via winget / postgresql.org |
| **Docker** | Uniquement si Docker Desktop est installé |

Voir le guide : `05_DevOps/INSTALL_POSTGRES_WINDOWS.md`

### 2. Backend (API)

```powershell
cd backend
npm install
copy .env.example .env
# Éditez .env → DATABASE_URL (Supabase ou postgresql://paysafe:paysafe_dev@localhost:5432/paysafe)
npm run db:migrate
npm run db:seed
npm run dev
```

API : http://localhost:4000/api/health

### 3. Site web

```bash
cd web
npm install
npm run dev
```

Site : http://localhost:5173

**Comptes démo (OTP : `123456`)**  
- Acheteur : `+22890765432` (@junior)  
- Vendeur : `+22890123456` (@marie)

## Scripts utiles

| Commande | Où | Action |
|----------|-----|--------|
| `npm run dev` | backend / web | Mode développement |
| `npm run build` | backend / web | Build production |
