import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import { auth, googleProvider } from '../firebase/firebaseConfig.jsx';
import { signInWithPopup } from "firebase/auth";
import Waiting from "../components/Waiting.jsx";
import { useUser } from "../context/UserContext";
import google_icon from '../assets/google_icon.png';

const Userlogin = () => {
  const [email, SetEmail] = useState();
  const [password, SetPassword] = useState();
  const { setShowhideoptions } = useUser();
  const { setLoginStatus } = useUser();
  const { setUsername } = useUser();
  const [highlight, setHighlight] = useState(false);
  const data = { email, password }
  const loginHandler = async (e) => {
    setHighlight(true)
    e.preventDefault();
    var response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/userlogin`, { params: data })
    if (response.data.success == true) {
      SetEmail("")
      SetPassword("")
      localStorage.setItem("usertoken", response.data.usertoken)
      setUsername(response.data.username.split(" ")[0])
      setLoginStatus('active')
      setHighlight(false)
    }
    else {
      toast.error(response.data.msg)
      setHighlight(false)
      setShowhideoptions(1)
    }
  }

  const loginWithGoogle = async () => {
    setHighlight(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user.email && result.user.displayName) {
        const data = {
          name: result.user.displayName,
          email: result.user.email,
          authtype: "google",
        }
        var response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/userreg`, data)
        setHighlight(false)
        if (response.data.success == true) {
          SetEmail("")
          SetPassword("")
          localStorage.setItem("usertoken", response.data.usertoken)
          setUsername(response.data.username.split(" ")[0])
          setLoginStatus('active')
        }
        else {
          toast.error(response.data.msg)
          setShowhideoptions(1)
        }
      }
    }
    catch (error) {
      window.alert("Error Occured")
    }
  }


  return (
    <>
      <div className='fixed top-0 left-0 z-5 flex justify-center items-center w-screen h-screen  bg-gray-500/10'>
        <ToastContainer />
        {highlight && (
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div className="w-[50%] h-full bg-linear-to-r from-blue-300 to-purple-300 animate-[leftToRight_1s_linear_infinite] z-30">
            </div>
          </div>
        )}
        <div className='flex flex-col gap-2 w-[90%] md:w-[400px] border border-gray-200 shadow-lg px-10 py-3 bg-white'>
          {highlight && (
            <div className="absolute inset-0 backdrop-blur-xs z-10"></div>
          )}
          <h1 className="text-3xl text-center font-bold italic py-2 px-1 text-md">Login</h1>
          <div className="pt-2">
            <h1 className="flex text-sm md:text-lg">Don't have an account ?<button className="text-blue-600  italic  px-1 font-bold text-md" onClick={() => { setShowhideoptions(2) }}>SignUp</button></h1>
          </div>
          <form className='flex flex-col gap-3 pt-3' onSubmit={loginHandler}>
            <input type="email" placeholder='email Id' className='w-full outline-none border border-gray-200 px-3 py-1' name="email" value={email} onChange={(e) => { SetEmail(e.target.value) }} required />
            <input type="password" placeholder='Password' className='w-full outline-none border border-gray-200 px-3 py-1' name="password" value={password} onChange={(e) => { SetPassword(e.target.value) }} required />
            <button className="bg-black text-white py-2 cursor-pointer">Submit</button>
          </form>
          <div className="flex justify-end"><u className="text-blue-600 mr-2 text-lg">Forgot password</u></div>
          <div className="flex flex-col items-center gap-2 py-1">
            <h1>Or </h1>
            <button className="flex gap-3 items-center justify-center w-full border border-gray-400 rounded-lg py-2 cursor-pointer" onClick={loginWithGoogle}>
              <p className='text-xl'>Continue with </p>
              <img src={google_icon} width={25} height={25} alt="no image not" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Userlogin
