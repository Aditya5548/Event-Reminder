import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { mutate } from 'swr';
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import upload_area from '../assets/upload_area.png';
const EventManage = ({ userId, filterbydate }) => {
  const { setEventAddPopUp } = useUser();
  const { fcmtoken } = useUser();
  const [image, setImage] = useState(false)
  const [highlight, setHighlight] = useState(false);
  let [data, setData] = useState({
    eventname: "",
    description: "",
    date: "",
    starttime: "",
    endtime: "",
  })
  const onchangehandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }


  const eventadd = async (e) => {
    e.preventDefault();
    setHighlight(true)
    const formData = new FormData();
    formData.append('eventimage', image)
    formData.append('eventname', data.eventname)
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("starttime", data.starttime);
    formData.append("endtime", data.endtime);
    formData.append('fcmtoken', fcmtoken)
    formData.append('userid', localStorage.getItem('usertoken'))
    var response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/eventadd`, formData)
    setHighlight(false)
    if (response.data.success == true) {
      mutate(`${import.meta.env.VITE_BACKEND_URL}/eventfind?userid=${userId}&date=${filterbydate}`)
      setEventAddPopUp(false)
    }
    else {
      toast.error(response.data.msg)
    }
  }
  return (
    <>
      <div className='fixed top-0 left-0 z-5 flex justify-center items-center w-screen h-screen bg-gray-500/10'>
        <ToastContainer />
        {highlight && (
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div className="w-[50%] h-full bg-linear-to-r from-blue-300 to-purple-300 animate-[leftToRight_1s_linear_infinite] z-30">
            </div>
          </div>
        )}
        
        <div className='flex flex-col gap-2 w-[90%] md:w-[400px] border border-gray-200 shadow-2xl px-10 pt-2 pb-3 bg-white'>
          <button className="text-2xl text-end " onClick={() => setEventAddPopUp(false)}>X</button>
          <h1 className="text-2xl text-center font-bold italic">Event Detail</h1>
          <form className='flex flex-col gap-2 pt-2' onSubmit={eventadd}>
            <input type="text" placeholder='Event Name' className='w-full outline-none border border-gray-200 px-3 py-1' name="eventname" value={data.eventname} onChange={onchangehandler} required />
            <input type="text" placeholder='Event Description' className='w-full outline-none border border-gray-200 px-3 py-1' name="description" value={data.description} onChange={onchangehandler} required />
            <div className='flex justify-center'>
              <label htmlFor="image">
                <img className='mt-1 cursor-pointer' src={!image ? upload_area : URL.createObjectURL(image)} alt='' width={140} height={70} name="eventimage" />
              </label>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden accept='.jpg' />
            </div>
            <div className="flex justify-between gap-5 items-center">
              <h1>Event Date: </h1>
              <input type="date" className='outline-none border border-gray-200 px-3 py-1 w-1/2' name="date" value={data.date} onChange={onchangehandler} required />
            </div>
            <div className="flex justify-between gap-5 items-center">
              <h1>Start Time: </h1>
              <input type="time" className='outline-none border border-gray-200 px-3 py-1 w-1/2' name="starttime" value={data.starttime} onChange={onchangehandler} required />
            </div>
            <div className="flex justify-between gap-5 items-center">
              <h1>End Time: </h1>
              <input type="time" className='outline-none border border-gray-200 px-3 py-1 w-1/2' name="endtime" value={data.endtime} onChange={onchangehandler} required />
            </div>

            <button className="bg-black text-white py-2 my-2 cursor-pointer">Register</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EventManage