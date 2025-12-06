import React from 'react';
import  { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig.jsx'
import dropdown from '../assets/dropdown.png';
import { useUser } from "../context/UserContext";
const Navbar = () => {
  const { setLoginStatus }=useUser()
  const { setShowhideoptions }=useUser()
  const { username, setUsername } = useUser(false)

  function logout() {
        localStorage.removeItem('usertoken') || signOut(auth)
        setUsername(false)
        setLoginStatus(false)
        setShowhideoptions(1)
    }
  return (
    <div>
      <div className='flex justify-between items-center text-lg md:text-3xl px-5 py-2 border-b-2 bg-gray-50 border-gray-400/20'>
        <h1 className='font-bold italic'>Event Reminder</h1>

        <div className="dropdown">
          <button className="dropbtn">
            <p className="flex items-center text-xl md:text-2xl font-medium gap-1 md:gap-2">Hey, {username} <img src={dropdown} alt="Example image" className='pt-1 w-6 h-4' /> </p>
          </button>
          <div className="dropdown-content z-10 text-md">
            <button>Profile</button>
            <button>About</button>
            <button>Contact Us</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
