import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Weather from "../../Weather/Weather";
import Time from "../../Time/Time";
import Quote from "../../Quote/Quote";
import AuthDetail from "../../../pages/Authentication/AuthDetail";

type Props = {
  setBackground: (img: string) => void
}

export default function Header({ setBackground }: Props) {
  const navigate = useNavigate();
  return (
    <div >
      <div className="header">
        <div>
          <div className="heading logo" onClick={() => navigate('/')}>Today is a great day to work</div>
          {/* <Weather setBackground={setBackground} /> */}
        </div>
        <Quote />
        <div className="right-content">
          <AuthDetail />
        </div>
      </div>
    </div>
  )
}