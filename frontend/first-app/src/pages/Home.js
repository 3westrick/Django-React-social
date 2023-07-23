import Header from '../components/Header'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Routes, Route } from 'react-router-dom'

import { Sidebar, Profile } from '../components'
import logo from "../assets/logo.png"
import avatar from "../assets/avatar.svg"
import AuthContext from '../contexts/AuthContext'
import Pins from './Pins'

function Home() {
  let {user} = useContext(AuthContext)
  const [toggle, setToggleSidebar] = useState(false)
  const scrollRef = useRef(null)
  useEffect(()=>{
    scrollRef.current.scrollTo(0,0)
  }, [])
  let prof_item = null
  if (user){
    prof_item= <Link to={`/profile/${user.id}`}><img src={avatar} alt="avatar" className="w-28" /></Link>
  }
  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user}/>
      </div>

      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className="cursor-pointer" onClick={()=> setToggleSidebar(true)}/>
          <Link to="/"><img src={logo} alt="logo" className="w-28" /></Link>
          {prof_item}
        </div>
        
        {toggle && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              
                <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={()=>setToggleSidebar(false)} />
            </div>
              <Sidebar user={user} closeToggle={setToggleSidebar}/>
          </div>
        )}
      </div>
        
        <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
          <Routes>
            <Route path='/profile/:id' element={<Profile/>}/>
            <Route path='/*' element={<Pins user={user}/>}/>
          </Routes>
        </div>
    </div>
  )
}

export default Home
