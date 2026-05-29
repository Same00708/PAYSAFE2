# PostgreSQL sur Windows — sans Docker

Docker n’est **pas obligatoire**. Choisissez **une** des options ci-dessous.

---

## Option A — Supabase (recommandé, ~5 min, rien à installer)

Idéal si vous n’avez pas Docker ni PostgreSQL en local.

1. Créez un compte sur https://supabase.com (gratuit).
2. **New project** → notez le mot de passe de la base.
3. Allez dans **Project Settings → Database**.
4. Copiez l’URI **Connection string** (mode *URI*, pas Transaction pooler pour les migrations).
   - Exemple : `postgresql://postgres.xxxx:[MOT_DE_PASSE]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
5. Dans `03_Code/backend`, copiez `.env.example` vers `.env` :
   ```powershell
   cd $env:USERPROFILE\Desktop\PaySafe_Project\03_Code\backend
   copy .env.example .env
   ```
6. Collez l’URI dans `.env` :
   ```
   DATABASE_URL=postgresql://postgres:...@....supabase.com:5432/postgres
   ```
7. Initialisez la base :
   ```powershell
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

> Si `db:migrate` échoue avec le pooler Supabase, utilisez la chaîne **Direct connection** (port **5432**, host `db.xxxx.supabase.co`) dans `DATABASE_URL`.

---

## Option B — PostgreSQL installé sur Windows

### 1. Installer

**Via winget (PowerShell en administrateur) :**
```powershell
winget install PostgreSQL.PostgreSQL.17 --accept-package-agreements --accept-source-agreements
```

**Ou** téléchargez l’installateur : https://www.postgresql.org/download/windows/

- Utilisateur : `postgres`
- Mot de passe : choisissez-en un (ex. `postgres`)
- Port : `5432` (par défaut)

### 2. Créer la base PaySafe

Ouvrez **SQL Shell (psql)** ou PowerShell (après ajout de PostgreSQL au PATH) :

```powershell
psql -U postgres -c "CREATE USER paysafe WITH PASSWORD 'paysafe_dev';"
psql -U postgres -c "CREATE DATABASE paysafe OWNER paysafe;"
```

Si `psql` n’est pas reconnu, utilisez le chemin complet, par exemple :
`"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres`

### 3. Configurer le backend

Fichier `03_Code/backend/.env` :

```env
DATABASE_URL=postgresql://paysafe:paysafe_dev@localhost:5432/paysafe
```

Puis :

```powershell
cd $env:USERPROFILE\Desktop\PaySafe_Project\03_Code\backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

---

## Option C — Docker (plus tard)

Installez **Docker Desktop** : https://www.docker.com/products/docker-desktop/

Redémarrez le PC si demandé, puis :

```powershell
cd $env:USERPROFILE\Desktop\PaySafe_Project\05_DevOps\docker
docker compose up -d
```

`DATABASE_URL` par défaut (déjà dans `.env.example`) :

```env
DATABASE_URL=postgresql://paysafe:paysafe_dev@localhost:5432/paysafe
```

---

## Vérifier que tout fonctionne

```powershell
curl http://localhost:4000/api/health
```

Réponse attendue : `"database": "connected"`.

Ensuite le site :

```powershell
cd $env:USERPROFILE\Desktop\PaySafe_Project\03_Code\web
npm install
npm run dev
```

→ http://localhost:5173

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `database: disconnected` | Vérifiez `DATABASE_URL`, que PostgreSQL tourne, pare-feu port 5432 |
| `psql` introuvable | Ajoutez `C:\Program Files\PostgreSQL\17\bin` au PATH Windows |
| Erreur ENUM déjà existant | Base déjà migrée ; utilisez une base vide ou Supabase nouveau projet |
| `npm run db:migrate` échoue | Lancez depuis `03_Code/backend` avec `.env` présent |
