import { useState, useCallback, useEffect } from "react";
import "./App.css";
import Task from "../../components/Task/Task.tsx";
import InputTask from "../../components/InputTask/InputTask.tsx";
import { TaskModel } from "../../types/Task.tsx";
import Collapse from "../../components/Common/Collapse";
import { useAppSelector, useAppDispatch } from "../../redux/hooks.ts";
import { changeStatusTask, deleteTask, deleteTaskAsync, editTask, fetchTasksAsync, initData, updateTaskAsync } from "../../redux/task/tasksSlice.tsx";
function App() {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const tasks = useAppSelector(state => state.tasks.tasks)
  const [currentChose, setCurrentChose] = useState<number>()
  const dispatch = useAppDispatch()
  const numberCompleted = useCallback(
    () => tasks.filter((task: TaskModel) => task.completed).length,
    [tasks]
  );


  const onChangeStatus = (id: number, _id: string) => (status: boolean) => {
    if (!isLoggedIn) {
      dispatch(changeStatusTask({ id, status }))
    } else {
      dispatch(updateTaskAsync({ completed: status } as TaskModel, _id))
    }

  };

  const onClickDelete = (id: number, _id: string) => () => {
    if (isLoggedIn) {
      dispatch(deleteTaskAsync(_id))
    } else {
      dispatch(deleteTask(id))
    }

  }

  const onClickEdit = (id: number, _id: string) => (taskName: string) => {
    if (isLoggedIn) {
      dispatch(updateTaskAsync({ content: taskName } as TaskModel, _id))
    } else {
      dispatch(editTask({ id, content: taskName }))
    }

  }

  const TaskRender = (task: TaskModel, isMustDone: boolean = false) => (
    <Task
      _id={task._id || ''}
      id={task.id}
      key={task.id}
      taskContent={task.content}
      completed={task.completed}
      changeStatus={onChangeStatus(task.id, task._id || '')}
      onClickDelete={onClickDelete(task.id, task._id || '')}
      onClickEdit={onClickEdit(task.id, task._id || '')}
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
  const sortedObjectTaskByDate = Object.keys(objectTaskByDate).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/');
    const [dayB, monthB, yearB] = b.split('/');
    return new Date(`${yearB}-${monthB}-${dayB}`).getTime() - new Date(`${yearA}-${monthA}-${dayA}`).getTime()
  });
  const sortedTasksByDate: { [key: string]: TaskModel[] } = {};
  sortedObjectTaskByDate.forEach(date => {
    sortedTasksByDate[date] = objectTaskByDate[date];
  });

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
