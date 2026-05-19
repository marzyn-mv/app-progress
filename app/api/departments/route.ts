import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const DEFAULT_DEPARTMENTS = ["IT", "Finance", "HR", "Legal", "Operations"];

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT data FROM settings WHERE key = 'departments'`;
  const departments = rows.length > 0 ? rows[0].data : DEFAULT_DEPARTMENTS;
  return NextResponse.json(departments);
}

export async function PUT(request: Request) {
  const departments: string[] = await request.json();
  const sql = getDb();

  await sql`
    INSERT INTO settings (key, data)
    VALUES ('departments', ${JSON.stringify(departments)})
    ON CONFLICT (key) DO UPDATE SET data = ${JSON.stringify(departments)}
  `;

  return NextResponse.json(departments);
}
