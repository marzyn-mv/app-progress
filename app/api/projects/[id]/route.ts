import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  const rows = await sql`SELECT data FROM projects WHERE id = ${id}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0].data as Project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project: Project = await request.json();
  const sql = getDb();

  await sql`
    INSERT INTO projects (id, data, updated_at)
    VALUES (${id}, ${JSON.stringify(project)}, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(project)}, updated_at = NOW()
  `;

  return NextResponse.json(project);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  await sql`DELETE FROM projects WHERE id = ${id}`;
  return NextResponse.json({ deleted: true });
}
