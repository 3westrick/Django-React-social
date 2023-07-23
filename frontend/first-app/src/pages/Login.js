import React from 'react'
import { Navigate } from 'react-router-dom'
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import LoginForm from '../components/LoginForm'
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import jwt_decode from "jwt-decode";

function Login() {
  let {user} = useContext(AuthContext)

  const login_google = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
  });

  async function login_api(res_g){
    let data = jwt_decode(res_g.credential)
    // data.email
    // data.given_name
    let res = await fetch("http://127.0.0.1:8000/api/user/login/", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({"email": data.email, "username": data.given_name})
    })
    console.log(res)


  }

  if (user){
    console.log(user)
    return <Navigate to="/" />
  }

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
       
        <LoginForm/>
         <div className='shadow-2xl mt-2'>
          
          {/* <GoogleLogin
            onSuccess={credentialResponse => login_api(credentialResponse)}
            onError={() => {
            console.log('Login Failed');
            }}
            /> */}
            {/* <button onClick={login_google} className='bg-white flex justify-center items-center gap-2 p-2 rounded mt-1'>
              <FcGoogle/> Sign in with google
            </button> */}

        </div>
      </div>

    </div>
  )
}

export default Login
