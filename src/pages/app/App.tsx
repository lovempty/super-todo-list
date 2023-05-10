import { useEffect, useState, useCallback } from "react";
import "./App.css";
import Task from "../../components/Task/Task.tsx";
import InputTask from "../../components/InputTask/InputTask.tsx";
import { TaskModel } from "../../types/Task.tsx";
import Collapse from "../../components/Common/Collapse";
import Quote from "../../components/Quote/Quote.tsx";
import Time from "../../components/Time/Time.tsx";
import Weather from "../../components/Weather/Weather.tsx";

function generateUniqueId(array: { id: number }[]): number {
  let newId = Math.floor(Math.random() * 1000000); // generate a random number
  while (array.some((item) => item.id === newId)) {
    // check if the number already exists in the array
    newId = Math.floor(Math.random() * 1000000); // generate a new random number if it already exists
  }
  return newId; // return the unique ID
}

function App() {
  const [todayTime, setTime] = useState("");
  const [listTasks, setListTasks] = useState<TaskModel[]>([]);
  const [backgroundImg, setBackgroundImg] = useState<string>('')
  const submitTask = (taskName: string): void => {
    const newTask = {
      id: generateUniqueId(listTasks),
      content: taskName,
      completed: false,
    };
    setListTasks((listTasks) => [newTask, ...listTasks]);
    localStorage.setItem("listTasks", JSON.stringify([...listTasks, newTask]));
  };

  useEffect(() => {
    const today = new Date();
    setTime(today.toDateString());
    const getListTasks = JSON.parse(localStorage.getItem("listTasks") || "[]");
    setListTasks(getListTasks);
  }, []);
  const numberCompleted = useCallback(
    () => listTasks.filter((task: TaskModel) => task.completed).length,
    [listTasks]
  );

  const onChangeStatus = (id: number) => (status: boolean) => {
    const targetTask = listTasks.find((task) => task.id === id);
    if (targetTask) {
      targetTask.completed = status;
    }
    setListTasks([...listTasks])
    localStorage.setItem("listTasks", JSON.stringify([...listTasks]));
  };

  const onClickDelete = (id: number) => () => {
    const newListTask = listTasks.filter((task: TaskModel) => task.id !== id)
    setListTasks(newListTask);
    localStorage.setItem("listTasks", JSON.stringify([...newListTask]));
  }
  const onClickEdit = (id: number) => (taskName: string) => {
    const targetTask = listTasks.find((task) => task.id === id);
    if (targetTask) {
      targetTask.content = taskName
    }
    setListTasks([...listTasks])
    localStorage.setItem("listTasks", JSON.stringify([...listTasks]));
  }

  const renderListTasks = listTasks
    .filter((task: TaskModel) => !task.completed)
    .map((task) => {
      return (
        <Task
          key={task.id}
          taskContent={task.content}
          completed={task.completed}
          changeStatus={onChangeStatus(task.id)}
          onClickDelete={onClickDelete(task.id)}
          onClickEdit={onClickEdit(task.id)}
        />
      );
    })

  const renderCompletedListTasks = listTasks
    .filter((task: TaskModel) => task.completed)
    .map((task) => {
      return (
        <Task
          key={task.id}
          taskContent={task.content}
          completed={task.completed}
          changeStatus={onChangeStatus(task.id)}
          onClickDelete={onClickDelete(task.id)}
          onClickEdit={onClickEdit(task.id)}
        />
      );
    })

  const setBackground = (img: string) => {
    setBackgroundImg(img)
    console.log(img);

  }

  return (
    <div className="app" style={{ backgroundImage: `url(./public/assets/${backgroundImg}.jpg)` }}>
      <div className="header">
        <div>
          <div className="heading">Today is a great day to work</div>
          <div className="time">{todayTime} - <Time /></div>
          <Weather setBackground={setBackground} />
        </div>
        <div>
          <Quote />
        </div>
      </div>
      <div className="tasks">
        {renderListTasks}
        <Collapse
          content={<>{renderCompletedListTasks}</>}
          total={numberCompleted()}
        />
      </div>
      <div className="footer">
        <InputTask submitTask={submitTask} taskName="" autofocus={false} />
      </div>
    </div>
  );
}
export default App;
