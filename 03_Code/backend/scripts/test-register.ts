import dotenv from "dotenv";
dotenv.config();

import { checkDbConnection } from "../src/db/pool.js";
import { hasPaySafeUsersTable } from "../src/db/paysafeSchema.js";
import { pool } from "../src/db/pool.js";
import { normalizePhone } from "../src/utils/phone.js";
import * as usersRepo from "../src/repositories/users.js";

async function main() {
  console.info("[db:check] Vérification PaySafe…\n");

  const connected = await checkDbConnection();
  console.info("Connexion BDD :", connected ? "OK" : "ÉCHEC");
  if (!connected) {
    process.exitCode = 1;
    await pool.end();
    return;
  }

  const usersReady = await hasPaySafeUsersTable();
  console.info("Table paysafe_users :", usersReady ? "OK" : "ABSENTE");
  if (!usersReady) {
    console.error("\n→ npm run db:migrate");
    process.exitCode = 1;
    await pool.end();
    return;
  }

  const marie = await usersRepo.findUserByPhone(normalizePhone("90123456"));
  const junior = await usersRepo.findUserByPhone(normalizePhone("90765432"));

  console.info("\nCompte Marie :", marie ? `${marie.fullName} (${marie.phoneNumber})` : "ABSENT — npm run db:seed");
  console.info("Compte Junior :", junior ? `${junior.fullName} (${junior.phoneNumber})` : "ABSENT — npm run db:seed");

  if (!marie || !junior) {
    console.info("\n→ Création des comptes démo…");
    await usersRepo.ensureDemoUsers();
  }

  const marie2 = await usersRepo.findUserByPhone(normalizePhone("90123456"));
  if (marie2) {
    console.info("\n✓ Connexion démo possible avec 90123456 et 90765432");
  } else {
    console.error("\n✗ Comptes démo introuvables");
    process.exitCode = 1;
  }

  await pool.end();
}

main();
