import React, { useEffect } from 'react';
import axios from 'axios';
import Waiting from './components/Waiting.jsx';
import Userlogin from './pages/Userlogin.jsx';
import UserReg from './pages/UserReg.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useUser } from './context/UserContext.jsx';
import { PushNotification } from './firebase/PushNotification.jsx';
const App = () => {
  const { loginStatus, setLoginStatus } = useUser();
  const { showhideoptions, setShowhideoptions } = useUser();
  const { setUsername } = useUser();
  useEffect(() => {
    const token = localStorage.getItem('usertoken')
    if (token) {
      async function cheackuser() {
        var response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getnamebytoken`, { params: { token: token } })
        setLoginStatus('active')
        setUsername(response.data.username.split(" ")[0])
      }
      cheackuser() 
    }
    else{
      setShowhideoptions(1)
    }
  }, [])
  return (
    <div className='w-full h-screen'>
      <PushNotification /> 
      {loginStatus ==='active' ? <Dashboard /> : showhideoptions == 1 ? <Userlogin /> : showhideoptions == 2 ? <UserReg /> : <Waiting/>}
    </div>
  )
}

export default App
