import { useState, useEffect } from "react"
import Time from "../components/Time/Time"
import Weather from "../components/Weather/Weather"
import Quote from "../components/Quote/Quote"
import { Outlet } from "react-router-dom";
import './AppLayout.css'
import 'react-toastify/dist/ReactToastify.css';

export default function AppLayout() {
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
            <div className="heading">Today is a great day to work</div>
            <div className="time">{todayTime} - <Time /></div>
            <Weather setBackground={setBackground} />
          </div>
          <div>
            <Quote />
          </div>
        </div>
        <Outlet />
      </div>

    </>
  )
}