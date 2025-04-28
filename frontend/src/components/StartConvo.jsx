import React from 'react'
import img from '../assets/StartConvo.png'

const StartConvo = () => {
  return (
    <div className='hidden md:flex flex-col md:justify-center w-full h-full md:items-center'>
      <img src={img} alt="" className='lg:w-[25rem] w-[20rem] h-[20rem] lg:px-0 lg:h-[25rem] mx-6 md:mx-0'/>
      <p className='md:w-xl ml-4 text-gray-300 px-4 lg:px-0 text-sm md:text-xl text-center'>Every great conversation starts with a single tap. <br/>Pick someone and say hello!</p>
    </div>
  )
}

export default StartConvo
