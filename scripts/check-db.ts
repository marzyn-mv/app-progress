import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const p = await sql`SELECT COUNT(*) as count FROM projects`;
  const pub = await sql`SELECT COUNT(*) as count FROM published`;
  const s = await sql`SELECT COUNT(*) as count FROM settings`;
  console.log("Projects:", p[0].count);
  console.log("Published:", pub[0].count);
  console.log("Settings:", s[0].count);
}

main().catch(console.error);
