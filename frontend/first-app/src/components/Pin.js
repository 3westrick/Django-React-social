import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MdDownloadForOffline} from 'react-icons/md'
import { AiTwotoneDelete} from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { delay } from '../ulits'
import avatar from '../assets/avatar.svg'


function Pin({pin}) {
  let {user, token} = useContext(AuthContext)
  const navigate = useNavigate()
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  
  const [saved, setSaved] = useState(pin.saved)

  async function toggleSave(id){
    if(user){
    setSavingPost(true)
    await delay(500)
    let res = await fetch(`http://127.0.0.1:8000/api/pins/${id}/save/`,
    {
      method: 'POST',
     headers:{
       'Content-Type': 'application/json',
       'Authorization' : `Bearer ${String(token.access)}`  
       }
     })
   if (res.status == 200){
     let data = await res.json()
     console.log(data)
     setSaved(data.result)
     setSavingPost(false)
   }
  }
  }

  async function delete_pin(id){
    let res = await fetch(`http://127.0.0.1:8000/api/pins/${id}/delete/`,
    {
      method: 'DELETE',
     headers:{
       'Content-Type': 'application/json',
       'Authorization' : `Bearer ${String(token.access)}`  
       }
     })
   if (res.status == 200){
     let data = await res.json()
     console.log(data)
     setSaved(data.result)
     window.location.reload() // TODO
   }
  }

  return (
    <div className='m-2'>
      <div
      onMouseEnter={()=>setPostHovered(true)}
      onMouseLeave={()=>setPostHovered(false)}
      onClick={()=> navigate(`/pins/${pin.id}`)}
      className="relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
      <img className='rounded-lg w-full' src={pin.image}/>
      {postHovered && (
        <div className='absolute top-0 w-full h-full flex flex-col justify-between p-2 pl-1 z-50'
        style={{height:"100%"}}>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <a href={`${pin.image}?dl=`} download={true} onClick={(e)=> e.stopPropagation()} className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-all duration-300">
                <MdDownloadForOffline/>
                </a>
              </div>
              
              <button
              onClick={(e)=> {
                e.stopPropagation()
                toggleSave(pin.id)
              }}
              type='button'
              className='bg-red-500 opacity-80 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none transition-all duration-200'
             >{saved ? (savingPost ? "Removing" :"Saved") : (savingPost ? "Saving" :"Save")}</button> 
              
              
          </div>
          <div className='flex justify-between items-center gap-2 w-full'>
            {pin.url ? (
              <a href={pin.url}  onClick={(e)=> e.stopPropagation()} target="_blank" rel="noreferrer" className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md ">
                <BsFillArrowUpRightCircleFill/>{pin.url?.slice(8.17)}
                </a>
            ):<span></span>}
            {user && (
              pin.owner.id == user.id &&(
                <button type="button" onClick={(e)=> {
                  e.stopPropagation()
                  delete_pin(pin.id)
                }}
                className='bg-red-800 p-2 opacity-80 hover:opacity-100 text-white font-bold text-base rounded-3xl hover:shadow-md outline-none transition-all duration-200'     
                ><AiTwotoneDelete/>
                </button>
            )
            )}
          </div>
        </div>
      )}
      
      </div>
      <Link to={`/profile/${pin.owner.id}`} className="flex gap-2 items-center mt-2">
        <img className='w-8 h-8 rounded-full object-cover' src={avatar}/>
        <p className='font-semibold capitalize'>{pin.owner.username}</p>
      </Link>
    </div>
  )
}

export default Pin
