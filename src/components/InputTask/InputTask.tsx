import { useState } from 'react'
import './InputTask.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTask, addTaskAsync } from '../../redux/task/tasksSlice';
import { TaskModel } from '../../types/Task';
type InputTaskProps = {
  taskName: string;
  autofocus: boolean;
  handleBlur?: (taskName: string) => void;
  isEdit?: boolean;
}

function generateUniqueId(array: { id: number }[]): number {
  let newId = Math.floor(Math.random() * 1000000); // generate a random number
  while (array.some((item) => item.id === newId)) {
    // check if the number already exists in the array
    newId = Math.floor(Math.random() * 1000000); // generate a new random number if it already exists
  }
  return newId; // return the unique ID
}

export default function InputTask({ taskName, autofocus, handleBlur, isEdit }: InputTaskProps): JSX.Element {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const tasks = useAppSelector(state => state.tasks.tasks)
  const dispatch = useAppDispatch()
  const [task, setTask] = useState<string>(taskName)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value)
  }
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const newTask: TaskModel = {
        id: generateUniqueId(tasks),
        content: task,
        completed: false,
        created_at: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        user_id: localStorage.getItem('uid'),
        dueDate: ''
      };
      if (isLoggedIn) {
        dispatch(addTaskAsync(newTask))
      } else {
        dispatch(addTask(newTask))
      }
      { !isEdit && setTask('') }
      (event.target as HTMLInputElement).blur();
    }
  }

  return (
    <div className="input-task">
      <input
        type="text"
        value={task}
        onBlur={() =>
          handleBlur && handleBlur(task)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='Add task here...'
        autoFocus={autofocus} />
    </div>
  )
}