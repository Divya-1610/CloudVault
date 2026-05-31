import { useState } from 'react'
import axios from 'axios'
import homeimg from '../assets/homeimage1.png'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'

function Register() {
  const BASE_URL = 'https://cloudvaultbackend-n1x9.onrender.com/'
  const navigate = useNavigate()
  const [msg, setmsg] = useState('')
  const [errmsg, seterrmsg] = useState('')
  
  const { handleSubmit, reset, register, formState: { errors } } = useForm()

  async function onsubmitfn(userobj) {
    try {
      seterrmsg('')
      setmsg('')
      
      let resobj = await axios.post(`${BASE_URL}user`, userobj)
      
      if (resobj.status === 200 || resobj.status === 201) {
        setmsg("User registered successfully!")
        reset()
        
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      }
    } catch (err) {
      console.log("Full error payload:", err.response?.data)
      if (err.response && err.response.data && err.response.data.message) {
        const backendErr = err.response.data.message
        seterrmsg(Array.isArray(backendErr) ? backendErr.join(', ') : backendErr)
      } else {
        seterrmsg("Server connection failed. Please try again.")
      }
    }
  }

  return (
    <div className='grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-6 items-center p-4'>
      <div>
        <img src={homeimg} alt="Registration branding" className="w-full h-auto" />
      </div>
      
      <div>
        <form onSubmit={handleSubmit(onsubmitfn)}>
          <div className="grid grid-cols-1 gap-4 shadow-2xl p-6 rounded-2xl bg-white">
            <h1 className='text-3xl font-black'>Register</h1>
            
            {msg && <h1 className="text-green-600 bg-green-50 p-2 rounded text-center font-bold border border-green-200">{msg}</h1>}
            {errmsg && <h1 className="text-red-500 bg-red-50 p-2 rounded text-center font-bold border border-red-200">{errmsg}</h1>}

            {/* First Name & Last Name */}
            <div className="flex gap-4">
              <div className="grid grid-cols-1 p-2 gap-2 w-full">
                <h1>First Name <span className="text-red-500">*</span> :</h1>
                <input 
                  type="text" 
                  className="border p-2 rounded" 
                  {...register('firstName', { required: "First name is required" })}
                />
                {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
              </div>
              <div className="grid grid-cols-1 p-2 gap-2 w-full">
                <h1>Last Name :</h1>
                <input type="text" className="border p-2 rounded" {...register('lastName')}/>
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 p-2 gap-2">
              <h1>Email <span className="text-red-500">*</span> :</h1>
              <input 
                type="email" 
                className="border p-2 rounded" 
                placeholder='enter gmail id' 
                {...register('email', { required: "Email is required" })}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-1 p-2 gap-2">
              <h1>Phone Number <span className="text-red-500">*</span> :</h1>
              <input 
                type="text" 
                className="border p-2 rounded" 
                {...register('mobile', { required: "Phone number is required" })}
              />
              {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile.message}</span>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 p-2 gap-2">
              <h1>Password <span className="text-red-500">*</span> :</h1>
              <input 
                type="password" 
                className="border p-2 rounded" 
                placeholder='enter min 4 digit Password' 
                {...register('password', { 
                  required: "Password is required", 
                  minLength: { value: 4, message: "Password must be at least 4 characters" } 
                })}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>

            <button type='submit' className='bg-blue-400 hover:bg-blue-600 hover:cursor-pointer text-white p-3 font-bold rounded transition-colors'>
              Create Account
            </button>
            
            <h1>Already a user? 
              <button type="button" className='underline text-blue-400 hover:cursor-pointer ml-1' onClick={() => navigate('/login')}>
                Login
              </button>
            </h1>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
