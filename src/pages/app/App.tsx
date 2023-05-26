import { useState, useCallback } from "react";
import "./App.css";
import Task from "../../components/Task/Task.tsx";
import { TaskModel } from "../../types/Task.tsx";
import Collapse from "../../components/Common/Collapse";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.ts";
import { sortTasksByDate } from "../../utils/index.tsx";
import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { updateIndexTask, updateTaskAsync } from "../../redux/task/tasksSlice.tsx";

function App() {
  const tasks = useAppSelector(state => state.tasks.tasks)
  const [currentChose, setCurrentChose] = useState<number>()
  const dispatch = useAppDispatch()
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
        <Droppable droppableId={`tasks-${key}`}>
          {
            (provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {objectTaskByDate[key].map((task: TaskModel, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={+`${key.replaceAll('/', '')}${task.index}`}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {TaskRender(task)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>

      </div>
    );
  })

  const mustDoneTodayTasks = tasks.filter((task: TaskModel) => {
    if (task.dueDate) {
      return task.dueDate === new Date().toLocaleDateString('en-CA') && !task.completed
    }
  }).map((task) => (
    <Draggable
      key={task.id}
      draggableId={task.id.toString()}
      index={+`${task.index}`}
    >
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {TaskRender(task, true)}
        </div>
      )}
    </Draggable>
  )
  )

  const totalMustDone = tasks.filter((task: TaskModel) => {
    if (task.dueDate) {
      return task.dueDate === new Date().toLocaleDateString('en-CA') && !task.completed
    }
  }).length

  const renderCompletedListTasks = tasks
    .filter((task: TaskModel) => task.completed)
    .map((task) => (
      <Draggable
        key={task.id}
        draggableId={task.id.toString()}
        index={+`${task.index}`}
      >
        {(provided: DraggableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {TaskRender(task)}
          </div>
        )}
      </Draggable>
    )
    )
  const swapTaskData = (sourceTask: TaskModel, desTask: TaskModel) => {
    dispatch(updateTaskAsync({ ...desTask, _id: sourceTask._id }, sourceTask._id || ''))
    dispatch(updateTaskAsync({ ...sourceTask, _id: desTask._id }, desTask._id || ''))
  }
  const onDragEndTasks = (result: any) => {
    // Handle the dropped item here
    if (!result.destination) {
      return; // Dropped outside the list
    }
    // Retrieve the necessary information from the result
    const { source, destination } = result;
    const { indexTask: sourceIndex } = convertIndex(source.index.toString())
    const { indexTask: desIndex } = convertIndex(destination.index.toString())
    dispatch(updateIndexTask(+desIndex, +sourceIndex))
  };
  const onDragEndCompleteTasks = (result: any) => {
    const completedTasks = tasks
      .filter((task: TaskModel) => task.completed)
    // Handle the dropped item here
    if (!result.destination) {
      return; // Dropped outside the list
    }

    // Retrieve the necessary information from the result
    const { source, destination } = result;
    const sourceTask = completedTasks[source.index]
    const desTask = completedTasks[destination.index]
    swapTaskData(sourceTask, desTask)
  };
  const onDragEndMustDoneTasks = (result: any) => {
    const mustDoneTask = tasks.filter((task: TaskModel) => {
      if (task.dueDate) {
        return task.dueDate === new Date().toLocaleDateString('en-CA') && !task.completed
      }
    })
    // Handle the dropped item here
    if (!result.destination) {
      return; // Dropped outside the list
    }

    // Retrieve the necessary information from the result
    const { source, destination } = result;
    const sourceTask = mustDoneTask[source.index]
    const desTask = mustDoneTask[destination.index]
    swapTaskData(sourceTask, desTask)
  };
  const convertIndex = (index: string) => {
    const dateString = index.slice(0, index.length - 1)
    const dateConverted = dateString.substring(0, 2) + '/' + dateString.substring(2, 4) + '/' + dateString.slice(4)
    const indexTask = index.slice(index.length - 1)
    return { dateConverted, indexTask }
  }
  return (

    <div className="tasks">
      <DragDropContext onDragEnd={onDragEndTasks}>
        <Droppable droppableId="must-done-tasks">
          {
            (provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Collapse
                  content={<>{mustDoneTodayTasks}</>}
                  total={totalMustDone}
                  label="Must-done today"
                  type="must-done"
                />
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>

        <div className="mb">{renderListTasks}</div>
        <Droppable droppableId="completed-tasks">
          {
            (provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Collapse
                  content={<>{renderCompletedListTasks}</>}
                  total={numberCompleted()}
                  label="Completed"
                  type="complete"
                />
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>

    </div>
  );
}
export default App;

