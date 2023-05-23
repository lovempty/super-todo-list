import { useEffect, useState } from "react"
import { TaskModel } from "../../types/Task";
import { getTasksFirebase } from "../../redux/task/tasksSlice";
import { useAppSelector } from "../../redux/hooks";
import Task from "../../components/Task/Task";
import { sortTasksByDate } from "../../utils";
import './Important.css'

export default function Important() {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const [importantTasks, setImportantTasks] = useState<TaskModel[]>()
  const [currentChose, setCurrentChose] = useState<number>()
  const [renderMyDayListTasks, setRenderMyDayListTasks] = useState<JSX.Element[]>()
  const tasks = useAppSelector(state => state.tasks.tasks)
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        try {
          const response = await getTasksFirebase('isImportant')
          setImportantTasks(response)
        } catch (error) {

        }
      } else {
        // setimportantTasks(getimportantTasks(tasks))
      }
    })()
  }, [tasks])
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
    if (importantTasks) {
      const { objectTaskByDate, sortedTasksByDate } = sortTasksByDate(importantTasks)
      setRenderMyDayListTasks(Object.keys(sortedTasksByDate).map((key, index) => {
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
  }, [importantTasks])

  return (
    <div className="my-day">
      {renderMyDayListTasks}
    </div>
  )
}