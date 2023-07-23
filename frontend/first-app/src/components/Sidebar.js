import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {RiHomeFill, RiLoginBoxFill, RiLogoutBoxFill} from 'react-icons/ri'
import { IoIosArrowForward } from 'react-icons/io'
import logo from '../assets/logo.png'
import avatar from '../assets/avatar.svg'
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

function Sidebar({closeToggle}) {
    let {user, logout} = useContext(AuthContext)

    function handleCloseSideBar(){
        if (closeToggle){
            closeToggle(false)
        }
    }
    const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize"
    const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize" 

    const [categories, setCategories] = useState([]) 
    async function get_categories(){
        let res = await fetch("http://127.0.0.1:8000/api/pins/categories/")
        let data = await res.json()
        setCategories(data)
    }
    useEffect(()=>{
        get_categories()
    }, [])
  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link to="/" onClick={handleCloseSideBar} className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'>
            <img src={logo} className="w-full"/>
        </Link>

        <div className='flex flex-col gap-5'>
            <NavLink to="/" className={({isActive} )=> isActive ? isActiveStyle: isNotActiveStyle}>
                <RiHomeFill/>Home
            </NavLink>
            {user ? (
            <NavLink onClick={logout} className={isNotActiveStyle}>
                <RiLogoutBoxFill/>Logout
            </NavLink>):
            (
            <NavLink to="/login" className={isNotActiveStyle}>
                <RiLoginBoxFill/>Login
            </NavLink>)}
            <h3 className='mt-2 px-5 text-base 2xl:text-xl'>discover categories</h3>
            {categories.slice(0,categories.length - 1).map(cat => (<NavLink to={`/category/${cat.title}`}
            className={({isActive} )=> isActive ? isActiveStyle: isNotActiveStyle}
            onClick={handleCloseSideBar} key={cat.title}>
                {cat.title}
            </NavLink>))}
        </div>
      </div>
      {user && (
        <Link to={`profile/${user.id}`} 
        onClick={handleCloseSideBar}
        className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3">
            <img src={avatar} className="w-10 h-10 rounded-full"/>
            <p>{user.username}</p>
        </Link>
      )}
    </div>
  )
}

export default Sidebar
