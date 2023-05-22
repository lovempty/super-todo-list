import { TaskModel } from "../types/Task";

export const sortTasksByDate = (tasks: TaskModel[]) => {
  const objectTaskByDate = tasks
    .filter((task: TaskModel) => !task.completed && !(task.dueDate === new Date().toLocaleDateString('en-CA')))
    .reduce((acc: {
      [key: string]: TaskModel[],
    }, task) => {
      const date = task.created_at + '';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {})
  const sortedObjectTaskByDate = Object.keys(objectTaskByDate).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/');
    const [dayB, monthB, yearB] = b.split('/');
    return new Date(`${yearB}-${monthB}-${dayB}`).getTime() - new Date(`${yearA}-${monthA}-${dayA}`).getTime()
  });
  const sortedTasksByDate: { [key: string]: TaskModel[] } = {};
  sortedObjectTaskByDate.forEach(date => {
    sortedTasksByDate[date] = objectTaskByDate[date];
  });
  return { objectTaskByDate, sortedTasksByDate }
}