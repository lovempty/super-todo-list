import { useEffect, useState } from "react";
import './Time.css'
export default function Time() {
  const getDate = () => {
    const date = new Date();
    return {
      hour: date.getHours(),
      minute: date.getMinutes()
    }
  }

  const initialDate = getDate()
  const [hour, setHour] = useState<number>(initialDate.hour)
  const [minute, setMinute] = useState<number>(initialDate.minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getDate()
      setHour(newDate.hour);
      setMinute(newDate.minute);
    }, 60000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="time">
      {`${hour}:${minute && minute < 10 ? '0' : ''}${minute}`}
    </div>
  )
}