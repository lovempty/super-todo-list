import App from '../pages/app/App'
import TaskDetail from '../pages/TaskDetail/TaskDetail'
import ErrorPage from "../errors/error-page";
import AppLayout from '../layouts/AppLayout';
import { Login } from '../pages/Authentication/Login';
import { SignUp } from '../pages/Authentication/SignUp';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MyDay from '../pages/MyDay/MyDay';
import Important from '../pages/Important/Important';
import SearchTask from '../pages/SearchTask/SearchTask';


// Custom Route component
type AuthenticatedRouteProps = {
  element: React.ReactNode;
}


const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ element }) => {
  const navigate = useNavigate();
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn])
  return <>{element}</>
}
const CheckLogin: React.FC<AuthenticatedRouteProps> = ({ element }) => {
  const navigate = useNavigate();
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn])
  return <>{element}</>
}

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
        path: "/my-day",
        element: <MyDay />,
      },
      {
        path: "/search",
        element: <SearchTask />,
      },
      {
        path: "/important",
        element: <Important />,
      },
      {
        path: "/task-detail/:id",
        element: <TaskDetail />,
        // element: <AuthenticatedRoute element={<TaskDetail />} />,
      },
      {
        path: "/login",
        element: <CheckLogin element={<Login />} />,
      },
      {
        path: "/sign-up",
        element: <CheckLogin element={<SignUp />} />,
      },
    ]
  },
]);

export default router