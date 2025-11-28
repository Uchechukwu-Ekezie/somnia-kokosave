/**
 * Script to register KokoSave schemas on Somnia Data Streams
 *
 * Run this script once to register all schemas on-chain:
 * npx ts-node scripts/register-somnia-schemas.ts
 *
 * Or compile and run:
 * npx tsx scripts/register-somnia-schemas.ts
 */

import { config } from "dotenv";
import { registerKokoSaveSchemas } from "../lib/somnia/somnia-client";

config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;
  const rpcUrl =
    process.env.SOMNIA_RPC_URL || "https://dream-rpc.somnia.network";

  if (!privateKey) {
    console.error("❌ PRIVATE_KEY not found in .env file");
    console.log("Please add your private key to .env:");
    console.log("PRIVATE_KEY=0x...");
    process.exit(1);
  }

  console.log("🚀 Registering KokoSave schemas on Somnia Data Streams...");
  console.log("RPC URL:", rpcUrl);
  console.log("");

  try {
    await registerKokoSaveSchemas(privateKey, rpcUrl);
    console.log("");
    console.log("✅ All schemas registered successfully!");
    console.log("");
    console.log("Registered schemas:");
    console.log("  - kokosave_pool_activity");
  } catch (error) {
    console.error("❌ Error registering schemas:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


