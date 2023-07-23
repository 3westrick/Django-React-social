import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

function Header() {
  let {logout} = useContext(AuthContext)
  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/login">Login</Link>
      <span> | </span>
      <Link to="/register">Register</Link>
      <span> | </span>
      <a onClick={logout} href="#">Logout</a>
    </div>
  )
}

export default Header
