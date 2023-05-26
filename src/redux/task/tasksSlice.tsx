import { AnyAction, PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { TaskModel } from '../../types/Task'
import { RootState } from '../store';
import { ThunkAction } from 'redux-thunk'
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, orderBy, limit, writeBatch } from "firebase/firestore";
import db from "../../firebase"
import notify from '../../components/Common/Notify';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

// Create a root reference
const storage = getStorage();

const COLLECTION_NAME = 'tasks'
// Define the initial state
interface TasksState {
  tasks: TaskModel[];
}

const initialState: TasksState = {
  tasks: []
}
const updateLocalStorageTask = (tasks: TaskModel[]) => {
  localStorage.setItem("listTasks", JSON.stringify(tasks));
}



export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initData: (state) => {
      state.tasks = JSON.parse(localStorage.getItem("listTasks") || "[]")
    },
    fetchTask: (state, action: PayloadAction<TaskModel[]>) => {
      state.tasks = action.payload
    },
    addTask: (state, action: PayloadAction<TaskModel>) => {
      let isLogin = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
      state.tasks.push(action.payload)
      if (!isLogin) {
        updateLocalStorageTask(state.tasks)
      }

    },
    changeStatusTask: (state, action: PayloadAction<{ id: number; status: boolean; }>) => {
      const targetTask = state.tasks.find((task) => task.id === action.payload.id);
      if (targetTask) {
        targetTask.completed = action.payload.status;
      }
      updateLocalStorageTask(state.tasks)
    },
    addToMyDay: (state, action: PayloadAction<{ id: number; isMyDay: boolean; }>) => {
      const targetTask = state.tasks.find((task) => task.id === action.payload.id);
      if (targetTask) {
        targetTask.isMyDay = action.payload.isMyDay;
      }
      updateLocalStorageTask(state.tasks)
    },
    addToImportant: (state, action: PayloadAction<{ id: number; isImportant: boolean; }>) => {
      const targetTask = state.tasks.find((task) => task.id === action.payload.id);
      if (targetTask) {
        targetTask.isImportant = action.payload.isImportant;
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
export const getMyDayTasks = (tasks: TaskModel[]) => {
  const task = tasks.filter((task: TaskModel) => task.isMyDay);
  return task ? task : null;
};
export const getTasksFirebase = async (type: 'isMyDay' | 'isImportant') => {
  let userId = localStorage.getItem('uid')
  try {
    const q = query(collection(db, COLLECTION_NAME), where(type, "==", true), where("user_id", "==", userId))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs && querySnapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }) as TaskModel)
  } catch (error) {
    console.error(error)
  }
};
export const getTasksFirebaseByTitle = async (title: string) => {
  let userId = localStorage.getItem('uid')
  try {
    const q = query(collection(db, COLLECTION_NAME), where("content", ">=", title)
      , where('content', '<=', title + '\uf8ff'),
      where("user_id", "==", userId))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs && querySnapshot.docs.map(doc => doc.data() as TaskModel)
  } catch (error) {
    console.error(error)
  }
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
      tasks.sort((a, b) => {
        if (a.index !== undefined && b.index !== undefined) {
          return a.index - b.index
        }
        return 0
      })
      dispatch(fetchTask(tasks))
    } catch (error) {
      console.error(error)
    }
  }
}

export const addTaskAsync = (task: TaskModel): AppThunk => async dispatch => {
  try {
    const tasksRef = collection(db, COLLECTION_NAME)
    const q = query(tasksRef, orderBy("index", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    let newIndex = 0
    if (!querySnapshot.empty) {
      const latestTask = querySnapshot.docs[0].data()
      newIndex = latestTask.index + 1;
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), { index: newIndex, ...task } as TaskModel);
    dispatch(fetchTasksAsync())
    dispatch(addTask(task))
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const updateIndexTask = (newIndex: number, currentIndex: number): AppThunk => async (dispatch, getState) => {
  let tasks = [...getState().tasks.tasks]

  const currentTask = tasks.find(task => task.index === currentIndex)
  tasks.splice(currentIndex, 1);
  currentTask && tasks.splice(newIndex, 0, currentTask);
  const newTasks = tasks.map((task, index) => ({ ...task, index }))
  const batch = writeBatch(db);
  newTasks.forEach(task => {
    const taskRef = doc(db, COLLECTION_NAME, task._id || '')
    batch.update(taskRef, { "index": task.index })
  })
  await batch.commit();
  dispatch(fetchTasksAsync())
}

export const updateTaskAsync = (task: TaskModel, _id: string, fileAttach?: File): AppThunk => async dispatch => {
  try {
    let fileURL = '';
    if (fileAttach) {
      const storageRef = ref(storage, fileAttach.name);
      await uploadBytes(storageRef, fileAttach);
      fileURL = await getDownloadURL(storageRef);
    }
    const washingtonRef = doc(db, COLLECTION_NAME, _id ?? '');
    if (fileURL) {
      await updateDoc(washingtonRef, { ...task, fileAttach: fileURL });
    } else {
      await updateDoc(washingtonRef, task);
    }
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

export const { addTask, changeStatusTask, deleteTask, editTask, fetchTask, initData, addToMyDay, addToImportant } = tasksSlice.actions

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>

export default tasksSlice.reducer

