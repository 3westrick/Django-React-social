import React, {useState} from 'react'
import { Route, Routes } from 'react-router-dom'
import {Navbar, Feed, Pin, Search, CreatePin, PinDetail} from "../components"

function Pins() {
  const [search , setSearch] = useState('')

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar search={search} setSearch={setSearch}/>
      </div>
      <div className="h-full mt-5">
        <Routes>
          <Route path="/" element={<Feed/>}/>
          <Route path="/category/:category" element={<Feed/>}/>
          <Route path="/pins/:id" element={<PinDetail />}/>
          <Route path="/pins/create" element={<CreatePin/>}/>
          <Route path="/search" element={<Search search={search} setSearch={setSearch}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Pins
