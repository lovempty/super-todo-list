import { Outlet } from "react-router-dom";
import './AppLayout.css'
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import Header from "../components/Common/Header/Header";
import SideBar from "../components/Common/SideBar/SideBar";
import InputTask from "../components/InputTask/InputTask";
import { useLocation } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();
  const pathsNoSidebar = ['/login', 'sign-up', 'task-detail']
  const allowToDisplay = pathsNoSidebar.filter(path => location.pathname.includes(path))
  const [backgroundImg, setBackgroundImg] = useState<string>('')
  const setBackground = (img: string) => {
    setBackgroundImg(img)
  }
  return (
    <div className="app-layout" style={{ backgroundImage: `url(../public/assets/no-sun.jpg)` }}>
      <Header setBackground={setBackground} />
      <div className={!allowToDisplay.length ? 'sidebar-layout' : ''}>
        {!allowToDisplay.length && <SideBar />}
        <Outlet />
      </div>
      {!allowToDisplay.length && <div className="footer">
        <InputTask taskName="" autofocus={false} />
      </div>}
      <ToastContainer position="top-center" theme="dark" />
    </div>
  )
}