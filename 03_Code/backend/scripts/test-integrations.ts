/**
 * Vérifie notifications (BDD) + connexion API FedaPay avant déploiement.
 * Usage : npm run check:integrations
 */
import "dotenv/config";
import {
  describeActiveDatabaseUrl,
  printDatabaseConnectionHelp,
} from "../src/db/connectionDiagnostics.js";
import { checkDbConnection, pool } from "../src/db/pool.js";
import { fedapayService } from "../src/services/fedapay.js";
import * as notificationsRepo from "../src/repositories/notifications.js";

async function main() {
  console.info("=== PaySafe — test intégrations ===\n");

  const { masked, usesPooler } = describeActiveDatabaseUrl();
  console.info("Connexion BDD :", masked);
  if (!usesPooler) {
    console.warn(
      "⚠ DATABASE_POOLER_URL absent — utilisez le Session pooler Supabase (IPv4)\n",
    );
  }

  const dbOk = await checkDbConnection();
  if (!dbOk) {
    printDatabaseConnectionHelp();
    process.exit(1);
  }
  console.info("✓ Base de données connectée");

  const { rows: tableRows } = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'notifications'
     ) AS exists`,
  );

  if (!tableRows[0]?.exists) {
    console.error("✗ Table notifications absente — lancez npm run db:migrate");
    await pool.end();
    process.exit(1);
  }
  console.info("✓ Table notifications présente");

  const { rows: userRows } = await pool.query<{ user_id: number }>(
    "SELECT user_id FROM paysafe_users ORDER BY user_id LIMIT 1",
  );
  const testUserId = userRows[0]?.user_id;
  if (!testUserId) {
    console.error("✗ Aucun utilisateur — npm run db:seed:users");
    await pool.end();
    process.exit(1);
  }

  const created = await notificationsRepo.createNotification({
    userId: testUserId,
    type: "SYSTEM",
    title: "Test intégration PaySafe",
    content: "Notification de test (peut être ignorée).",
  });
  console.info(`✓ Notification créée (#${created.notificationId})`);

  const { data, unreadCount } = await notificationsRepo.findByUser(testUserId);
  const found = data.some((n) => n.notificationId === created.notificationId);
  if (!found) {
    console.error("✗ Lecture notifications échouée");
    await pool.end();
    process.exit(1);
  }
  console.info(`✓ Lecture OK (${data.length} notifs, ${unreadCount} non lues)`);

  await notificationsRepo.markSeen(created.notificationId, testUserId);
  console.info("✓ Marquage lu OK");

  console.info("\n--- FedaPay ---");
  if (!fedapayService.isConfigured()) {
    console.warn(
      "⚠ FedaPay en mode stub (FEDAPAY_SECRET_KEY placeholder ou absente)",
    );
    console.warn(
      "  → Paiements réels : clés sandbox sur https://fedapay.com (voir FEDAPAY_SETUP.md)",
    );
    await pool.end();
    console.info("\n=== OK notifications — FedaPay à configurer avant prod ===");
    process.exit(0);
  }

  const fedapay = await fedapayService.testConnection();
  if (fedapay.ok) {
    console.info(`✓ ${fedapay.message}`);
    console.info(`  Environnement : ${fedapay.environment}`);
  } else {
    console.error(`✗ FedaPay : ${fedapay.message}`);
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.info("\n=== Prêt pour déploiement (notifications OK, FedaPay OK) ===");
}

main().catch(async (err) => {
  const msg = err instanceof Error ? err.message : String(err);
  if (/timeout|terminated|ENOTFOUND|ECONNREFUSED/i.test(msg)) {
    printDatabaseConnectionHelp();
  } else {
    console.error("Erreur:", msg);
  }
  try {
    await pool.end();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
