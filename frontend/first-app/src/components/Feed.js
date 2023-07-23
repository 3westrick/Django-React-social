import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import MasonryLayout from "./MasonryLayout"
import Spinner from './Spinner'
import { delay } from '../ulits'
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

function Feed() {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState([])
  const {category} = useParams()
  let {user, token} = useContext(AuthContext)

  async function get_cat(category){
    setLoading(true)
    await delay(500)
    let res = await fetch(`http://127.0.0.1:8000/api/pins/categories/${category}/`,
     {
      headers:{
        'Content-Type': 'application/json',
        'Authorization' : token ? `Bearer ${String(token.access)}` : ''
        }
      })
    if (res.status == 200){
      let data = await res.json()
      setPins(data)
      setLoading(false)
    }
  }
  async function get_pin(){
    setLoading(true)
    await delay(500)
    let res = await fetch(`http://127.0.0.1:8000/api/pins/`,
    {
      headers:{
        'Content-Type': 'application/json',
        'Authorization' : token ? `Bearer ${String(token.access)}` : '' 
        }
      })
    if (res.status == 200){
      let data = await res.json()
      setPins(data)
      setLoading(false)
    }
  }

  useEffect(()=>{
    if (category){
      get_cat(category)
    }else{
      get_pin()
    }
  },[category])
  if (loading) return <Spinner message="We are adding new ideas to your feeds!"/>

  return (
    <div>
      <MasonryLayout user={user} pins={pins}/>
    </div>
  )
}

export default Feed
