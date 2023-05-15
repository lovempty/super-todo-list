import { useState, useCallback } from "react";
import "./App.css";
import Task from "../../components/Task/Task.tsx";
import InputTask from "../../components/InputTask/InputTask.tsx";
import { TaskModel } from "../../types/Task.tsx";
import Collapse from "../../components/Common/Collapse";
import { useAppSelector, useAppDispatch } from "../../redux/hooks.ts";
import { changeStatusTask, deleteTask, editTask } from "../../redux/task/tasksSlice.tsx";

function App() {
  const tasks = useAppSelector(state => state.tasks.tasks)
  const [currentChose, setCurrentChose] = useState<number>()
  const dispatch = useAppDispatch()
  const numberCompleted = useCallback(
    () => tasks.filter((task: TaskModel) => task.completed).length,
    [tasks]
  );


  const onChangeStatus = (id: number) => (status: boolean) => {
    dispatch(changeStatusTask({ id, status }))
  };

  const onClickDelete = (id: number) => () => {
    dispatch(deleteTask(id))
  }

  const onClickEdit = (id: number) => (taskName: string) => {
    dispatch(editTask({ id, taskName }))
  }

  const TaskRender = (task: TaskModel, isMustDone: boolean = false) => (
    <Task
      id={task.id}
      key={task.id}
      taskContent={task.content}
      completed={task.completed}
      changeStatus={onChangeStatus(task.id)}
      onClickDelete={onClickDelete(task.id)}
      onClickEdit={onClickEdit(task.id)}
      currentChose={(id: number) => setCurrentChose(id)}
      isSelected={currentChose === task.id}
      isMustDone={isMustDone}
    />
  )


  const objectTaskByDate = tasks
    .filter((task: TaskModel) => !task.completed && !(task.dueDate === new Date().toLocaleDateString('en-CA')))
    .reduce((acc: {
      [key: string]: TaskModel[],
    }, task) => {
      // Extract the date from the task's created property
      const date = task.created_at + '';

      // If the date hasn't been seen before, create a new array for it
      if (!acc[date]) {
        acc[date] = [];
      }

      // Add the task to the array for this date
      acc[date].push(task);

      return acc;
    }, {})

  const renderListTasks = Object.keys(objectTaskByDate).map((key) => {
    return (
      <div key={key}>
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
        <>{renderListTasks}</>
        <Collapse
          content={<>{renderCompletedListTasks}</>}
          total={numberCompleted()}
          label="Completed"
          type="complete"
        />
      </div>
      <div className="footer">
        <InputTask taskName="" autofocus={false} />
      </div>
    </>
  );
}
export default App;
