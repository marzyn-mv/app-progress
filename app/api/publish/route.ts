import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT data, published_at FROM published WHERE key = 'current'`;

  if (rows.length === 0) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    project: rows[0].data as Project,
    publishedAt: rows[0].published_at,
  });
}

export async function POST(request: Request) {
  const { project, publishedAt }: { project: Project; publishedAt: string } =
    await request.json();

  const sql = getDb();
  await sql`
    INSERT INTO published (key, data, published_at)
    VALUES ('current', ${JSON.stringify(project)}, ${publishedAt})
    ON CONFLICT (key) DO UPDATE SET data = ${JSON.stringify(project)}, published_at = ${publishedAt}
  `;

  return NextResponse.json({ project, publishedAt });
}
