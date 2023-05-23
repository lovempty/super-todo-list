import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editTask, getTaskById, getTaskFireBaseById, updateTaskAsync } from '../../redux/task/tasksSlice';
import './TaskDetail.css'
import { useEffect, useState } from 'react';
import { TaskModel } from '../../types/Task';
import { FaFile } from 'react-icons/fa';

export default function TaskDetail() {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const { id } = useParams();
  const [title, setTitle] = useState<string>('');
  const [taskDetail, setTaskDetail] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>();

  const [_id, set_id] = useState<string>('')
  const tasks = useAppSelector(state => state.tasks.tasks)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [task, setTask] = useState<TaskModel | null | undefined>()

  useEffect(() => {
    (async () => {
      if (id) {
        if (isLoggedIn) {
          setTask(await getTaskFireBaseById(+id))
        } else {
          setTask(getTaskById(tasks, +id))
        }
      }
    })()
  }, [id, tasks])
  useEffect(() => {
    setTitle(task?.content || '')
    setTaskDetail(task?.taskDetail || '')
    setDueDate(task?.dueDate || '')
    setCompleted(task?.completed || false)
    set_id(task?._id || '')
  }, [task])
  const extractFileName = (fullPath: string): string => {
    const fileName = fullPath.split('/').pop()?.split('?')[0] ?? '';
    return fileName;
  }
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
        if (file) {
          dispatch(updateTaskAsync(task, _id, file))
        } else {
          dispatch(updateTaskAsync(task, _id))
        }
        navigate('/')
      } else {
        dispatch(editTask(task))
        navigate('/')
      }
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };
  return (
    <div className="TaskDetail">
      <form onSubmit={handleSubmit} className='form-task'>
        <label htmlFor="">Title</label>
        <input type="text" value={title} onChange={handleInputChange} className='input-form' placeholder='Title' />
        <label htmlFor="" className='mt'>Task Detail</label>
        <textarea value={taskDetail} onChange={handleTextareaChange} className='input-form' placeholder='Detail task' />
        <label htmlFor="" className='mt'>Due date</label>
        <input type="date" value={dueDate} onChange={handleDueDateChange} className='input-form mb' placeholder='Due date' min={new Date().toLocaleDateString('en-CA')} disabled={task?.completed} />
        <label htmlFor="">Attach files</label>
        {task?.fileAttach && <div className="file-selected">
          <div className='file' onClick={() => window.open(task?.fileAttach, '_blank')}><FaFile className="icon-file" />  {extractFileName(task?.fileAttach)}</div>
        </div>}
        <input type="file" className='mb' onChange={handleFileChange} />
        <div className='button-groups' ><button onClick={() => navigate('/')}>Back</button><button className='button-submit'>Submit</button></div>
      </form>
    </div>
  )
}