import { AnyAction, PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { TaskModel } from '../../types/Task'
import { RootState } from '../store';
import { ThunkAction } from 'redux-thunk'

// Define the initial state
interface TasksState {
  tasks: TaskModel[];
}
const initialState: TasksState = {
  tasks: JSON.parse(localStorage.getItem("listTasks") || "[]")
}
const updateLocalStorageTask = (tasks: TaskModel[]) => {
  localStorage.setItem("listTasks", JSON.stringify(tasks));
}



export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskModel>) => {
      state.tasks.push(action.payload)
      updateLocalStorageTask(state.tasks)
    },
    changeStatusTask: (state, action: PayloadAction<{ id: number; status: boolean; }>) => {
      const targetTask = state.tasks.find((task) => task.id === action.payload.id);
      if (targetTask) {
        targetTask.completed = action.payload.status;
      }
      updateLocalStorageTask(state.tasks)
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task: TaskModel) => task.id !== action.payload)
      updateLocalStorageTask(state.tasks)
    },
    editTask: (state, action: PayloadAction<{ id: number; taskName: string; taskDetail?: string; dueDate?: string }>) => {
      const targetTask = state.tasks.find((task) => task.id === action.payload.id);
      if (targetTask) {
        targetTask.content = action.payload.taskName
        targetTask.taskDetail = action.payload.taskDetail
        targetTask.dueDate = action.payload.dueDate
      }
      updateLocalStorageTask(state.tasks)
    }
  }
})

export const getTaskById = (tasks: TaskModel[], taskId: number) => {
  // Find the task in the state array that has the same id as the taskId parameter
  const task = tasks.find((task) => task.id === taskId);
  // Return the task if it exists, or null if it doesn't
  return task ? task : null;
};

export const addTaskAsync = (task: TaskModel): AppThunk => async dispatch => {
  dispatch(addTask(task))
}

export const { addTask, changeStatusTask, deleteTask, editTask } = tasksSlice.actions

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>

export default tasksSlice.reducer