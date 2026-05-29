/**
 * Si db.xxx.supabase.co → ENOTFOUND, trouve la région du Session pooler (IPv4).
 * Usage: npm run db:discover-pooler
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";
import {
  buildSessionPoolerUrl,
  extractPostgresPassword,
  extractSupabaseProjectRef,
  SUPABASE_POOLER_REGIONS,
} from "../src/config/databaseUrl.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

const direct = process.env.DATABASE_URL ?? "";
const ref = extractSupabaseProjectRef(direct);
const password = extractPostgresPassword(direct);

if (!ref || !password) {
  console.error("DATABASE_URL invalide ou projet non-Supabase.");
  process.exit(1);
}

console.info(`Projet Supabase : ${ref}`);
console.info("Recherche du pooler IPv4 (Session mode)…\n");

for (const cluster of ["1", "0"] as const) {
for (const region of SUPABASE_POOLER_REGIONS) {
  const url = buildSessionPoolerUrl(ref, password, region, cluster);
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12_000,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end();

    console.info(`✓ Connexion OK — aws-${cluster}-${region}`);
    console.info(`\nAjoutez dans .env :\n`);
    console.info(`DATABASE_POOLER_URL=${url.replace(password, "****")}`);
    console.info(`\n(La vraie URL avec mot de passe sera écrite dans .env)\n`);

    let envContent = readFileSync(envPath, "utf-8");
    const line = `DATABASE_POOLER_URL=${url}`;
    if (/^DATABASE_POOLER_URL=/m.test(envContent)) {
      envContent = envContent.replace(/^DATABASE_POOLER_URL=.*$/m, line);
    } else {
      envContent = envContent.replace(
        /^DATABASE_URL=/m,
        `${line}\nDATABASE_URL=`,
      );
    }
    writeFileSync(envPath, envContent, "utf-8");
    console.info("✓ .env mis à jour avec DATABASE_POOLER_URL");
    console.info("\nRelancez : npm run db:test-connection && npm run db:setup && npm run dev");
    process.exit(0);
  } catch (err) {
    // try next region
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("ENOTFOUND") && !msg.includes("timeout")) {
      console.info(`  ${region} → ${msg.slice(0, 80)}`);
    }
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}
}

console.error("\n✗ Aucune région trouvée automatiquement.");
console.info(`
Copiez manuellement depuis Supabase :
  1. https://supabase.com/dashboard/project/${ref}
  2. Bouton « Connect » en haut
  3. Onglet « Session pooler » (ou Connection pooling → Session)
  4. Copiez l'URI et ajoutez dans .env :

DATABASE_POOLER_URL=postgresql://postgres.${ref}:VOTRE_MOT_DE_PASSE@aws-0-XXXX.pooler.supabase.com:5432/postgres
`);
process.exit(1);
