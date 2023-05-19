import { useState, useEffect } from "react"
import Time from "../components/Time/Time"
import Weather from "../components/Weather/Weather"
import Quote from "../components/Quote/Quote"
import { Outlet, useNavigate } from "react-router-dom";
import './AppLayout.css'
import 'react-toastify/dist/ReactToastify.css';
import AuthDetail from '../pages/Authentication/AuthDetail'
import { ToastContainer } from 'react-toastify';

export default function AppLayout() {
  const navigate = useNavigate();
  const [todayTime, setTime] = useState("");
  const [backgroundImg, setBackgroundImg] = useState<string>('')
  const setBackground = (img: string) => {
    setBackgroundImg(img)
  }
  useEffect(() => {
    const today = new Date();
    setTime(today.toDateString());
  }, []);
  return (
    <>
      <div className="app-layout" style={{ backgroundImage: `url(../public/assets/${backgroundImg}.jpg)` }}>
        <div className="header">
          <div>
            <div className="heading logo" onClick={() => navigate('/')}>Today is a great day to work</div>
            <div className="time">{todayTime} - <Time /></div>
            <Weather setBackground={setBackground} />
          </div>
          <Quote />
          <div className="right-content">
            <AuthDetail />
          </div>
        </div>
        <Outlet />
      </div>
      <ToastContainer position="top-center" theme="dark" />
    </>
  )
}