import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT data FROM projects ORDER BY created_at`;
  const projects: Project[] = rows.map((r) => r.data as Project);
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const project: Project = await request.json();
  const sql = getDb();
  await sql`INSERT INTO projects (id, data) VALUES (${project.id}, ${JSON.stringify(project)})`;
  return NextResponse.json(project, { status: 201 });
}
