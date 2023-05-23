import { useEffect, useState } from "react"
import { TaskModel } from "../../types/Task";
import { getTasksFirebase } from "../../redux/task/tasksSlice";
import Task from "../../components/Task/Task";
import { sortTasksByDate } from "../../utils";
import './MyDay.css'

export default function MyDay() {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const [myDayTasks, setMyDayTasks] = useState<TaskModel[]>()
  const [currentChose, setCurrentChose] = useState<number>()
  const [renderMyDayListTasks, setRenderMyDayListTasks] = useState<JSX.Element[]>()
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        try {
          const response = await getTasksFirebase('isMyDay')
          setMyDayTasks(response)
        } catch (error) {

        }
      } else {
        // setMyDayTasks(getMyDayTasks(tasks))
      }
    })()
  }, [])
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
    if (myDayTasks) {
      const { objectTaskByDate, sortedTasksByDate } = sortTasksByDate(myDayTasks)

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
  }, [myDayTasks])

  return (
    <div className="my-day">
      {renderMyDayListTasks}
    </div>
  )
}