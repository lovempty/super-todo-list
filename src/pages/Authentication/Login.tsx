import { useState } from 'react'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from '@firebase/auth'
import './Login.css'
import notify from "../../components/Common/Notify";
import { useNavigate } from 'react-router-dom';
import { object, string, ObjectSchema } from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface FormValues {
  username: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate()
  const validationSchema: ObjectSchema<FormValues> = object({
    username: string().required('Email is required'),
    password: string().required('Password is required')
  });
  const initialValues: FormValues = {
    username: '',
    password: '',
  };
  const signIn = (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {

    signInWithEmailAndPassword(auth, values.username, values.password)
      .then((userCredential) => {
        notify({ type: 'success', message: 'Sign in successfully!' })
        navigate('/')
        localStorage.setItem('isLoggedIn', 'true')
      }).catch(error => {
        notify({ type: 'error', message: 'Sign in failed!' })
        console.error(error)
      })
    setSubmitting(false)
  }
  return (
    <div className="login-container">
      <div className="login">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={signIn}
        >
          <Form className='form-login'>
            <h2 className='title'>Sign in</h2>
            <div className='form-input'>
              <Field type="email" placeholder="Enter your email" name="username" />
              <ErrorMessage name="username" component="div" className='error-message' />
            </div>
            <div className='form-input'>
              <Field type="password" placeholder="Enter your password" name="password" className='mt' />
              <ErrorMessage name="password" component="div" className='error-message' />
            </div>
            <div className='submit-btn mt'>
              <button type='submit' >Submit</button>
            </div>

            <div className='register-container'>Don't have an account? <span className='register' onClick={() => navigate('/sign-up')}>Register one</span> </div>
          </Form>
        </Formik>

      </div>
    </div>
  )
}