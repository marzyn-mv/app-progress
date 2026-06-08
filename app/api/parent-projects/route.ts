import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

import type { ParentProject } from "@/lib/types";

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT data FROM settings WHERE key = 'parent_projects'`;
  const parentProjects: ParentProject[] = rows.length > 0 ? rows[0].data : [];
  return NextResponse.json(parentProjects);
}

export async function PUT(request: Request) {
  const parentProjects: ParentProject[] = await request.json();
  const sql = getDb();

  await sql`
    INSERT INTO settings (key, data)
    VALUES ('parent_projects', ${JSON.stringify(parentProjects)})
    ON CONFLICT (key) DO UPDATE SET data = ${JSON.stringify(parentProjects)}
  `;

  return NextResponse.json(parentProjects);
}
