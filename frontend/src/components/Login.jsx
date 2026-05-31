import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import useAuthStore from '../store/useAuthStore.js' 
import { API_URLS } from '../config/api.js'

function Login() {
  const navigate = useNavigate()
  const loginUser = useAuthStore((state) => state.loginUser) 
  
  const [msg, setmsg] = useState('')
  const [errmsg, seterrmsg] = useState('')
  
  const { handleSubmit, reset, register } = useForm()

  async function onsubmitfn(userobj) {
    try {
      seterrmsg('')
      setmsg('')
      
      let resobj = await axios.post(API_URLS.LOGIN, userobj, { withCredentials: true })
      
      if (resobj.status === 200) {
        setmsg("Login successful!")
        
        loginUser(resobj.data.payload) 
        
        reset() 
        
        setTimeout(() => {
          navigate('/dashboard') 
        }, 1500)
      }
    } catch (err) {
      console.log("Full login error:", err.response?.data)
      
      if (err.response && err.response.data && err.response.data.message) {
        const backendErr = err.response.data.message
        seterrmsg(Array.isArray(backendErr) ? backendErr.join(', ') : backendErr)
      } else {
        seterrmsg("Server connection failed. Please try again.")
      }
    }
  }

  return (
   <div className="flex justify-center items-center min-h-[80vh] w-full p-4">
    <form onSubmit={handleSubmit(onsubmitfn)} className="grid grid-cols-1 w-[90vw] md:w-[40vw] gap-4 shadow-2xl p-6 rounded-2xl bg-white" >
      <h1 className="text-3xl font-black mb-2">Login</h1>
      
      {msg && <h1 className="text-green-600 bg-green-50 p-2 rounded text-center font-bold border border-green-200">{msg}</h1>}
      {errmsg && <h1 className="text-red-500 bg-red-50 p-2 rounded text-center font-bold border border-red-200">{errmsg}</h1>}

     
      <div className="grid grid-cols-1 p-2 gap-2">
        <h1 className="font-medium">Email <span className="text-red-500">*</span> :</h1>
        <input 
          type="email" 
          className="border p-2 rounded" 
          {...register('email')} 
          required
        />
      </div>

      <div className="grid grid-cols-1 p-2 gap-2">
        <h1 className="font-medium">Password <span className="text-red-500">*</span> :</h1>
        <input 
          type="password" 
          className="border p-2 rounded" 
          {...register('password')} 
          required
        />
      </div>

      
      <button type="submit" className='bg-blue-400 hover:bg-blue-600 hover:cursor-pointer text-white p-3 mx-2 rounded-xl font-bold transition-colors mt-2'>
        Login
      </button>


      <h1 className="text-center mt-2">
        New here? 
        <button type="button" className='underline text-blue-400 hover:cursor-pointer ml-1' onClick={() => navigate('/register')}>
          Create an Account
        </button>
      </h1>
    </form>
   </div>
  )
}

export default Login
