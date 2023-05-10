import { useState } from 'react'
import './InputTask.css'
type InputTaskProps = {
  submitTask: (taskName: string) => void;
  taskName: string;
  autofocus: boolean;
  handleBlur?: (taskName: string) => void;
  isEdit?: boolean;
}
export default function InputTask({ submitTask, taskName, autofocus, handleBlur, isEdit }: InputTaskProps): JSX.Element {
  const [task, setTask] = useState<string>(taskName)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value)
  }
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      submitTask(task)
      { !isEdit && setTask('') }
      (event.target as HTMLInputElement).blur();
    }
  }
  return (
    <div className="input-task">
      <input type="text" value={task} onBlur={() => handleBlur && handleBlur(task)} onChange={handleChange} onKeyDown={handleKeyDown} placeholder='Add task here...' autoFocus={autofocus} />
    </div>
  )
}