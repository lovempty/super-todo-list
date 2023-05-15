import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editTask, getTaskById } from '../../redux/task/tasksSlice';
import './TaskDetail.css'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function TaskDetail() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>('');
  const [taskDetail, setTaskDetail] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>();
  const tasks = useAppSelector(state => state.tasks.tasks)
  const dispatch = useAppDispatch()
  const notify = () => toast.success("Updated task!", { autoClose: 2000 });
  useEffect(() => {
    if (id) {
      const task = getTaskById(tasks, +id)
      setTitle(task?.content || '')
      setTaskDetail(task?.taskDetail || '')
      setDueDate(task?.dueDate)
    }
  }, [id])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskDetail(e.target.value);
  };
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = id && dispatch(editTask({ id: +id, taskName: title, taskDetail: taskDetail, dueDate }))
    notify()
  };

  return (
    <div className="TaskDetail">
      <form onSubmit={handleSubmit} className='form-task'>
        <label htmlFor="">Title</label>
        <input type="text" value={title} onChange={handleInputChange} className='input-form' placeholder='Title' />
        <label htmlFor="" className='mt'>Task Detail</label>
        <textarea value={taskDetail} onChange={handleTextareaChange} className='input-form' placeholder='Detail task' />
        <label htmlFor="" className='mt'>Due date</label>
        <input type="date" value={dueDate} onChange={handleDueDateChange} className='input-form mb' placeholder='Due date' min={new Date().toLocaleDateString('en-CA')} />
        <button className='mt'>Submit</button>
      </form>
      <ToastContainer theme='dark' />
    </div>
  )
}