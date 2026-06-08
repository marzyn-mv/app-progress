"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project, ParentProject } from "@/lib/types";

const BRAND_COLORS: [string, string][] = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#ec4899", "#f472b6"],
  ["#ef4444", "#f87171"],
  ["#f97316", "#fb923c"],
  ["#f59e0b", "#fbbf24"],
  ["#84cc16", "#a3e635"],
  ["#22c55e", "#4ade80"],
  ["#14b8a6", "#2dd4bf"],
  ["#06b6d4", "#22d3ee"],
  ["#0ea5e9", "#38bdf8"],
  ["#3b82f6", "#60a5fa"],
  ["#d946ef", "#e879f9"],
  ["#e11d48", "#fb7185"],
  ["#0d9488", "#2dd4bf"],
  ["#7c3aed", "#a78bfa"],
];

function getBrandColor(index: number): [string, string] {
  return BRAND_COLORS[index % BRAND_COLORS.length];
}

function getParentColor(index: number): [string, string] {
  return BRAND_COLORS[index % BRAND_COLORS.length];
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const statusLabel = (status: Project["status"]) => {
  switch (status) {
    case "DEPLOYED": return "Deployed";
    case "STAGING": return "Staging";
    case "DEVELOPING": return "Developing";
    case "PENDING": return "Pending";
  }
};

function GradientProgress({ value, from, to }: { value: number; from: string; to: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, background: `linear-gradient(90deg, ${from}, ${to})` }}
      />
    </div>
  );
}

function ParentProjectCard({
  parent,
  children,
  color,
  allProjects,
  onSelectProject,
}: {
  parent: ParentProject;
  children: Project[];
  color: [string, string];
  allProjects: Project[];
  onSelectProject: (p: Project) => void;
}) {
  const avgProgress = children.length > 0
    ? Math.round(children.reduce((sum, p) => sum + p.progress, 0) / children.length)
    : 0;

  const deployed = children.filter((p) => p.status === "DEPLOYED").length;
  const staging = children.filter((p) => p.status === "STAGING").length;
  const developing = children.filter((p) => p.status === "DEVELOPING").length;
  const pending = children.filter((p) => p.status === "PENDING").length;

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {/* Parent header */}
      <div className="relative bg-muted/40 p-5">
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${color[0]}, ${color[1]})` }}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold tracking-tight">{parent.title}</h2>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{children.length} module{children.length !== 1 ? "s" : ""}</span>
              {parent.link && (
                <a
                  href={parent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  {parent.link}
                </a>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold tabular-nums" style={{ color: color[0] }}>
              {avgProgress}%
            </p>
            <p className="text-[11px] text-muted-foreground">avg progress</p>
          </div>
        </div>

        <div className="mt-3">
          <GradientProgress value={avgProgress} from={color[0]} to={color[1]} />
        </div>

        {/* Status counts */}
        <div className="mt-3 flex gap-3 text-xs">
          {deployed > 0 && (
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-green-600" />
              {deployed} Deployed
            </span>
          )}
          {staging > 0 && (
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              {staging} Staging
            </span>
          )}
          {developing > 0 && (
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-blue-500" />
              {developing} Developing
            </span>
          )}
          {pending > 0 && (
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-500" />
              {pending} Pending
            </span>
          )}
        </div>
      </div>

      {/* Child modules */}
      {children.length > 0 && (
        <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4">
          {children.map((project) => {
            const projectIndex = allProjects.indexOf(project);
            const pColor = getBrandColor(projectIndex >= 0 ? projectIndex : 0);
            return (
              <div
                key={project.id}
                className="group relative cursor-pointer overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                onClick={() => onSelectProject(project)}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${pColor[0]}, ${pColor[1]})` }}
                />
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${pColor[0]}, ${pColor[1]})` }}
                  >
                    {statusLabel(project.status)}
                  </span>
                  <span className="text-lg font-bold tabular-nums" style={{ color: pColor[0] }}>
                    {project.progress}%
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-tight line-clamp-2">{project.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="mt-3">
                  <GradientProgress value={project.progress} from={pColor[0]} to={pColor[1]} />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Launch {project.launchDate ? formatDate(project.launchDate) : "Not Set"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectDetailModal({ project, color }: { project: Project; color: [string, string] }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` }}
        >
          {statusLabel(project.status)}
        </span>
        <span className="ml-auto text-2xl font-bold tabular-nums" style={{ color: color[0] }}>
          {project.progress}%
        </span>
      </div>

      <GradientProgress value={project.progress} from={color[0]} to={color[1]} />

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatDate(project.startDate)} &rarr; {formatDate(project.endDate)}</span>
        <span className="font-medium" style={{ color: color[0] }}>Launch {project.launchDate ? formatDate(project.launchDate) : "Not Set"}</span>
      </div>

      <p className="mt-4 leading-7 text-foreground/80">{project.description}</p>

      <div className="mt-4 rounded-xl p-4" style={{ background: `${color[0]}0d` }}>
        <p className="font-semibold" style={{ color: color[0] }}>Why this matters</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/80">{project.why}</p>
      </div>

      {(project.actionPoints?.length ?? 0) > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Actions</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {project.actionPoints.map((ap) => (
              <li key={ap.id} className="text-sm text-foreground/80">
                {ap.text || "Untitled action"}
                {ap.department && (
                  <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">{ap.department}</Badge>
                )}
                {ap.dueDate && (
                  <span className="ml-2 text-xs text-muted-foreground">Due {formatDate(ap.dueDate)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {((project.phase1?.tasks.length ?? 0) > 0 || (project.phase2?.tasks.length ?? 0) > 0) && (
        <Separator className="my-4" />
      )}

      {[
        { key: "phase1" as const, label: "Phase 1" },
        { key: "phase2" as const, label: "Phase 2" },
      ].map(({ key, label }) =>
        (project[key]?.tasks.length ?? 0) > 0 ? (
          <div key={key} className="mt-4">
            <p className="text-sm font-semibold">{label}</p>
            <ul className="mt-2 space-y-2">
              {project[key].tasks.map((task) => (
                <li key={task.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-4 shrink-0 rounded-full border"
                      style={task.done ? { borderColor: color[0], backgroundColor: color[0] } : { borderColor: "var(--color-muted-foreground)" }}
                    />
                    <span className={task.done ? "text-muted-foreground line-through" : ""}>
                      {task.label || "Untitled task"}
                    </span>
                    {task.department && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{task.department}</Badge>
                    )}
                  </div>
                  <div className="ml-6 mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {(task.startDate || task.endDate) && (
                      <span>{formatDate(task.startDate)} &rarr; {formatDate(task.endDate)}</span>
                    )}
                    {task.remarks && <span className="italic">{task.remarks}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [parentProjects, setParentProjects] = useState<ParentProject[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/parent-projects").then((r) => r.json()),
    ])
      .then(([projectsData, ppData]) => {
        if (Array.isArray(projectsData)) setProjects(projectsData);
        if (Array.isArray(ppData)) setParentProjects(ppData);
      })
      .catch(() => {});
  }, []);

  // Group projects by parentId
  const grouped = new Map<string, Project[]>();
  for (const p of projects) {
    const key = p.parentId || "_standalone";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }

  const standaloneProjects = grouped.get("_standalone") || [];

  // Overall stats
  const totalModules = projects.length;
  const totalParents = parentProjects.filter((pp) => grouped.has(pp.id)).length;

  return (
    <div className="mx-auto max-w-[1220px] px-6 py-8">
      <header className="mb-10 text-center" aria-label="Projects header">
        <Badge variant="secondary" className="mb-3">Projects</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Project Portfolio</h1>
        <p className="mt-2 text-muted-foreground">
          Parent projects and their modules — grouped for a high-level view of delivery.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link
            href="/timeline"
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Delivery Timeline
          </Link>
        </div>
      </header>

      {/* Summary stats */}
      {projects.length > 0 && (
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-3xl font-bold">{totalParents}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Parent Projects</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-3xl font-bold">{totalModules}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Modules</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold">{standaloneProjects.length}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Standalone</p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-xl bg-destructive/8 p-6 text-center text-destructive" role="status">
          <p>No projects yet. Add projects from the settings page.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Parent projects with their children */}
          {[...parentProjects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).flatMap((pp, i, arr) => {
            const children = grouped.get(pp.id) || [];
            if (children.length === 0) return [];
            const items = [
              <ParentProjectCard
                key={pp.id}
                parent={pp}
                children={children}
                color={getParentColor(i)}
                allProjects={projects}
                onSelectProject={setSelected}
              />,
            ];
            // Add separator if there's a next visible parent
            if (arr.slice(i + 1).some((next) => (grouped.get(next.id) || []).length > 0)) {
              items.push(<Separator key={`sep-${pp.id}`} className="my-2" />);
            }
            return items;
          })}

          {/* Standalone projects (no parent) */}
          {standaloneProjects.length > 0 && (
            <>
              {totalParents > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <Separator className="flex-1" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Standalone Projects</span>
                  <Separator className="flex-1" />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {standaloneProjects.map((project) => {
                  const idx = projects.indexOf(project);
                  const [from, to] = getBrandColor(idx >= 0 ? idx : 0);
                  return (
                    <Card
                      key={project.id}
                      className="group relative cursor-pointer overflow-hidden border-0 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                      onClick={() => setSelected(project)}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
                      />
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-tight">{project.title}</h3>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                          >
                            {statusLabel(project.status)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1">
                            <GradientProgress value={project.progress} from={from} to={to} />
                          </div>
                          <span className="text-sm font-bold tabular-nums" style={{ color: from }}>
                            {project.progress}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] w-[95vw] max-w-[900px] overflow-y-auto p-6">
          {selected && (() => {
            const idx = projects.indexOf(selected);
            const color = getBrandColor(idx >= 0 ? idx : 0);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.title}</DialogTitle>
                </DialogHeader>
                <ProjectDetailModal project={selected} color={color} />
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
