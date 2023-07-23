import React from 'react'
import { Navigate } from 'react-router-dom'
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import RegForm from '../components/RegForm'
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import jwt_decode from "jwt-decode";
function Register() {
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        
        <video
        src={shareVideo}
        type="vide/mp4"
        loop
        controls={false}
        autoPlay
        className='w-full h-full object-cover'
        />
      </div>

      <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
        <div className='p-5'>
          <img src={logo} width="130px" alt="logo" />
        </div>
       
        <RegForm/>
         <div className='shadow-2xl mt-2'>
          
        </div>
      </div>

    </div>
  )
}

export default Register