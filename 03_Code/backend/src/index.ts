import { createApp } from "./app.js";
import { env, assertFedapayConfigured, assertProductionSecrets } from "./config/env.js";
import { checkDbConnection, getLastConnectionError } from "./db/pool.js";
import { hasPaySafeUsersTable } from "./db/paysafeSchema.js";
import { ensureDemoUsers } from "./repositories/users.js";
import { seedDemoAccountsIfNeeded } from "./services/seedDemo.js";
import { smsService } from "./services/sms.js";

assertFedapayConfigured();
assertProductionSecrets();

const app = createApp();

app.listen(env.port, async () => {
  const dbOk = await checkDbConnection();
  const usersOk = dbOk ? await hasPaySafeUsersTable() : false;
  if (dbOk && usersOk) {
    try {
      if (env.nodeEnv !== "production") {
        await ensureDemoUsers();
      } else if (env.seedDemoOnStart) {
        await seedDemoAccountsIfNeeded();
      }
    } catch (err) {
      console.warn("[PaySafe] Seed démo:", err instanceof Error ? err.message : err);
    }
  }
  console.info(`[PaySafe] http://localhost:${env.port}`);
  if (dbOk) {
    console.info(
      `[PaySafe] Database → ${usersOk ? "OK (paysafe_users)" : "connectée — lancez npm run db:migrate && npm run db:seed"}`,
    );
  } else {
    const hint = getLastConnectionError();
    console.error("[PaySafe] Database → ERREUR connexion");
    if (hint) console.error(`[PaySafe] Détail: ${hint}`);
    console.error("[PaySafe] Vérifiez DATABASE_URL dans .env (mot de passe Supabase, SSL)");
  }
  console.info(`[PaySafe] SMS → ${env.sms.provider} (${smsService.isConfigured() ? "configuré" : "console/fallback"})`);
  if (env.nodeEnv === "production") {
    console.info(`[PaySafe] Site + API sur le même domaine`);
  }
});
