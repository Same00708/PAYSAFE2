# Connexion Supabase — PaySafe

| Élément | Valeur |
|---------|--------|
| Projet | `rcggqqdplgzqzusepsmz` |
| Dashboard | https://supabase.com/dashboard/project/rcggqqdplgzqzusepsmz |

## Erreur `ENOTFOUND db.xxx.supabase.co`

L’hôte **direct** (`db.rcggqqdplgzqzusepsmz.supabase.co`) est souvent **IPv6 uniquement**.
Sur Windows / réseaux sans IPv6, le DNS échoue → `getaddrinfo ENOTFOUND`.

**Ce n’est pas un mauvais mot de passe** — c’est le réseau.

### Solution rapide (automatique)

```powershell
cd 03_Code\backend
npm run db:discover-pooler
npm run db:test-connection
npm run db:setup
npm run dev
```

Le script teste les régions Supabase et écrit `DATABASE_POOLER_URL` dans `.env`.

### Solution manuelle

1. Dashboard → **Connect** (en haut)
2. Choisir **Session pooler** (port **5432**, compatible IPv4)
3. Copier l’URI, par ex. :
   ```
   postgresql://postgres.rcggqqdplgzqzusepsmz:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   ```
4. Dans `.env` :
   ```env
   DATABASE_POOLER_URL=postgresql://postgres.rcggqqdplgzqzusepsmz:VOTRE_MOT_DE_PASSE@aws-0-REGION.pooler.supabase.com:5432/postgres?uselibpqcompat=true&sslmode=require
   ```
   (`@` dans le mot de passe → `%40`)

PaySafe utilise **DATABASE_POOLER_URL** en priorité, puis **DATABASE_URL**.

## Mot de passe

- Settings → Database → reset password si `password authentication failed`
- Encoder les caractères spéciaux dans l’URL (`@` → `%40`)

## Vérification

```powershell
npm run db:test-connection
```

http://localhost:4000/api/health → `"database": "connected"`
