import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { auth, googleProvider } from '../firebase/firebaseConfig.jsx';
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

import { useUser } from "../context/UserContext";
import google_icon from '../assets/google_icon.png';
const UserReg = () => {
  const { setLoginStatus } = useUser();
  const { setUsername } = useUser();
  const { setShowhideoptions } = useUser();
  const [name, SetName] = useState()
  const [gender, SetGender] = useState()
  const [dob, SetDob] = useState()
  const [email, SetEmail] = useState()
  const [phoneno, SetPhoneno] = useState()
  const [password, SetPassword] = useState()
  const data = { name, gender, dob, email, phoneno, password }
  const logcode = async (e) => {
    e.preventDefault();
    var response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/userreg`, data)
    if (response.data.success == true) {
      SetName("")
      SetDob("")
      SetPassword("")
      SetPhoneno("")
      SetEmail("")
      SetGender("")
      localStorage.setItem("usertoken", response.data.usertoken)
      setUsername(response.data.username.split(" ")[0])
      setLoginStatus('active')
    }
    else {
      toast.error("All Field Are required")
    }
  }

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user.email && result.user.displayName) {
        const data = {
          name: result.user.displayName,
          email: result.user.email,
          authtype: "google",
        }
        var response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/userreg`, data)
        if (response.data.success == true) {
          SetEmail("")
          SetPassword("")
          localStorage.setItem("usertoken", response.data.usertoken)
          setUsername(response.data.username.split(" ")[0])
          setLoginStatus('active')
        }
        else {
          toast.error(response.data.msg)
        }
      }
    }
    catch (error) {
      window.alert("error Ocurred")
    }
  }

  const handleInvalid = (e) => {
    if (e.target.value.length !== 10) {
      e.target.setCustomValidity("Please enter a valid 10-digit number");
    } else {
      e.target.setCustomValidity("");
    }
  };
  return (
    <>
      <div className='fixed top-0 left-0 z-5 flex justify-center items-center w-screen h-screen bg-gray-500/10'>
        <ToastContainer />
        <div className='flex flex-col gap-2 w-[90%] md:w-[400px] border border-gray-200 shadow-2xl px-10 pt-2 pb-3 bg-white'>
          <h1 className="text-2xl text-center font-bold italic pt-3">Sign-up</h1>
                    <div className="pt-2">
            <h1 className="flex">Already have an account ?<button className="text-blue-600 px-1 font-bold text-md italic" onClick={() => { setShowhideoptions(1) }}> Login</button></h1>
          </div>
          <form className='flex flex-col gap-2 pt-2' onSubmit={logcode}>
            <input type="text" placeholder='Your Name' className='w-full outline-none border border-gray-200 px-3 py-1' name="name" value={name} onChange={(e) => { SetName(e.target.value) }} required />
            <div className="flex gap-2 text-lg py-1">
              <label htmlFor="male"> Male</label>
              <input type="radio" name="Gender" value="Male" onChange={(e) => { SetGender(e.target.value) }} required />
              <label htmlFor="male">Female</label>
              <input type="radio" name="Gender" value="Female" onChange={(e) => { SetGender(e.target.value) }} required />
              <label htmlFor="male">Other</label>
              <input type="radio" name="Gender" value="other" onChange={(e) => { SetGender(e.target.value) }} required />
            </div>
            <div className="flex gap-5 items-center">
              <h1>Date of Birth: </h1>
              <input type="date" className='outline-none border border-gray-200 px-3 py-1' name="DOB" value={dob} onChange={(e) => { SetDob(e.target.value) }} required />
            </div>
            <input type="text" pattern="[0-9]{10}" minLength={10} maxLength={10} placeholder='Phone No' className='w-full outline-none border border-gray-200 px-3 py-1' name="phoneno" value={phoneno} onChange={(e) => { SetPhoneno(e.target.value) }} onInvalid={handleInvalid} required />
            <input type="email" placeholder='Email Id' className='w-full outline-none border border-gray-200 px-3 py-1' name="email" value={email} onChange={(e) => { SetEmail(e.target.value) }} required />
            <input className='w-full outline-none border border-gray-200 px-3 py-1' type="password" placeholder='Password' name="password" minLength={8} value={password} onChange={(e) => { SetPassword(e.target.value) }} required />
            <button className="bg-black text-white py-2 mt-2 cursor-pointer">Register</button>
          </form>
          <div className="flex flex-col items-center py-2 gap-2">
            <h1>Or</h1>
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

export default UserReg