import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.svg'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { delay } from '../ulits';
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

function Profile() {
  let {user, token, logout} = useContext(AuthContext)
  const [User, setUser] = useState(null)
  const [pins, setPins] = useState();
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const { id } = useParams();


  async function get_pins(){
    setLoading(true)
    await delay(500)
    let res = await fetch(`http://127.0.0.1:8000/api/pins/user/${id}/`,
    {
      headers:{
        'Content-Type': 'application/json',
        'Authorization' : token ? `Bearer ${String(token.access)}` : '' 
        },
        
      })
    if (res.status == 200){
      let data = await res.json()
      console.log(data)
      setPins(data.pins)
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
      })
      setLoading(false)
    }
  }

  useEffect(()=>{
    get_pins()
  }, [])

  if (loading) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
          <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={avatar}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {User.username}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {user?.id == User.id && (
              <button
              type="button"
              className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
              onClick={logout}
            >
              <AiOutlineLogout color="red" fontSize={21} />
            </button>
            )}
          </div>
        </div>
               <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>

        </div>
        <div className="px-2">
          <MasonryLayout pins={pins} />
        </div>
        {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Pins Found!
        </div>
        )}
      </div>
    </div>
  )
}

export default Profile
