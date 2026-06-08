export type Task = {
  id: string;
  label: string;
  done: boolean;
  startDate: string;
  endDate: string;
  remarks: string;
  department: string;
};

export type Phase = {
  tasks: Task[];
};

export type ActionPoint = {
  id: string;
  text: string;
  department: string;
  dueDate: string;
};

export type ParentProject = {
  id: string;
  title: string;
};

export type Project = {
  id: string;
  title: string;
  status: "PENDING" | "DEVELOPING" | "STAGING" | "DEPLOYED";
  progress: number;
  startDate: string;
  endDate: string;
  launchDate: string;
  description: string;
  why: string;
  actionPoints: ActionPoint[];
  departments: string[];
  parentId: string;
  phase1: Phase;
  phase2: Phase;
};
