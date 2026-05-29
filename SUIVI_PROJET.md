# PaySafe — Suivi v1.0 (prêt déploiement)

**Avancement : ~95 %** — Fonctionnel et déployable.

## Livré

- Inscription + connexion OTP par **SMS** (Termii / Twilio)
- Fallback console en dev si pas de clé SMS
- Transactions complètes (paiement, retour, litige, chat)
- FedaPay collecte + webhook + payout/refund
- Supabase PostgreSQL
- Build production (API + site sur un domaine)
- Docker + Render + guide `DEPLOYMENT.md`

## Avant de présenter demain

1. `npm run db:migrate-auth` (Supabase)
2. Clé **TERMII_API_KEY** dans `.env` ou Render
3. Clé **FEDAPAY_SECRET_KEY** sandbox
4. Déployer sur Render (voir DEPLOYMENT.md)

## Commandes

```powershell
cd 03_Code\backend
npm install
npm run db:migrate-auth
npm run dev

cd ..\web
npm run dev
```

Production locale : `npm run build:all` puis `NODE_ENV=production npm start`
