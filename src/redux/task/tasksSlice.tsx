import { AnyAction, PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { TaskModel } from '../../types/Task'
import { RootState } from '../store';
import { ThunkAction } from 'redux-thunk'
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import db from "../../firebase"
import notify from '../../components/Common/Notify';

const COLLECTION_NAME = 'tasks'
// Define the initial state
interface TasksState {
  tasks: TaskModel[];
}
const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
const initialState: TasksState = {
  tasks: !isLoggedIn ? JSON.parse(localStorage.getItem("listTasks") || "[]") : []
}
const updateLocalStorageTask = (tasks: TaskModel[]) => {
  localStorage.setItem("listTasks", JSON.stringify(tasks));
}



export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTask: (state, action: PayloadAction<TaskModel[]>) => {
      state.tasks = action.payload
    },
    addTask: (state, action: PayloadAction<TaskModel>) => {
      state.tasks.push(action.payload)
      !isLoggedIn && updateLocalStorageTask(state.tasks)
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
    editTask: (state, action: PayloadAction<{ id: number; content: string; taskDetail?: string; dueDate?: string }>) => {
      const targetTask = state.tasks.find((task) => task.id === action.payload.id);
      if (targetTask) {
        targetTask.content = action.payload.content
        targetTask.taskDetail = action.payload.taskDetail
        targetTask.dueDate = action.payload.dueDate
      }
      updateLocalStorageTask(state.tasks)
      notify({ type: 'success', message: 'Updated task successfully!' })
    },
  },
})

export const getTaskById = (tasks: TaskModel[], taskId: number) => {
  // Find the task in the state array that has the same id as the taskId parameter
  const task = tasks.find((task: TaskModel) => task.id === taskId);
  // Return the task if it exists, or null if it doesn't
  return task ? task : null;
};

export const getTaskFireBaseById = async (id: number) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("id", "==", id))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs && { ...querySnapshot.docs[0].data(), _id: querySnapshot.docs[0].id } as TaskModel
  } catch (error) {
    console.error(error)
  }
}

export const fetchTasksAsync = (): AppThunk => async dispatch => {
  const user_id = localStorage.getItem('uid')
  if (user_id) {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("user_id", "==", user_id))
      const querySnapshot = await getDocs(q);
      const tasks: TaskModel[] = []
      querySnapshot.forEach((doc) => {
        tasks.push({ ...doc.data(), _id: doc.id } as TaskModel)
      });
      dispatch(fetchTask(tasks))
    } catch (error) {
      console.error(error)
    }
  }
}

export const addTaskAsync = (task: TaskModel): AppThunk => async dispatch => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), task);
    dispatch(fetchTasksAsync())
    dispatch(addTask(task))

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const updateTaskAsync = (task: TaskModel, _id: string): AppThunk => async dispatch => {
  try {
    const washingtonRef = doc(db, COLLECTION_NAME, _id ?? '');
    await updateDoc(washingtonRef, task);
    notify({ type: 'success', message: 'Updated task successfully!' })
    dispatch(fetchTasksAsync())
  } catch (e) {
    console.error("Error updating document: ", e);
    notify({ type: 'error', message: 'Updated task failed!' })
  }
}

export const deleteTaskAsync = (id: string): AppThunk => async dispatch => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    dispatch(fetchTasksAsync())
    notify({ type: 'success', message: 'Deleted task successfully!' })
  } catch (error) {
    console.error(error)
    notify({ type: 'error', message: 'Deleted task failed!' })
  }
}

export const { addTask, changeStatusTask, deleteTask, editTask, fetchTask } = tasksSlice.actions

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>

export default tasksSlice.reducer

