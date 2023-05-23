import './Task.css'
import { useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import InputTask from '../InputTask/InputTask';
import ContextMenu from '../Common/ContextMenuDropdown';
import { useAppDispatch } from '../../redux/hooks';
import { changeStatusTask, deleteTask, deleteTaskAsync, editTask, updateTaskAsync, addToMyDay, addToImportant } from '../../redux/task/tasksSlice';
import { TaskModel } from '../../types/Task';


type TypeProps = {
  id: number;
  _id: string;
  taskContent: string;
  completed: boolean;
  currentChose: (id: number) => void;
  isMyDay: boolean;
  isImportant: boolean;
  isSelected?: boolean;
  isMustDone?: boolean;
}
export default function Task({ taskContent, completed, _id, id, currentChose, isSelected, isMustDone, isMyDay, isImportant }: TypeProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null)
  const [isChecked, setIsChecked] = useState<boolean>(completed);
  const [isHovering, setHover] = useState<boolean>(false)
  const [isEdit, setEdit] = useState<boolean>(false)
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const dispatch = useAppDispatch()

  const onChangeStatus = (id: number, _id: string, status: boolean) => {
    if (!isLoggedIn) {
      dispatch(changeStatusTask({ id, status }))
    } else {
      dispatch(updateTaskAsync({ completed: status } as TaskModel, _id))
    }
  };
  const onClickDelete = (id: number, _id: string) => {
    if (isLoggedIn) {
      dispatch(deleteTaskAsync(_id))
    } else {
      dispatch(deleteTask(id))
    }
  }
  const onClickEdit = (id: number, _id: string, taskName: string) => {
    if (isLoggedIn) {
      dispatch(updateTaskAsync({ content: taskName } as TaskModel, _id))
    } else {
      dispatch(editTask({ id, content: taskName }))
    }
  }
  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    onChangeStatus(id, _id, newStatus)
    setIsChecked(newStatus)
  }
  const handleDeleteTask = () => {
    onClickDelete(id, _id)
  }
  const handleEditTask = () => {
    setEdit(true)
  }
  const handleBlur = (taskName: string) => {
    setEdit(false)
    onClickEdit(id, _id, taskName)
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
  const addMyDay = (status: boolean) => {
    let task = { id: +id, isMyDay: status }
    if (isLoggedIn) {
      dispatch(updateTaskAsync(task as TaskModel, _id))
    } else {
      dispatch(addToMyDay(task))
    }
  }
  const addImportant = (status: boolean) => {
    let task = { id: +id, isImportant: status }
    if (isLoggedIn) {
      dispatch(updateTaskAsync(task as TaskModel, _id))
    } else {
      dispatch(addToImportant(task))
    }
  }
  if (!isEdit) {
    return (
      <div className='task-container'>
        <div className="overlay" onClick={handleCloseContextMenu} />
        <div
          className={`task ${isChecked ? 'completed' : ''} ${isSelected ? 'isSelected' : ''} `}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onDoubleClick={handleEditTask}
          onContextMenu={handleRightClick}
          onClick={handleCloseContextMenu}
          style={{ backgroundColor }}
        >
          {menuPosition && isSelected && <ContextMenu x={menuPosition.x} y={menuPosition.y} id={id} addToMyDay={addMyDay} addToImportant={addImportant} isMyDay={isMyDay} isImportant={isImportant} />}
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