import './Task.css'
import { useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import InputTask from '../InputTask/InputTask';
type TypeProps = {
  taskContent: string;
  completed: boolean;
  changeStatus: (status: boolean) => void;
  onClickDelete: () => void;
  onClickEdit: (taskName: string) => void;
}
export default function Task({ taskContent, completed, changeStatus, onClickDelete, onClickEdit }: TypeProps) {
  const [isChecked, setIsChecked] = useState<boolean>(completed);
  const [isHovering, setHover] = useState<boolean>(false)
  const [isEdit, setEdit] = useState<boolean>(false)

  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    changeStatus(newStatus)
    setIsChecked(newStatus)
  }
  const handleDeleteTask = () => {
    onClickDelete()
  }
  const handleEditTask = () => {
    setEdit(true)
  }
  const handleBlur = (taskName: string) => {
    setEdit(false)
    onClickEdit(taskName)
  }

  if (!isEdit) {
    return (
      <div className={`task ${isChecked ? 'completed' : ''}`} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} onDoubleClick={handleEditTask}>
        <input type="checkbox" onChange={handleChangeStatus} checked={isChecked} />
        <div>{taskContent}</div>
        {isHovering && <div className="actions">
          <FaTrashAlt className='delete-icon' onClick={handleDeleteTask} />
        </div>}
      </div>
    )
  } else {
    return <div className="task-edit">
      <InputTask submitTask={(task) => onClickEdit(task)} taskName={taskContent} autofocus={true} handleBlur={(task) => handleBlur(task)} isEdit={isEdit} />
    </div>
  }

}