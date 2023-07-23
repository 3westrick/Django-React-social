import React, { useEffect, useState,useContext } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import avatar from '../assets/avatar.svg'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import AuthContext from "../contexts/AuthContext";

function PinDetail() {

  let {user, token} = useContext(AuthContext)
  const { id } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  async function addComment(){
    let res = await fetch(`http://127.0.0.1:8000/api/pins/${id}/messages/create/`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization' : token ? `Bearer ${String(token.access)}` : ''
        },
        body: JSON.stringify({'text': comment})
    })
    if (res.status == 201){
      setComment('')
      get_detail()
    }
  }

  useEffect(()=>{
    get_detail()
  },[])

  if (!pinDetail) {
    return (
      <Spinner message="Loading pin" />
    );
  }

  async function get_sim(cat){
    
    let res = await fetch(`http://127.0.0.1:8000/api/pins/categories/${cat}/`,
    {
      method: 'GET',
     headers:{
       'Content-Type': 'application/json',
       'Authorization' : token ? `Bearer ${String(token.access)}` : ''
       }
     })
   if (res.status == 200){
     let data = await res.json()
     setPins(data)
   }
  }

  async function get_detail(){
    let res = await fetch(`http://127.0.0.1:8000/api/pins/${id}/`,
    {
      method: 'GET',
     headers:{
       'Content-Type': 'application/json',
       'Authorization' : token ? `Bearer ${String(token.access)}` : ''
       }
     })
   if (res.status == 200){
     let data = await res.json()
     console.log(data)
     get_sim(data.category.title)
     setPinDetail(data)
   }
  }


  return (
    <>
    {pinDetail && (
      <div className="flex lg:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
      <div className='flex justify-center items-center md:items-start flex-initial'>
        <img src={pinDetail?.image} className="rounded-t-3xl rounded-b-lg"/>
      </div>

      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a href={pinDetail.image} target="_blank" download 
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
          </div>
          <a className='underline' href={pinDetail.url} target="_blank" rel="noreferrer">
                {pinDetail.url?.slice(8)}
              </a>
        </div>
        <div>
            <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
        </div>
        <Link to={`/profile/${pinDetail?.owner.id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={avatar} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.owner.username}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>

            <div className="max-h-370 overflow-y-auto">
            {pinDetail?.messages?.slice(0,4).map((item) => (
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.id}>
                  <img
                    src={avatar}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.user.username}</p>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/profile/${user?.id}`}>
                <img src={avatar} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Sending...' : 'Send'}
              </button>
            </div>
      </div>
    </div>
    )}
    {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>

  )
}

export default PinDetail
