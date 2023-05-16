import { onAuthStateChanged, signOut } from "@firebase/auth";
import { useEffect, useState } from "react"
import { auth } from '../../firebase'
import './AuthDetail.css'
import { useNavigate } from 'react-router-dom';
import notify from "../../components/Common/Notify";


const AuthDetail = () => {
  const [authUser, setAuthUser] = useState<any>(null)
  const [visible, setVisible] = useState<boolean>(false)

  const navigate = useNavigate()
  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log({ isLoggedIn });

      if (user && isLoggedIn) {
        console.log(user);
        setAuthUser(user)
      } else {
        setAuthUser(null)
      }
    })
    return unsubscribe
  }, [])

  const handleLogout = () => {
    if (visible) {
      signOut(auth).then(() => {
        console.log('sign out successful');
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

  const NameDisplay = () => (
    <div className="name-display" onClick={handleClick}>
      {authUser ? (visible ? 'Logout' : authUser.email) : 'Sign in for data storage'}
    </div>
  )

  return (
    <>
      <div className="auth-container">
        <div onMouseOver={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="auth-detail">
          <NameDisplay />
        </div>
      </div>
    </>
  )
}

export default AuthDetail