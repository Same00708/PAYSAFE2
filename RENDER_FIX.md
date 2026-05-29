# Corriger le build Render

## 1. Pousser les correctifs

```bash
cd ~/Desktop/PaySafe_Project
git add Dockerfile .dockerignore render.yaml 03_Code/database
git commit -m "fix: build Render — SQL + Dockerfile racine"
git push origin main
```

## 2. Réglages Render (obligatoire)

**Settings → Build & Deploy**

| Champ | Valeur |
|--------|--------|
| Root Directory | *(vide)* |
| Dockerfile Path | `Dockerfile` |
| Docker Build Context Directory | `.` |

**Pas** `03_Code` comme racine.

## 3. Variables minimum

- `DATABASE_POOLER_URL` = URI Supabase Session pooler
- Après 1er deploy : `CORS_ORIGIN` et `APP_BASE_URL` = votre URL Render

## 4. Redéployer

**Manual Deploy** → **Clear build cache & deploy**

## 5. Test

`https://VOTRE-URL.onrender.com/api/health`
