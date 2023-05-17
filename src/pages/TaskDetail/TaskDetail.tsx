import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editTask, getTaskById, getTaskFireBaseById, updateTaskAsync } from '../../redux/task/tasksSlice';
import './TaskDetail.css'
import { useEffect, useState } from 'react';
import notify from '../../components/Common/Notify';
import { TaskModel } from '../../types/Task';

export default function TaskDetail() {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const { id } = useParams();
  const [title, setTitle] = useState<string>('');
  const [taskDetail, setTaskDetail] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [_id, set_id] = useState<string>('')
  const tasks = useAppSelector(state => state.tasks.tasks)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    (async () => {
      if (id) {
        let task: TaskModel | null | undefined;
        if (isLoggedIn) {
          task = await getTaskFireBaseById(+id)
        } else {
          task = getTaskById(tasks, +id)
        }
        console.log('task', task);

        setTitle(task?.content || '')
        setTaskDetail(task?.taskDetail || '')
        setDueDate(task?.dueDate || '')
        setCompleted(task?.completed || false)
        set_id(task?._id || '')
      }
    })()
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
    if (id) {
      let task: TaskModel = { id: +id, content: title, taskDetail: taskDetail, dueDate, completed }
      if (isLoggedIn) {
        task = { ...task, _id }
        dispatch(updateTaskAsync(task))
        navigate('/')
      } else {
        dispatch(editTask(task))
        notify({ type: 'success', message: 'Updated task successfully!' })
        navigate('/')
      }
    }
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
        <div className='button-groups' ><button onClick={() => navigate('/')}>Back</button><button className='button-submit'>Submit</button></div>
      </form>
    </div>
  )
}