export type TaskModel = {
  id: number;
  content: string;
  completed: boolean;
  taskDetail?: string;
  dueDate?: string;
  created_at: string;
  updated_at?: string | null;
}