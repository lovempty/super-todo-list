import App from '../pages/app/App'
import TaskDetail from '../pages/TaskDetail/TaskDetail'
import {
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "../errors/error-page";
import AppLayout from '../layouts/AppLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "/task-detail/:id",
        element: <TaskDetail />,
      },
    ]
  },


]);

export default router