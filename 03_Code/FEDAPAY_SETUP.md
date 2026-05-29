# Configuration FedaPay (avant déploiement)

## 1. Créer un compte FedaPay

1. Inscription sur [https://fedapay.com](https://fedapay.com)
2. Dashboard → **API** → copier les clés **sandbox** :
   - `FEDAPAY_SECRET_KEY` (`sk_sandbox_…`)
   - `FEDAPAY_PUBLIC_KEY` (`pk_sandbox_…`)
3. Webhooks → secret `FEDAPAY_WEBHOOK_SECRET` → URL prod : `https://VOTRE-API/api/webhooks/fedapay`

## 2. Variables `.env` (backend)

```env
FEDAPAY_ENVIRONMENT=sandbox
FEDAPAY_SECRET_KEY=sk_sandbox_VOTRE_CLE
FEDAPAY_PUBLIC_KEY=pk_sandbox_VOTRE_CLE
FEDAPAY_WEBHOOK_SECRET=whsec_VOTRE_SECRET
APP_BASE_URL=https://votre-frontend.com
```

Tant que la clé contient `xxxxx`, PaySafe reste en **mode stub** (simulation locale uniquement).

## 3. Opérateurs Togo (XOF)

| UI PaySafe   | Mode FedaPay |
|--------------|--------------|
| Moov Money   | `moov_tg`    |
| Togocel/Yas  | `togocel`    |

Le numéro Mobile Money est envoyé **sans** `+228` (ex. `90123456`).

## 4. Vérifier avant déploiement

```powershell
cd 03_Code\backend
npm run db:migrate
npm run check:integrations
```

Ou API démarrée : `GET http://localhost:4000/api/health/integrations`

- **notifications** : table + création/lecture OK
- **fedapay** : `ok: true` si les clés sandbox sont valides

## 5. Test manuel paiement

1. Connectez-vous (acheteur), créez une commande
2. Payer → choisir Moov ou Togocel, numéro sandbox FedaPay
3. Sans clés réelles : bouton « Simuler paiement » (dev, `ALLOW_SIMULATE_PAYMENT=true`)

## Limites connues

- Notifications **in-app** uniquement (pas SMS/push pour l’instant)
- Payouts/remboursements : nécessitent un compte FedaPay activé pour les versements
