import { useState } from 'react'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import './Login.css'
import notify from "../../components/Common/Notify";
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        notify({ type: 'success', message: 'Sign up successfully!' })
        navigate('/login')
      }).catch(error => {
        notify({ type: 'error', message: 'Sign up failed!' })
        console.error(error)
      })
  }
  return (
    <div className="login-container">
      <div className="login">
        <form action="" onSubmit={signIn} className='form-login' autoComplete='off'>
          <h2 className='title'>Sign up</h2>
          <input type="email" value={email} placeholder="Enter your email" onChange={onChangeEmail} autoComplete="off" />
          <input type="password" value={password} placeholder="Enter your password" onChange={onChangePassword} className='mt mb' autoComplete="off" />
          <button type='submit' >Sign up</button>
        </form>
      </div>
    </div>
  )
}