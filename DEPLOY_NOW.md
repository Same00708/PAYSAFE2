# Déployer PaySafe maintenant (FedaPay plus tard)

## Phase 1 — Ce qui tourne sans FedaPay

- Connexion / inscription par téléphone  
- Transactions, chat, notifications  
- Paiement **simulé** (`ALLOW_SIMULATE_PAYMENT=true` sur Render)  
- FedaPay réel → phase 2 (clés dans `.env` + Render)

---

## A. Préparer GitHub (5 min)

```powershell
cd C:\Users\HP\Desktop\PaySafe_Project
git init
git add .
git commit -m "PaySafe v1 — déploiement initial"
```

Créez un repo vide sur https://github.com/new (ex. `PaySafe_Project`), puis :

```powershell
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/PaySafe_Project.git
git push -u origin main
```

---

## B. Render (10 min)

1. https://render.com → **Sign up** (compte gratuit)
2. **New** → **Blueprint**
3. Connectez GitHub → choisissez `PaySafe_Project`
4. Render lit `render.yaml` à la racine
5. Quand Render demande les variables, renseignez :

| Variable | Où la trouver |
|----------|----------------|
| `DATABASE_POOLER_URL` | Supabase → Connect → **Session pooler** (copier depuis votre `.env` local) |
| `CORS_ORIGIN` | Laisser vide au 1er déploiement, puis remettre l’URL Render |
| `APP_BASE_URL` | Idem |

`JWT_SECRET` : généré automatiquement par Render.

6. **Apply** → attendez le build Docker (5–15 min)

---

## C. Après le 1er déploiement

1. Copiez l’URL Render, ex. `https://paysafe-xxxx.onrender.com`
2. Render → **Environment** → mettez à jour :

```
CORS_ORIGIN=https://paysafe-xxxx.onrender.com
APP_BASE_URL=https://paysafe-xxxx.onrender.com
```

3. **Manual Deploy** → Redeploy

4. Testez :

- `https://paysafe-xxxx.onrender.com` → page d’accueil  
- `https://paysafe-xxxx.onrender.com/api/health` → `"database":"connected"`  
- Connexion admin : **93224301**

---

## D. Comptes démo sur la base prod (une fois)

Sur votre PC (même `DATABASE_POOLER_URL` que Render) :

```powershell
cd C:\Users\HP\Desktop\PaySafe_Project\03_Code\backend
npm run db:seed:users
```

---

## E. Phase 2 — FedaPay (plus tard)

1. Clés sur https://fedapay.com → `.env` local + variables Render  
2. `ALLOW_SIMULATE_PAYMENT=false` sur Render  
3. Webhook : `https://paysafe-xxxx.onrender.com/api/webhooks/fedapay`

Voir `03_Code/FEDAPAY_SETUP.md`.

---

## Dépannage rapide

| Problème | Action |
|----------|--------|
| Build Docker échoue | Logs Render → vérifier que le repo contient `01_Documentation/.../database/*.sql` |
| Health check failed | `DATABASE_POOLER_URL` incorrect ou projet Supabase en pause |
| CORS / page blanche | `CORS_ORIGIN` = URL HTTPS exacte Render |
| Paiement | En phase 1 : bouton simuler paiement (si visible) ou `ALLOW_SIMULATE_PAYMENT=true` |
