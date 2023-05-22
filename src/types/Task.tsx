export type TaskModel = {
  _id?: string,
  id: number;
  content: string;
  completed: boolean;
  taskDetail?: string;
  isMyDay?: boolean;
  isImportant?: boolean;
  dueDate?: string;
  created_at?: string;
  updated_at?: string | null;
  user_id?: string | null;
}