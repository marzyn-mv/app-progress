"use client";

import { useEffect, useState } from 'react';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Project } from '@/lib/types';

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusVariant = (status: Project['status']) => {
  switch (status) {
    case 'STAGING':
      return 'default' as const;
    case 'DEVELOPING':
      return 'secondary' as const;
    case 'PENDING':
      return 'outline' as const;
  }
};

export default function DashboardPage() {
  const [published, setPublished] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/publish')
      .then((res) => res.json())
      .then((data) => {
        if (data?.project) setPublished(data.project);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1220px] px-6 py-8">
      <header className="mb-8 text-center" aria-label="Dashboard header">
        <Badge variant="secondary" className="mb-3">
          Shared dashboard
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">What we are building</h1>
        <p className="mt-2 text-muted-foreground">
          Every automation system being delivered to Kulhudhuffushi City Council — what it does, where it stands, and why it matters.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card aria-label="Published project">
          <CardHeader>
            <CardTitle>Published project</CardTitle>
            {published && (
              <CardAction>
                <span
                  className="text-2xl font-bold tabular-nums text-primary"
                  aria-label={`${published.progress}% complete`}
                >
                  {published.progress}%
                </span>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            {published ? (
              <>
                <Badge variant={statusVariant(published.status)} className="mb-4">
                  {published.status}
                </Badge>

                <h3 className="text-xl font-semibold">{published.title}</h3>

                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatDate(published.startDate)} → {formatDate(published.endDate)}</span>
                  <span className="font-medium text-primary">Launch {formatDate(published.launchDate)}</span>
                </div>

                <p className="mt-4 leading-7 text-foreground/80">{published.description}</p>

                <div
                  className="mt-4"
                  role="status"
                  aria-label={`Progress: ${published.progress}%`}
                >
                  <Progress value={published.progress} aria-label="Project progress">
                    <ProgressLabel>Progress</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="mt-4 rounded-xl bg-indigo-500/8 p-4">
                  <p className="font-semibold">Why this matters:</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                    {published.why}
                  </p>
                </div>

                {(published.actionPoints?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Actions</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {published.actionPoints.map((ap) => (
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

                {((published.phase1?.tasks.length ?? 0) > 0 ||
                  (published.phase2?.tasks.length ?? 0) > 0) && (
                  <Separator className="my-4" />
                )}

                {(published.phase1?.tasks.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Phase 1</p>
                    <ul className="mt-2 space-y-2">
                      {published.phase1.tasks.map((task) => (
                        <li key={task.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={`size-4 shrink-0 rounded-full border ${
                                task.done
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-muted-foreground/40'
                              }`}
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
                              <span>{formatDate(task.startDate)} → {formatDate(task.endDate)}</span>
                            )}
                            {task.remarks && <span className="italic">{task.remarks}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(published.phase1?.tasks.length ?? 0) > 0 &&
                  (published.phase2?.tasks.length ?? 0) > 0 && (
                  <Separator className="my-4" />
                )}

                {(published.phase2?.tasks.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Phase 2</p>
                    <ul className="mt-2 space-y-2">
                      {published.phase2.tasks.map((task) => (
                        <li key={task.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={`size-4 shrink-0 rounded-full border ${
                                task.done
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-muted-foreground/40'
                              }`}
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
                              <span>{formatDate(task.startDate)} → {formatDate(task.endDate)}</span>
                            )}
                            {task.remarks && <span className="italic">{task.remarks}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div
                className="rounded-xl bg-destructive/8 p-6 text-center text-destructive"
                role="status"
                aria-label="No published project"
              >
                <p>
                  No project has been published yet. Publish a project from the editor to make it
                  visible here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
