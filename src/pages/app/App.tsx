import { useState, useCallback } from "react";
import "./App.css";
import Task from "../../components/Task/Task.tsx";
import { TaskModel } from "../../types/Task.tsx";
import Collapse from "../../components/Common/Collapse";
import { useAppSelector } from "../../redux/hooks.ts";
import { sortTasksByDate } from "../../utils/index.tsx";
function App() {
  const tasks = useAppSelector(state => state.tasks.tasks)
  const [currentChose, setCurrentChose] = useState<number>()
  const numberCompleted = useCallback(
    () => tasks.filter((task: TaskModel) => task.completed).length,
    [tasks]
  );
  const TaskRender = (task: TaskModel, isMustDone: boolean = false) => (
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
      isMustDone={isMustDone}
    />
  )


  const { objectTaskByDate, sortedTasksByDate } = sortTasksByDate(tasks)

  const renderListTasks = Object.keys(sortedTasksByDate).map((key, index) => {
    return (
      <div key={index}>
        <div className="date-created">{key}</div>
        {objectTaskByDate[key].map((task: TaskModel) => {
          return TaskRender(task)
        })}
      </div>
    );
  })

  const mustDoneTodayTasks = tasks.filter((task: TaskModel) => {
    if (task.dueDate) {
      return task.dueDate === new Date().toLocaleDateString('en-CA') && !task.completed
    }
  }).map((task) => {
    return TaskRender(task, true)
  })
  const totalMustDone = tasks.filter((task: TaskModel) => {
    if (task.dueDate) {
      return task.dueDate === new Date().toLocaleDateString('en-CA') && !task.completed
    }
  }).length

  const renderCompletedListTasks = tasks
    .filter((task: TaskModel) => task.completed)
    .map((task) => {
      return TaskRender(task)
    })


  return (
    <>
      <div className="tasks">
        <Collapse
          content={<>{mustDoneTodayTasks}</>}
          total={totalMustDone}
          label="Must-done today"
          type="must-done"
        />
        <div className="mb">{renderListTasks}</div>
        <Collapse
          content={<>{renderCompletedListTasks}</>}
          total={numberCompleted()}
          label="Completed"
          type="complete"
        />
      </div>
    </>
  );
}
export default App;
