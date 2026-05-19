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
      toast.info('Editing selected project.');
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
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
    toast.success('New project created. Start editing its details below.');
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
    toast.success('Project saved. Publish when ready.');
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
    toast.success('Published to the shared dashboard.');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Edit project</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Project selector */}
          <div className="mb-5">
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
          </div>

          <Separator className="mb-5" />

          {/* Form */}
          <form onSubmit={handleSave} aria-label="Project editor form">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project title</Label>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={draft.status}
                  onValueChange={(val) => handleChange('status', val as string)}
                >
                  <SelectTrigger id="status" className="w-full" aria-label="Project status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DEVELOPING">DEVELOPING</SelectItem>
                    <SelectItem value="STAGING">STAGING</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min={0}
                  max={100}
                  value={draft.progress}
                  onChange={(e) => handleChange('progress', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={draft.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="launchDate">Launch date</Label>
                  <Input
                    id="launchDate"
                    type="date"
                    value={draft.launchDate}
                    onChange={(e) => handleChange('launchDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[120px]"
                  value={draft.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="why">Why this matters</Label>
                <Textarea
                  id="why"
                  className="min-h-[120px]"
                  value={draft.why}
                  onChange={(e) => handleChange('why', e.target.value)}
                />
              </div>

              {/* Actions */}
              <Separator />
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold">Actions</legend>
                {draft.actionPoints.map((ap) => (
                  <div key={ap.id} className="rounded-lg border border-border/50 p-3 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Action</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={ap.text}
                          placeholder="Action"
                          onChange={(e) => handleUpdateActionPoint(ap.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveActionPoint(ap.id)}
                          aria-label="Remove action"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <Select
                          value={ap.department}
                          onValueChange={(val) =>
                            setDraft((cur) => ({
                              ...cur,
                              actionPoints: cur.actionPoints.map((a) =>
                                a.id === ap.id ? { ...a, department: val ?? '' } : a
                              ),
                            }))
                          }
                        >
                          <SelectTrigger className="w-full" aria-label="Action department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {departments.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Due date</Label>
                        <Input
                          type="date"
                          value={ap.dueDate}
                          onChange={(e) =>
                            setDraft((cur) => ({
                              ...cur,
                              actionPoints: cur.actionPoints.map((a) =>
                                a.id === ap.id ? { ...a, dueDate: e.target.value } : a
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddActionPoint}
                >
                  + Add action
                </Button>
              </fieldset>

              {/* Phase 1 */}
              <Separator />
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold">Phase 1</legend>
                {draft.phase1.tasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-border/50 p-3 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Task</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={(e) =>
                            handleUpdateTask('phase1', task.id, { done: e.target.checked })
                          }
                          className="size-4 shrink-0 rounded border-input accent-primary"
                          aria-label={`Mark "${task.label || 'task'}" as done`}
                        />
                        <Input
                          value={task.label}
                          placeholder="Task description"
                          onChange={(e) =>
                            handleUpdateTask('phase1', task.id, { label: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveTask('phase1', task.id)}
                          aria-label={`Remove task "${task.label || 'task'}"`}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Start date</Label>
                        <Input
                          type="date"
                          value={task.startDate}
                          onChange={(e) =>
                            handleUpdateTask('phase1', task.id, { startDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">End date</Label>
                        <Input
                          type="date"
                          value={task.endDate}
                          onChange={(e) =>
                            handleUpdateTask('phase1', task.id, { endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="pl-6 space-y-1">
                      <Label className="text-xs text-muted-foreground">Remarks</Label>
                      <Input
                        value={task.remarks}
                        placeholder="Optional remarks"
                        onChange={(e) =>
                          handleUpdateTask('phase1', task.id, { remarks: e.target.value })
                        }
                      />
                    </div>
                    <div className="pl-6 space-y-1">
                      <Label className="text-xs text-muted-foreground">Department</Label>
                      <Select
                        value={task.department ?? ''}
                        onValueChange={(val) =>
                          handleUpdateTask('phase1', task.id, { department: val ?? '' })
                        }
                      >
                        <SelectTrigger className="w-full" aria-label="Task department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {departments.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTask('phase1')}
                >
                  + Add task
                </Button>
              </fieldset>

              {/* Phase 2 */}
              <Separator />
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold">Phase 2</legend>
                {draft.phase2.tasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-border/50 p-3 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Task</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={(e) =>
                            handleUpdateTask('phase2', task.id, { done: e.target.checked })
                          }
                          className="size-4 shrink-0 rounded border-input accent-primary"
                          aria-label={`Mark "${task.label || 'task'}" as done`}
                        />
                        <Input
                          value={task.label}
                          placeholder="Task description"
                          onChange={(e) =>
                            handleUpdateTask('phase2', task.id, { label: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveTask('phase2', task.id)}
                          aria-label={`Remove task "${task.label || 'task'}"`}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-6">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Start date</Label>
                        <Input
                          type="date"
                          value={task.startDate}
                          onChange={(e) =>
                            handleUpdateTask('phase2', task.id, { startDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">End date</Label>
                        <Input
                          type="date"
                          value={task.endDate}
                          onChange={(e) =>
                            handleUpdateTask('phase2', task.id, { endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="pl-6 space-y-1">
                      <Label className="text-xs text-muted-foreground">Remarks</Label>
                      <Input
                        value={task.remarks}
                        placeholder="Optional remarks"
                        onChange={(e) =>
                          handleUpdateTask('phase2', task.id, { remarks: e.target.value })
                        }
                      />
                    </div>
                    <div className="pl-6 space-y-1">
                      <Label className="text-xs text-muted-foreground">Department</Label>
                      <Select
                        value={task.department ?? ''}
                        onValueChange={(val) =>
                          handleUpdateTask('phase2', task.id, { department: val ?? '' })
                        }
                      >
                        <SelectTrigger className="w-full" aria-label="Task department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {departments.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTask('phase2')}
                >
                  + Add task
                </Button>
              </fieldset>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="submit">Save draft</Button>
              <Button type="button" variant="secondary" onClick={handlePublish}>
                Publish to dashboard
              </Button>
            </div>
          </form>

          {publishedAt && (
            <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
              Last published: {publishedAt}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card aria-label="Project preview">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={statusVariant(draft.status)} className="mb-4">
            {draft.status}
          </Badge>

          <h3 className="text-xl font-semibold">{draft.title}</h3>

          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(draft.startDate)} → {formatDate(draft.endDate)} · Launch {formatDate(draft.launchDate)}
          </p>

          <p className="mt-4 leading-7 text-foreground/80">{draft.description}</p>

          <div className="mt-4" role="status" aria-label={`Progress: ${draft.progress}%`}>
            <Progress value={draft.progress} aria-label="Project progress">
              <ProgressLabel>Progress</ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>

          <div className="mt-4 rounded-xl bg-indigo-500/8 p-4">
            <p className="font-semibold">Why this matters:</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">{draft.why}</p>
          </div>

          {draft.actionPoints.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Actions</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {draft.actionPoints.map((ap) => (
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

          {(draft.phase1.tasks.length > 0 || draft.phase2.tasks.length > 0) && (
            <Separator className="my-4" />
          )}

          {draft.phase1.tasks.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Phase 1</p>
              <ul className="mt-2 space-y-2">
                {draft.phase1.tasks.map((task) => (
                  <li key={task.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`size-4 shrink-0 rounded-full border ${task.done ? 'border-green-500 bg-green-500' : 'border-muted-foreground/40'}`} />
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

          {draft.phase1.tasks.length > 0 && draft.phase2.tasks.length > 0 && (
            <Separator className="my-4" />
          )}

          {draft.phase2.tasks.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Phase 2</p>
              <ul className="mt-2 space-y-2">
                {draft.phase2.tasks.map((task) => (
                  <li key={task.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`size-4 shrink-0 rounded-full border ${task.done ? 'border-green-500 bg-green-500' : 'border-muted-foreground/40'}`} />
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
        </CardContent>
      </Card>
    </div>
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
