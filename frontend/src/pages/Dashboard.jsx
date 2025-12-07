import React from 'react'
import Navbar from '../components/Navbar.jsx';
import FetchedEvents from '../components/FetchedEvents.jsx'
const DashBoard = () => {
  return (
    <div>
       <Navbar />
       <FetchedEvents />
    </div>
  )
}

export default DashBoard
