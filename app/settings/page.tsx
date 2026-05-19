"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DEPARTMENTS_KEY = 'kcc-departments';
const DEFAULT_DEPARTMENTS = ['IT', 'Finance', 'HR', 'Legal', 'Operations'];

export default function SettingsPage() {
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);
  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(DEPARTMENTS_KEY);
    if (stored) {
      setDepartments(JSON.parse(stored));
    }
  }, []);

  const save = (next: string[]) => {
    setDepartments(next);
    window.localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(next));
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
    <div className="mx-auto max-w-[1220px] px-6 py-8">
      <header className="mb-8 text-center" aria-label="Settings header">
        <Badge variant="secondary" className="mb-3">
          Configuration
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the departments available for project assignment.
        </p>
      </header>

      <div className="mx-auto max-w-lg">
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
      </div>
    </div>
  );
}
