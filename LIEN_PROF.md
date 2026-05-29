# Envoyer le lien à votre prof — 10 minutes

## Ce dont vous avez besoin

1. Code sur GitHub (`Same00708/PAYSAFE2` ou `CeliaSam/PAYSAFE2`)
2. Compte [Render](https://render.com) (gratuit)
3. `DATABASE_POOLER_URL` dans votre fichier `.env` local (Supabase)

---

## Étape 1 — Git (2 min)

```bash
cd ~/Desktop/PaySafe_Project
git add .
git commit -m "PaySafe pret pour demo prof"
git push origin main
```

---

## Étape 2 — Render (5 min)

1. https://render.com → **New** → **Web Service**
2. Repo GitHub **PAYSAFE2**
3. Paramètres :

| Champ | Valeur |
|--------|--------|
| Name | `paysafe` |
| Root Directory | *(vide)* |
| Environment | **Docker** |
| Dockerfile Path | `Dockerfile` |
| Docker Context | `.` |

4. **Environment Variables** — ajoutez :

```
DATABASE_POOLER_URL = (copier depuis 03_Code/backend/.env)
JWT_SECRET = (n'importe quelle phrase longue 32+ caractères)
ALLOW_SIMULATE_PAYMENT = true
SEED_DEMO_ON_START = true
ADMIN_PHONES = +22893224301
```

5. **Create Web Service** → attendez que le statut soit **Live** (vert)

---

## Étape 3 — URL pour le prof (2 min)

1. Copiez l’URL Render, ex. `https://paysafe-xxxx.onrender.com`
2. Render → **Environment** → ajoutez :

```
CORS_ORIGIN = https://paysafe-xxxx.onrender.com
APP_BASE_URL = https://paysafe-xxxx.onrender.com
```

3. **Save** → **Manual Deploy**

4. Testez : ouvrez l’URL → **Connexion** → numéro `90123456` → ça doit marcher.

---

## Message à envoyer au prof

```
Bonjour,

Voici la démo PaySafe (escrow Mobile Money) :
https://paysafe-xxxx.onrender.com

Comptes de test (page Connexion) :
- Marie (acheteuse) : 90123456
- Junior (vendeur) : 90765432
- Administrateur : 93224301

Parcours suggéré :
1) Connexion Marie → créer une commande vers Junior
2) Connexion Junior → voir la notification et le chat
3) Marie paie (simulation) → valider la livraison

Cordialement,
```

Remplacez `paysafe-xxxx` par votre vraie URL.

---

## Si le site ne s’ouvre pas

- Render **Logs** : erreur `DATABASE` → vérifiez `DATABASE_POOLER_URL`
- Build failed → Root Directory vide, Dockerfile = `Dockerfile`
- Page blanche → refaites Manual Deploy après CORS_ORIGIN
