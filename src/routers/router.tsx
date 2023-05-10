import App from '../pages/app/App'
import TaskDetail from '../pages/TaskDetail/TaskDetail'
import {
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "../errors/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/task-detail/:id",
    element: <TaskDetail />,
  },

]);

export default router