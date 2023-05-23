import { useEffect, useState } from "react";
import { getTasksFirebaseByTitle } from "../../redux/task/tasksSlice";
import { TaskModel } from "../../types/Task";
import Task from "../../components/Task/Task";
import { sortAllTasksByDate } from "../../utils";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import './SearchTask.css'

export default function SearchTask() {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const [currentChose, setCurrentChose] = useState<number>()
  const [searchTasks, setSearchTasks] = useState<TaskModel[]>()
  const [renderSearchTasks, setRenderSearchTasks] = useState<JSX.Element | JSX.Element[]>()
  const [loading, setLoading] = useState<boolean>(true)
  let [searchParams] = useSearchParams();
  let keySearch = searchParams.get('keyword')
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        try {
          const response = await getTasksFirebaseByTitle(keySearch || '')
          setLoading(false)
          setSearchTasks(response)
        } catch (error) {
          console.error(error)
          setLoading(false)
        }
      } else {
        // setimportantTasks(getimportantTasks(tasks))
      }
    })()
  }, [keySearch])
  const TaskRender = (task: TaskModel) => (
    <Task
      _id={task._id || ''}
      id={task.id}
      key={task.id}
      taskContent={task.content}
      completed={task.completed}
      currentChose={(id: number) => setCurrentChose(id)}
      isSelected={currentChose === task.id}
      isMyDay={task?.isMyDay || false}
      isImportant={task?.isImportant || false}
    />
  )
  useEffect(() => {
    if (searchTasks) {
      const { objectTaskByDate, sortedTasksByDate } = sortAllTasksByDate(searchTasks)
      setRenderSearchTasks(Object.keys(sortedTasksByDate).map((key, index) => {
        return (
          <div key={index}>
            <div className="date-created">{key}</div>
            {objectTaskByDate[key].map((task: TaskModel) => {
              return TaskRender(task)
            })}
          </div>
        );
      }))
    }
  }, [searchTasks, loading])
  if (loading) {
    return (
      <div className='loading'>
        Loading...
      </div>
    )
  }
  return (
    <div className="search-task">
      {renderSearchTasks}
    </div>
  )
}