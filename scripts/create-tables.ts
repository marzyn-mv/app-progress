/**
 * Run once to create the Postgres tables:
 *   npx tsx scripts/create-tables.ts
 *
 * Requires DATABASE_URL env var.
 */
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS published (
      key TEXT PRIMARY KEY DEFAULT 'current',
      data JSONB NOT NULL,
      published_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `;

  console.log("Tables created successfully.");
}

main().catch(console.error);
