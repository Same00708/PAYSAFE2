# PaySafe — Déploiement production

Guide pas à pas (Render + Supabase). Auth par **téléphone** (sans OTP SMS obligatoire).

---

## Étape 1 — Base Supabase (une fois)

1. [supabase.com](https://supabase.com) → projet actif (pas en pause)
2. **Connect** → **Session pooler** → copier l’URI (port **5432**)
3. En local, dans `03_Code/backend/.env` :

```env
DATABASE_POOLER_URL=postgresql://postgres.VOTRE_REF:MOT_DE_PASSE@aws-1-REGION.pooler.supabase.com:5432/postgres
```

Si besoin : `npm run db:discover-pooler`

4. Initialiser la base :

```powershell
cd Desktop\PaySafe_Project\03_Code\backend
npm install
npm run db:migrate
npm run db:seed:users
npm run check:integrations
```

---

## Étape 2 — GitHub

```powershell
cd Desktop\PaySafe_Project
git init
git add .
git commit -m "PaySafe v1 — déploiement"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/PaySafe_Project.git
git push -u origin main
```

Ne commitez **jamais** `.env` (déjà dans `.gitignore`).

---

## Étape 3 — Render (recommandé)

### Option A — Blueprint

1. [render.com](https://render.com) → **New** → **Blueprint**
2. Repo `PaySafe_Project` → fichier `03_Code/render.yaml`
3. Renseigner les variables marquées `sync: false` (voir tableau ci-dessous)

### Option B — Service Docker manuel

| Champ | Valeur |
|--------|--------|
| Root Directory | *(vide — racine du repo)* |
| Environment | **Docker** |
| Dockerfile | `03_Code/Dockerfile` |
| Docker context | `.` (racine du repo) |
| Health check | `/api/health` |
| Port | `4000` |

---

## Étape 4 — Variables d’environnement Render

| Variable | Exemple / note |
|----------|----------------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `DATABASE_POOLER_URL` | URI Session pooler Supabase (**obligatoire**) |
| `JWT_SECRET` | 32+ caractères aléatoires (Render peut générer) |
| `CORS_ORIGIN` | `https://paysafe-xxxx.onrender.com` |
| `APP_BASE_URL` | **Même URL** que CORS |
| `ADMIN_PHONES` | `+22893224301` |
| `FEDAPAY_ENVIRONMENT` | `sandbox` puis `live` |
| `FEDAPAY_SECRET_KEY` | Clé réelle FedaPay |
| `FEDAPAY_PUBLIC_KEY` | Clé publique |
| `FEDAPAY_WEBHOOK_SECRET` | Secret dashboard FedaPay |
| `ALLOW_SIMULATE_PAYMENT` | `false` |
| `SMS_PROVIDER` | `console` (ou `termii` si SMS plus tard) |

`DATABASE_URL` directe : optionnelle si `DATABASE_POOLER_URL` est définie.

---

## Étape 5 — FedaPay webhook

Dashboard FedaPay → Webhooks :

```
https://VOTRE-SERVICE.onrender.com/api/webhooks/fedapay
```

Copiez le secret dans `FEDAPAY_WEBHOOK_SECRET`.

---

## Étape 6 — Vérifications après déploiement

1. **Santé** : `https://VOTRE-URL.onrender.com/api/health`  
   → `"database":"connected"`, `"notificationsTable":"ready"`

2. **Intégrations** : `https://VOTRE-URL.onrender.com/api/health/integrations`

3. **Site** : `https://VOTRE-URL.onrender.com` → page de connexion

4. **Admin** : téléphone `93224301` → `/admin`

5. Créer une commande test → notifications + paiement FedaPay (sandbox)

---

## Déploiement Docker local (test)

Depuis la **racine** du repo :

```powershell
cd Desktop\PaySafe_Project
docker build -f 03_Code/Dockerfile -t paysafe .
docker run --rm -p 4000:4000 --env-file 03_Code/backend/.env paysafe
```

→ http://localhost:4000

---

## Build production sans Docker

```powershell
cd 03_Code\backend
npm run build:all
$env:NODE_ENV="production"
node dist/db/migrateBoot.js
npm start
```

---

## Comptes démo en production

Après le premier déploiement, depuis votre PC (avec `DATABASE_POOLER_URL` pointant sur la prod) :

```powershell
cd 03_Code\backend
npm run db:seed:users
```

Ou créez les comptes via l’inscription sur le site.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Timeout base | `DATABASE_POOLER_URL` (pas seulement `db.xxx.supabase.co`) |
| 502 au démarrage | Logs Render : migration SQL ; vérifier pooler + mot de passe |
| Page blanche | Rebuild Docker ; `VITE_API_URL=/api` est dans le Dockerfile |
| CORS | `CORS_ORIGIN` = URL exacte HTTPS Render |
| FedaPay stub | Clés sans `xxxxx` dans les variables Render |
| Admin ne redirige pas | `ADMIN_PHONES=+22893224301` sur Render |

---

## Checklist avant mise en ligne réelle

- [ ] `ALLOW_SIMULATE_PAYMENT=false`
- [ ] `FEDAPAY_ENVIRONMENT=live` + clés live
- [ ] `JWT_SECRET` fort et unique
- [ ] Webhook FedaPay configuré
- [ ] `check:integrations` OK en local avec les mêmes clés
