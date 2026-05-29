import dotenv from "dotenv";
dotenv.config();

import { describeActiveDatabaseUrl, printDatabaseConnectionHelp } from "../src/db/connectionDiagnostics.js";
import { checkDbConnection, pool } from "../src/db/pool.js";
import { hasPaySafeUsersTable } from "../src/db/paysafeSchema.js";

console.info("=== Test connexion PaySafe ===\n");
const { masked, usesPooler } = describeActiveDatabaseUrl();
console.info("URL utilisée :", masked);
if (!usesPooler) {
  console.warn("⚠ Pas de DATABASE_POOLER_URL — connexion directe souvent lente / timeout sur Windows\n");
}

const ok = await checkDbConnection();
console.info("\nConnexion:", ok ? "OK" : "ÉCHEC");

if (!ok) {
  printDatabaseConnectionHelp();
  process.exit(1);
}

const users = await hasPaySafeUsersTable();
console.info("Table paysafe_users:", users ? "OK" : "absente → npm run db:setup");

if (users) {
  const { rows } = await pool.query<{ n: string }>(
    "SELECT COUNT(*)::text AS n FROM paysafe_users",
  );
  console.info("Utilisateurs:", rows[0]?.n ?? "0");
}

await pool.end();
console.info("\n=== Fin ===");
