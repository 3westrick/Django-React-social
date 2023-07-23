import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdSearch} from 'react-icons/io'
import avatar from "../assets/avatar.svg"
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

function Navbar({ search, setSearch}) {
    let {user} = useContext(AuthContext)
    const navigate = useNavigate();
    if (!user) return null

  return (
    <div className='flex ga-2 md:gap-5 w-full mt-5 pc-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className="ml-1"/>
        <input 
            type="text"
            onChange={(e)=> setSearch(e.target.value)}
            placeholder="search"
            value={search}
            onFocus={()=> navigate("/search")}
            className="p-2 w-full bg-white outline-none"/>
      </div>
      <div className='flex gap-3'>
        <Link to={`profile/${user.id}`} className="hidden md:block">
            <img src={avatar} className="w-14 h-12 rounded-lg"/>
        </Link>

        <Link to="pins/create" className='bg-red-700 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center' >
            <IoMdAdd/>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
