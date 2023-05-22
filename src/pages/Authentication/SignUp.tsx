import { useState } from 'react'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import './Login.css'
import notify from "../../components/Common/Notify";
import { useNavigate } from 'react-router-dom';
import { object, string, ObjectSchema, ref } from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
interface FormValues {
  username: string;
  password: string;
  rePassword: string;
}

export const SignUp = () => {
  const validationSchema: ObjectSchema<FormValues> = object({
    username: string().email('Please enter a valid email').required('Email is required'),
    password: string().required('Password is required'),
    rePassword: string()
      .oneOf([ref('password'), ''], 'Confirm password must match with password')
      .required('Confirm password is required'),
  });
  const initialValues: FormValues = {
    username: '',
    password: '',
    rePassword: '',
  }
  const navigate = useNavigate()
  const signUp = (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    createUserWithEmailAndPassword(auth, values.username, values.password)
      .then((userCredential) => {
        notify({ type: 'success', message: 'Sign up successfully!' })
        navigate('/login')
      }).catch(error => {
        notify({ type: 'error', message: 'Sign up failed!' })
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
          onSubmit={signUp}
        >
          <Form className='form-login' autoComplete='off'>
            <h2 className='title'>Sign up</h2>
            <div className='form-input'>
              <Field type="email" placeholder="Enter your email (Eg: abc@gmail.com)" name="username" autoComplete="off" />
              <ErrorMessage name="username" component="div" className='error-message' />
            </div>
            <div className='form-input'>
              <Field type="password" placeholder="Enter your password" name="password" className='mt' autoComplete="off" />
              <ErrorMessage name="password" component="div" className='error-message' />
            </div>
            <div className='form-input'>
              <Field type="password" placeholder="Enter your confirm password" name="rePassword" className='mt' autoComplete="off" />
              <ErrorMessage name="rePassword" component="div" className='error-message' />
            </div>

            <div className='submit-btn mt'>
              <button type='submit' >Submit</button>
            </div>
          </Form>
        </Formik>

      </div>
    </div>
  )
}