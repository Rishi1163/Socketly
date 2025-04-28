import React, { useState } from 'react'
import img1 from '../assets/login.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { register } from '../actions/authActions';
import { socket } from '../socket/socket';


const Register = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData ] = useState({fullName: "", email: "", password:""})
  const dispatch = useDispatch()
  const {loading} = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name] : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(!formData.fullName || !formData.email || !formData.password){
      toast.error("All fields are required")
    }
    dispatch(register(formData, navigate,socket))
    setFormData({fullName:"", email: "", password:""})
  }

  return (
    <div className='grid lg:grid-cols-2 sm:grid-cols-1 px-2'>
      <div className='min-h-full flex justify-center items-center px-2'>
        <div className='grid w-full py-3'>
          <div className='text-center my-3'>
            <p className='text-2xl'>Please register to continue.</p>
          </div>
          <div className=' flex justify-center py-3 w-full'>
            <form onSubmit={handleSubmit} className='grid gap-2'>
              <div className='grid gap-1 w-full'>
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  className='border w-80 px-2 py-1.5 rounded-md outline-none'
                  placeholder='Enter your username'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className='grid gap-1 w-full'>
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  className='border w-80 px-2 py-1.5 rounded-md outline-none'
                  placeholder='Enter your email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className='grid gap-1 w-full'>
                <label htmlFor="">Password</label>
                <div className='border w-80 px-2 py-1.5 rounded-md flex'>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder='Enter your password'
                    className='w-full outline-none'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <div className='px-1 text py-1 cursor-pointer' onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </div>
                </div>
              </div>

              <button className=' mt-2 py-2 rounded-lg cursor-pointer bg-blue-600 font-semibold' disabled={loading}>{loading ? "Registering....." : "Register"}</button>
            </form>
          </div>
          <div className='flex justify-center items-center'>
            <p>Already have an account? <Link to={'/login'} className='text-blue-600 font-semibold hover:underline'>Login</Link></p>
          </div>
        </div>
      </div>

      <div className='hidden lg:flex min-h-screen justify-center flex-col gap-2 items-center'>
        <div className='relative'>
          <div className='absolute top-8 w-full text-center'>
            <h1 className='text-3xl'>Welcome to socketly</h1>
            <p className='text-gray-400'>More Than Just Messages, It’s Conversations That Move at the Speed of Thought. No Waiting, No Lag, Just Pure, Uninterrupted Connection</p>
          </div>
        <img src={img1} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Register
