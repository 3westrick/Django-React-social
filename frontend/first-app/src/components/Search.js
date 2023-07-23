import React, { useEffect, useState } from 'react';
import { delay } from '../ulits';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

function Search({search}) {
  let {user, token} = useContext(AuthContext)
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  console.log(search)

  async function get_pins(){
    setLoading(true)
    await delay(500)
    let res = await fetch(`http://127.0.0.1:8000/api/pins/?search=${search}`,
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

  useEffect(() => {
    get_pins()
  }, [search]);
  
  return (
    <div>
      {loading && <Spinner message="Searching pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && search !== '' && !loading && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  )
}

export default Search
