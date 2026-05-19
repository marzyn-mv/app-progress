"use client";

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Task, Project } from '@/lib/types';

/* ── Password Gate ── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onUnlock();
      } else {
        setError('Invalid password.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter the password to access settings.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Checking...' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Departments Section ── */

const DEFAULT_DEPARTMENTS = ['IT', 'Finance', 'HR', 'Legal', 'Operations'];

function DepartmentsSection({
  departments,
  onUpdate,
}: {
  departments: string[];
  onUpdate: (next: string[]) => void;
}) {
  const [newDept, setNewDept] = useState('');

  const save = async (next: string[]) => {
    onUpdate(next);
    await fetch('/api/departments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  };

  const handleAdd = () => {
    const trimmed = newDept.trim();
    if (!trimmed) return;
    if (departments.includes(trimmed)) {
      toast.warning('Department already exists.');
      return;
    }
    save([...departments, trimmed]);
    setNewDept('');
    toast.success(`Added "${trimmed}".`);
  };

  const handleRemove = (dept: string) => {
    save(departments.filter((d) => d !== dept));
    toast.success(`Removed "${dept}".`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          className="mb-4 flex gap-2"
        >
          <Input
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            placeholder="New department name"
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>

        {departments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No departments yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {departments.map((dept) => (
              <li
                key={dept}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
              >
                <span className="text-sm">{dept}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(dept)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Editor Section (from original page.tsx) ── */

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const initialProject: Project = {
  id: 'project-1',
  title: 'SSO System',
  status: 'STAGING',
  progress: 95,
  startDate: '2025-02-20',
  endDate: '2025-02-22',
  launchDate: '2026-06-01',
  description:
    'Single Sign-On (SSO) system integrated with eFast for user authentication and authorization. Validates users and employees against the HR system upon login.',
  why:
    'One login for every Council system. Employees stop juggling multiple passwords, IT spends less time on password resets, and access is automatically aligned with each person\'s HR record — improving security, accountability, and the day-one experience for new joiners.',
  actionPoints: [],
  departments: [],
  phase1: {
    tasks: [
      { id: '1', label: 'Requirements gathering', done: true, startDate: '2025-02-20', endDate: '2025-03-01', remarks: 'Completed on schedule', department: '' },
      { id: '2', label: 'UI/UX design', done: true, startDate: '2025-03-02', endDate: '2025-03-15', remarks: '', department: '' },
      { id: '3', label: 'Backend API development', done: true, startDate: '2025-03-16', endDate: '2025-04-30', remarks: '', department: '' },
    ],
  },
  phase2: {
    tasks: [
      { id: '4', label: 'Integration testing', done: true, startDate: '2025-05-01', endDate: '2025-05-15', remarks: '', department: '' },
      { id: '5', label: 'User acceptance testing', done: false, startDate: '2025-05-16', endDate: '', remarks: 'In progress', department: '' },
      { id: '6', label: 'Production deployment', done: false, startDate: '', endDate: '', remarks: '', department: '' },
    ],
  },
};

const createNewProject = (): Project => ({
  id: crypto.randomUUID(),
  title: 'New project',
  status: 'PENDING',
  progress: 0,
  startDate: '',
  endDate: '',
  launchDate: '',
  description: 'Describe what this project is for.',
  why: 'Explain why this project matters to the Council.',
  actionPoints: [],
  departments: [],
  phase1: { tasks: [] },
  phase2: { tasks: [] },
});

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

function EditorSection({ departments }: { departments: string[] }) {
  const [projects, setProjects] = useState<Project[]>([initialProject]);
  const [selectedId, setSelectedId] = useState<string>(initialProject.id);
  const [draft, setDraft] = useState<Project>(initialProject);
  const [publishedAt, setPublishedAt] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/publish').then((r) => r.json()),
    ])
      .then(([projectsData, publishData]) => {
        if (Array.isArray(projectsData) && projectsData.length > 0) {
          const parsed = projectsData.map((p: Project) => ({
            ...p,
            actionPoints: (p.actionPoints ?? []).map((ap) => ({ ...ap, department: ap.department ?? '', dueDate: ap.dueDate ?? '' })),
            departments: p.departments ?? [],
            phase1: { tasks: (p.phase1?.tasks ?? []).map((t) => ({ ...t, department: t.department ?? '' })) },
            phase2: { tasks: (p.phase2?.tasks ?? []).map((t) => ({ ...t, department: t.department ?? '' })) },
          }));
          setProjects(parsed);
          setSelectedId(parsed[0].id);
          setDraft(parsed[0]);
        }
        if (publishData?.publishedAt) {
          setPublishedAt(publishData.publishedAt);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectProject = useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);
      if (!project) return;
      setSelectedId(projectId);
      setDraft(project);
      setFormOpen(true);
    },
    [projects]
  );

  const handleChange = (key: keyof Project, value: string) => {
    setDraft((current) => ({
      ...current,
      [key]: key === 'progress' ? Number(value) : value,
    }));
  };

  const handleAddTask = (phase: 'phase1' | 'phase2') => {
    setDraft((current) => ({
      ...current,
      [phase]: {
        tasks: [
          ...current[phase].tasks,
          { id: crypto.randomUUID(), label: '', done: false, startDate: '', endDate: '', remarks: '', department: '' },
        ],
      },
    }));
  };

  const handleUpdateTask = (
    phase: 'phase1' | 'phase2',
    taskId: string,
    updates: Partial<Task>
  ) => {
    setDraft((current) => ({
      ...current,
      [phase]: {
        tasks: current[phase].tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      },
    }));
  };

  const handleRemoveTask = (phase: 'phase1' | 'phase2', taskId: string) => {
    setDraft((current) => ({
      ...current,
      [phase]: {
        tasks: current[phase].tasks.filter((t) => t.id !== taskId),
      },
    }));
  };

  const handleAddActionPoint = () => {
    setDraft((current) => ({
      ...current,
      actionPoints: [
        ...current.actionPoints,
        { id: crypto.randomUUID(), text: '', department: '', dueDate: '' },
      ],
    }));
  };

  const handleUpdateActionPoint = (id: string, text: string) => {
    setDraft((current) => ({
      ...current,
      actionPoints: current.actionPoints.map((ap) =>
        ap.id === id ? { ...ap, text } : ap
      ),
    }));
  };

  const handleRemoveActionPoint = (id: string) => {
    setDraft((current) => ({
      ...current,
      actionPoints: current.actionPoints.filter((ap) => ap.id !== id),
    }));
  };

  const handleCreateProject = () => {
    const newProject = createNewProject();
    setProjects((current) => [newProject, ...current]);
    setSelectedId(newProject.id);
    setDraft(newProject);
    setFormOpen(true);
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
  };

  const handleDuplicateProject = useCallback(
    (projectId: string) => {
      const source = projects.find((p) => p.id === projectId);
      if (!source) return;
      const clone: Project = JSON.parse(JSON.stringify(source));
      clone.id = crypto.randomUUID();
      clone.title = `Copy of ${source.title}`;
      const sourceIndex = projects.findIndex((p) => p.id === projectId);
      setProjects((current) => {
        const next = [...current];
        next.splice(sourceIndex + 1, 0, clone);
        return next;
      });
      setSelectedId(clone.id);
      setDraft(clone);
      setFormOpen(true);
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clone),
      });
      toast.success(`Duplicated "${source.title}".`);
    },
    [projects]
  );

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      if (projects.length <= 1) {
        toast.warning('Cannot delete the last project.');
        return;
      }
      const deletedIndex = projects.findIndex((p) => p.id === projectId);
      const next = projects.filter((p) => p.id !== projectId);
      setProjects(next);
      if (selectedId === projectId) {
        const newIndex = Math.min(deletedIndex, next.length - 1);
        setSelectedId(next[newIndex].id);
        setDraft(next[newIndex]);
      }
      fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      toast.success('Project deleted.');
    },
    [projects, selectedId]
  );

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProjects((current) =>
      current.map((project) => (project.id === draft.id ? draft : project))
    );
    fetch(`/api/projects/${draft.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    setFormOpen(false);
    toast.success('Project saved.');
  };

  const handlePublish = () => {
    setProjects((current) =>
      current.map((project) => (project.id === draft.id ? draft : project))
    );
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    setPublishedAt(timestamp);
    fetch(`/api/projects/${draft.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: draft, publishedAt: timestamp }),
    });
    setFormOpen(false);
    toast.success('Published to the shared dashboard.');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleCreateProject}>
              + New project
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className={project.id === selectedId ? 'bg-muted' : ''}
                >
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell>{project.progress}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" aria-label={`Actions for ${project.title}`} />}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSelectProject(project.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateProject(project.id)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {publishedAt && (
            <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
              Last published: {publishedAt}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[1200px] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">{draft.title || 'New project'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} aria-label="Project editor form">
            {/* ── Basic Info ── */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Project title</Label>
                <Input id="title" value={draft.title} onChange={(e) => handleChange('title', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={draft.status} onValueChange={(val) => handleChange('status', val as string)}>
                    <SelectTrigger id="status" className="w-full" aria-label="Project status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="DEVELOPING">DEVELOPING</SelectItem>
                      <SelectItem value="STAGING">STAGING</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input id="progress" type="number" min={0} max={100} value={draft.progress} onChange={(e) => handleChange('progress', e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Dates ── */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" type="date" value={draft.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" type="date" value={draft.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="launchDate">Launch date</Label>
                <Input id="launchDate" type="date" value={draft.launchDate} onChange={(e) => handleChange('launchDate', e.target.value)} />
              </div>
            </div>

            {/* ── Description & Why ── */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" className="min-h-[100px]" value={draft.description} onChange={(e) => handleChange('description', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="why">Why this matters</Label>
                <Textarea id="why" className="min-h-[100px]" value={draft.why} onChange={(e) => handleChange('why', e.target.value)} />
              </div>
            </div>

            <Separator className="my-5" />

            {/* ── Actions ── */}
            <fieldset className="space-y-3">
              <div className="flex items-center justify-between">
                <legend className="text-sm font-semibold">Actions</legend>
                <Button type="button" variant="outline" size="sm" onClick={handleAddActionPoint}>+ Add action</Button>
              </div>
              {draft.actionPoints.map((ap) => (
                <div key={ap.id} className="grid grid-cols-[1fr_auto] items-start gap-2 rounded-lg border border-border/50 p-3">
                  <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr]">
                    <Input value={ap.text} placeholder="Action" onChange={(e) => handleUpdateActionPoint(ap.id, e.target.value)} />
                    <Select
                      value={ap.department}
                      onValueChange={(val) => setDraft((cur) => ({ ...cur, actionPoints: cur.actionPoints.map((a) => a.id === ap.id ? { ...a, department: val ?? '' } : a) }))}
                    >
                      <SelectTrigger className="w-full" aria-label="Department"><SelectValue placeholder="Department" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={ap.dueDate}
                      onChange={(e) => setDraft((cur) => ({ ...cur, actionPoints: cur.actionPoints.map((a) => a.id === ap.id ? { ...a, dueDate: e.target.value } : a) }))}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => handleRemoveActionPoint(ap.id)} aria-label="Remove action">✕</Button>
                </div>
              ))}
            </fieldset>

            <Separator className="my-5" />

            {/* ── Phases side by side ── */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Phase 1 */}
              <fieldset className="space-y-3">
                <div className="flex items-center justify-between">
                  <legend className="text-sm font-semibold">Phase 1</legend>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddTask('phase1')}>+ Add task</Button>
                </div>
                {draft.phase1.tasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-border/50 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={(e) => handleUpdateTask('phase1', task.id, { done: e.target.checked })}
                        className="size-4 shrink-0 rounded border-input accent-primary"
                        aria-label={`Mark "${task.label || 'task'}" as done`}
                      />
                      <Input value={task.label} placeholder="Task description" onChange={(e) => handleUpdateTask('phase1', task.id, { label: e.target.value })} className="flex-1" />
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => handleRemoveTask('phase1', task.id)} aria-label="Remove task">✕</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <Input type="date" value={task.startDate} onChange={(e) => handleUpdateTask('phase1', task.id, { startDate: e.target.value })} />
                      <Input type="date" value={task.endDate} onChange={(e) => handleUpdateTask('phase1', task.id, { endDate: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <Input value={task.remarks} placeholder="Remarks" onChange={(e) => handleUpdateTask('phase1', task.id, { remarks: e.target.value })} />
                      <Select value={task.department ?? ''} onValueChange={(val) => handleUpdateTask('phase1', task.id, { department: val ?? '' })}>
                        <SelectTrigger className="w-full" aria-label="Department"><SelectValue placeholder="Department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </fieldset>

              {/* Phase 2 */}
              <fieldset className="space-y-3">
                <div className="flex items-center justify-between">
                  <legend className="text-sm font-semibold">Phase 2</legend>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddTask('phase2')}>+ Add task</Button>
                </div>
                {draft.phase2.tasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-border/50 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={(e) => handleUpdateTask('phase2', task.id, { done: e.target.checked })}
                        className="size-4 shrink-0 rounded border-input accent-primary"
                        aria-label={`Mark "${task.label || 'task'}" as done`}
                      />
                      <Input value={task.label} placeholder="Task description" onChange={(e) => handleUpdateTask('phase2', task.id, { label: e.target.value })} className="flex-1" />
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => handleRemoveTask('phase2', task.id)} aria-label="Remove task">✕</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <Input type="date" value={task.startDate} onChange={(e) => handleUpdateTask('phase2', task.id, { startDate: e.target.value })} />
                      <Input type="date" value={task.endDate} onChange={(e) => handleUpdateTask('phase2', task.id, { endDate: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <Input value={task.remarks} placeholder="Remarks" onChange={(e) => handleUpdateTask('phase2', task.id, { remarks: e.target.value })} />
                      <Select value={task.department ?? ''} onValueChange={(val) => handleUpdateTask('phase2', task.id, { department: val ?? '' })}>
                        <SelectTrigger className="w-full" aria-label="Department"><SelectValue placeholder="Department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </fieldset>
            </div>

            {/* ── Save / Publish buttons ── */}
            <div className="mt-6 flex gap-3 border-t border-border/50 pt-4">
              <Button type="submit">Save draft</Button>
              <Button type="button" variant="secondary" onClick={handlePublish}>Publish to dashboard</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Main Settings Page ── */

export default function SettingsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);

  useEffect(() => {
    if (!unlocked) return;
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch(() => {});
  }, [unlocked]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="mx-auto max-w-[1220px] px-6 py-8">
      <header className="mb-8 text-center" aria-label="Settings header">
        <Badge variant="secondary" className="mb-3">
          Settings
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Editor & Configuration</h1>
        <p className="mt-2 text-muted-foreground">
          Manage projects and departments from this page.
        </p>
      </header>

      <EditorSection departments={departments} />

      <Separator className="my-8" />

      <div className="mx-auto max-w-lg">
        <DepartmentsSection departments={departments} onUpdate={setDepartments} />
      </div>
    </div>
  );
}
