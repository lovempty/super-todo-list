import './Task.css'
import { useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import InputTask from '../InputTask/InputTask';
import ContextMenu from '../Common/ContextMenuDropdown';


type TypeProps = {
  id: number;
  _id: string;
  taskContent: string;
  completed: boolean;
  changeStatus: (status: boolean) => void;
  onClickDelete: () => void;
  onClickEdit: (taskName: string) => void;
  currentChose: (id: number) => void;
  isSelected?: boolean;
  isMustDone?: boolean;
}
export default function Task({ taskContent, completed, changeStatus, onClickDelete, onClickEdit, _id, id, currentChose, isSelected, isMustDone }: TypeProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null)
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
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    currentChose(id)
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY });

  }
  const handleCloseContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {

    if (event.button !== 2) {
      currentChose(0)
      setMenuPosition(null)
    }
  }
  const backgroundColor = isMustDone ? '#e5baba' : 'whitesmoke'
  if (!isEdit) {
    return (
      <div className='task-container'>
        <div className="overlay" onClick={handleCloseContextMenu} />
        <div
          className={`task ${isChecked ? 'completed' : ''} ${isSelected ? 'isSelected' : ''}`}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onDoubleClick={handleEditTask}
          onContextMenu={handleRightClick}
          onClick={handleCloseContextMenu}
          style={{ backgroundColor }}
        >
          {menuPosition && isSelected && <ContextMenu x={menuPosition.x} y={menuPosition.y} id={id} />}
          <input type="checkbox" onChange={handleChangeStatus} checked={isChecked} />
          <div>{taskContent}</div>
          {isHovering && <div className="actions">
            <FaTrashAlt className='delete-icon' onClick={handleDeleteTask} />
          </div>}
        </div>
      </div>
    )
  } else {
    return <div className="task-edit">
      <InputTask taskName={taskContent} autofocus={true} handleBlur={(task) => handleBlur(task)} isEdit={isEdit} _id={_id} />
    </div>
  }
}