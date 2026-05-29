import { runMigrations } from "./migrateCore.js";

runMigrations({ closePool: true }).catch((err) => {
  console.error("[db:migrate] Erreur:", err);
  process.exit(1);
});
