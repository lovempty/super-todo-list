import { useState } from 'react'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from '@firebase/auth'
import './Login.css'
import notify from "../../components/Common/Notify";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }
  const signIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        notify({ type: 'success', message: 'Sign in successfully!' })
        navigate('/')
        localStorage.setItem('isLoggedIn', 'true')
      }).catch(error => {
        notify({ type: 'error', message: 'Sign in failed!' })
        console.error(error)
      })
  }
  return (
    <div className="login-container">
      <div className="login">
        <form action="" onSubmit={signIn} className='form-login'>
          <h2 className='title'>Sign in</h2>
          <input type="email" value={email} placeholder="Enter your email" onChange={onChangeEmail} />
          <input type="password" value={password} placeholder="Enter your password" onChange={onChangePassword} className='mt mb' />
          <button type='submit' >Log In</button>
          <div className='register-container'>Don't have an account? <span className='register' onClick={() => navigate('/sign-up')}>Register one</span> </div>
        </form>
      </div>
    </div>
  )
}