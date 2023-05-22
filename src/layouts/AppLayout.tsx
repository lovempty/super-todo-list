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
  const pathsNoSidebar = ['/login', 'sign-up']

  const isAllowToDisplay = !pathsNoSidebar.includes(location.pathname)

  const [backgroundImg, setBackgroundImg] = useState<string>('')
  const setBackground = (img: string) => {
    setBackgroundImg(img)
  }
  return (
    <div className="app-layout" style={{ backgroundImage: `url(../public/assets/no-sun.jpg)` }}>
      <Header setBackground={setBackground} />
      <div className={isAllowToDisplay ? 'sidebar-layout' : ''}>
        {isAllowToDisplay && <SideBar />}
        <Outlet />
      </div>
      {isAllowToDisplay && <div className="footer">
        <InputTask taskName="" autofocus={false} />
      </div>}
      <ToastContainer position="top-center" theme="dark" />
    </div>
  )
}