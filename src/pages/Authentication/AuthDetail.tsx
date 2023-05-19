import { onAuthStateChanged, signOut } from "@firebase/auth";
import { useEffect, useState } from "react"
import { auth } from '../../firebase'
import './AuthDetail.css'
import { useNavigate } from 'react-router-dom';
import notify from "../../components/Common/Notify";
import { useMatch } from 'react-router-dom';
import { useAppDispatch } from "../../redux/hooks";
import { fetchTasksAsync, initData } from "../../redux/task/tasksSlice";

const AuthDetail = () => {
  const [authUser, setAuthUser] = useState<any>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
  const dispatch = useAppDispatch()
  // const [inSignIn, setInSignIn] = useState<boolean>(false)
  let inSignIn: boolean = false;
  const match = useMatch('/:path');
  if (match) {
    const { params: { path } } = match;
    if (path === 'login') {
      inSignIn = true
    }
  }

  const navigate = useNavigate()

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && isLoggedIn) {
        localStorage.setItem('uid', user.uid)
        setAuthUser(user)
        setVisible(false)
        dispatch(fetchTasksAsync())
      } else {
        setAuthUser(null)
        dispatch(initData())
        localStorage.removeItem('uid')
      }
    })
    return unsubscribe
  }, [match, authUser])

  const handleLogout = () => {
    if (visible) {
      signOut(auth).then(() => {
        notify({ type: 'success', message: 'Sign out successfully!' })
        navigate('/login')
        localStorage.setItem('isLoggedIn', 'false')

      }).catch(error => {
        notify({ type: 'error', message: 'Sign out failed!' })
        console.error(error)
      })
    }
  }

  const handleClick = () => {
    if (authUser) {
      handleLogout()
    } else {
      navigate('/login')
    }
  }
  const divLogout = <div style={{ color: 'red' }}>Logout</div>
  const NameDisplay = () => (
    <div className="name-display" >
      {
        (authUser ? (visible ? divLogout : authUser.email) : 'Sign in')
      }
    </div>
  )

  return (
    <>
      {!inSignIn && <div className="auth-container" onClick={handleClick}>
        <div onMouseOver={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="auth-detail">
          <NameDisplay />
        </div>
      </div>}
      {!isLoggedIn && <div style={{ fontSize: '16px', color: 'white' }}>*You are using this app as a <span style={{ color: 'rgb(24 255 7)', fontWeight: '600' }}>Guest</span> </div>}
    </>
  )
}

export default AuthDetail