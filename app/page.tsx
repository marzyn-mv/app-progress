"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Project } from '@/lib/types';

const BRAND_COLORS: [string, string][] = [
  ['#6366f1', '#818cf8'], // indigo
  ['#8b5cf6', '#a78bfa'], // violet
  ['#ec4899', '#f472b6'], // pink
  ['#ef4444', '#f87171'], // red
  ['#f97316', '#fb923c'], // orange
  ['#f59e0b', '#fbbf24'], // amber
  ['#84cc16', '#a3e635'], // lime
  ['#22c55e', '#4ade80'], // green
  ['#14b8a6', '#2dd4bf'], // teal
  ['#06b6d4', '#22d3ee'], // cyan
  ['#0ea5e9', '#38bdf8'], // sky
  ['#3b82f6', '#60a5fa'], // blue
  ['#d946ef', '#e879f9'], // fuchsia
  ['#e11d48', '#fb7185'], // rose
  ['#0d9488', '#2dd4bf'], // teal-dark
  ['#7c3aed', '#a78bfa'], // purple
  ['#2563eb', '#60a5fa'], // blue-dark
  ['#c026d3', '#e879f9'], // fuchsia-dark
  ['#ea580c', '#fb923c'], // orange-dark
  ['#16a34a', '#4ade80'], // green-dark
  ['#0891b2', '#22d3ee'], // cyan-dark
  ['#4f46e5', '#818cf8'], // indigo-dark
  ['#9333ea', '#c084fc'], // purple-med
  ['#dc2626', '#f87171'], // red-dark
  ['#ca8a04', '#facc15'], // yellow
  ['#059669', '#34d399'], // emerald
];

function getBrandColor(index: number): [string, string] {
  return BRAND_COLORS[index % BRAND_COLORS.length];
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusLabel = (status: Project['status']) => {
  switch (status) {
    case 'STAGING': return 'Staging';
    case 'DEVELOPING': return 'Developing';
    case 'PENDING': return 'Pending';
  }
};

function GradientProgress({ value, from, to }: { value: number; from: string; to: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${from}, ${to})`,
        }}
      />
    </div>
  );
}

function ProjectDetail({ project, color, allProjects, colorMap }: { project: Project; color: [string, string]; allProjects: Project[]; colorMap: Map<string, [string, string]> }) {
  const subModules = allProjects.filter(p => p.parentId === project.id);
  const parent = project.parentId ? allProjects.find(p => p.id === project.parentId) : null;

  return (
    <>
      {parent && (
        <p className="mb-2 text-xs text-muted-foreground">
          Sub-module of <span className="font-medium text-foreground">{parent.title}</span>
        </p>
      )}

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
        {project.launchDate && (
          <span className="font-medium" style={{ color: color[0] }}>Launch {formatDate(project.launchDate)}</span>
        )}
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
                {ap.text || 'Untitled action'}
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

      {((project.phase1?.tasks.length ?? 0) > 0 ||
        (project.phase2?.tasks.length ?? 0) > 0) && (
        <Separator className="my-4" />
      )}

      {(project.phase1?.tasks.length ?? 0) > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Phase 1</p>
          <ul className="mt-2 space-y-2">
            {project.phase1.tasks.map((task) => (
              <li key={task.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="size-4 shrink-0 rounded-full border"
                    style={task.done ? { borderColor: color[0], backgroundColor: color[0] } : { borderColor: 'var(--color-muted-foreground)' }}
                  />
                  <span className={task.done ? 'text-muted-foreground line-through' : ''}>
                    {task.label || 'Untitled task'}
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
      )}

      {(project.phase1?.tasks.length ?? 0) > 0 &&
        (project.phase2?.tasks.length ?? 0) > 0 && (
        <Separator className="my-4" />
      )}

      {(project.phase2?.tasks.length ?? 0) > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Phase 2</p>
          <ul className="mt-2 space-y-2">
            {project.phase2.tasks.map((task) => (
              <li key={task.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="size-4 shrink-0 rounded-full border"
                    style={task.done ? { borderColor: color[0], backgroundColor: color[0] } : { borderColor: 'var(--color-muted-foreground)' }}
                  />
                  <span className={task.done ? 'text-muted-foreground line-through' : ''}>
                    {task.label || 'Untitled task'}
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
      )}

      {subModules.length > 0 && (
        <>
          <Separator className="my-5" />
          <div>
            <p className="text-sm font-semibold mb-3">Modules of this project</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {subModules.map((sub) => {
                const subColor = colorMap.get(sub.id) || color;
                return (
                  <div key={sub.id} className="relative overflow-hidden rounded-lg border p-3">
                    <div
                      className="absolute inset-y-0 left-0 w-1"
                      style={{ background: `linear-gradient(180deg, ${subColor[0]}, ${subColor[1]})` }}
                    />
                    <div className="pl-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{sub.title}</p>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                          style={{ background: `linear-gradient(135deg, ${subColor[0]}, ${subColor[1]})` }}
                        >
                          {statusLabel(sub.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1">
                          <GradientProgress value={sub.progress} from={subColor[0]} to={subColor[1]} />
                        </div>
                        <span className="text-xs font-bold tabular-nums" style={{ color: subColor[0] }}>
                          {sub.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {});
  }, []);

  const colorMap = new Map<string, [string, string]>();
  projects.forEach((p, i) => colorMap.set(p.id, getBrandColor(i)));

  const staging = projects.filter(p => p.status === 'STAGING').length;
  const developing = projects.filter(p => p.status === 'DEVELOPING').length;
  const pending = projects.filter(p => p.status === 'PENDING').length;
  const overall = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="mx-auto max-w-[1220px] px-6 py-8">
      <header className="mb-10 text-center" aria-label="Dashboard header">
        <Badge variant="secondary" className="mb-3">Shared dashboard</Badge>
        <h1 className="text-3xl font-bold tracking-tight">What we are building</h1>
        <p className="mt-2 text-muted-foreground">
          Every automation system being delivered to Kulhudhuffushi City Council — what it does, where it stands, and why it matters.
        </p>
        <Link
          href="/timeline"
          className="mt-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Delivery Timeline
        </Link>
      </header>

      {projects.length > 0 && (
        <div className="mb-10 space-y-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold tracking-tight">{overall}%</p>
              </div>
              <p className="text-sm text-muted-foreground">{staging + developing} active</p>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${overall}%`,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-3xl font-bold">{projects.length}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-emerald-500">{staging}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Staging</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-blue-500">{developing}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Developing</p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">{pending}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending</p>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-xl bg-destructive/8 p-6 text-center text-destructive" role="status">
          <p>No projects yet. Add a project from the settings page.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const [from, to] = getBrandColor(i);
            return (
              <Card
                key={project.id}
                className="group relative cursor-pointer overflow-hidden border-0 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => { setSelected(project); setSelectedIndex(i); }}
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

                  <p className="mt-3 text-xs text-muted-foreground">
                    {project.launchDate ? `Launch ${formatDate(project.launchDate)}` : `${formatDate(project.startDate)} \u2192 ${formatDate(project.endDate)}`}
                  </p>

                </CardContent>
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${from}cc, ${to}cc)`, backdropFilter: 'blur(2px)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  <span className="text-sm font-medium text-white">Click to explore</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] w-[95vw] max-w-[900px] overflow-y-auto p-6">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <ProjectDetail project={selected} color={getBrandColor(selectedIndex)} allProjects={projects} colorMap={colorMap} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
