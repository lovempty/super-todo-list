import Progress from "@ramonak/react-progress-bar";
import { useState, useEffect } from 'react'
import { useAppSelector } from "../../../redux/hooks";
import './ProgressBar.css'
import { TaskModel } from "../../../types/Task";
import { useLocation } from "react-router";

export default function ProgressBar() {
  const [completed, setCompleted] = useState<number>(0)
  const [tasksUsed, setTasksUsed] = useState<TaskModel[]>()
  const tasks = useAppSelector(state => state.tasks.tasks)
  const location = useLocation()
  useEffect(() => {
    calcTasksUsed()

  }, [tasks])
  useEffect(() => {
    calcCompleted()
  }, [tasksUsed])
  const calcTasksUsed = () => {
    if (location.pathname === '/') {
      setTasksUsed(tasks)
    } else if (location.pathname === '/my-day') {
      setTasksUsed(tasks.filter(task => task.isMyDay))
    } else if (location.pathname === '/important') {
      setTasksUsed(tasks.filter(task => task.isImportant))
    }
  }
  const calcCompleted = () => {
    if (tasksUsed) {
      const totalTask = tasksUsed.length
      const totalComplete = tasksUsed.filter(task => task.completed).length
      setCompleted((totalComplete / totalTask) * 100)
    }
  }
  return (
    <div>
      <div className="task-progress">Tasks Progress</div>
      <Progress completed={completed} bgColor="rgb(17 171 219)" />
    </div>
  )
}