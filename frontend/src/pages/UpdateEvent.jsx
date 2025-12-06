import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import upload_area from '../assets/upload_area.png';

const UpdateEvent = ({props}) => {
  const {setUpdateEventPopup} = useUser();
  const [eventname,setEventname]=useState(props.eventname);
  const [description,setDescription]=useState(props.description);
  const [date,setDate]=useState(props.date);
  const [starttime,setStarttime]=useState(props.starttime);
  const [endtime,setEndtime]=useState(props.endtime);
  const [reminder,SetReminder]=useState("")
  const change = async (e) => {
    e.preventDefault();
    const data={eventname,description,date,starttime,endtime,id:props._id,status:"Upcoming",actiontype:"updatevent"}
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/eventupdate`,data)
    if (response.data.success == true) {
      toast.success("successfull event added")
      setUpdateEventPopup(false)
      window.location.reload()
    }
    else {
      toast.error(response.data.msg)
    }
  }
  return (
    <>
      <div className='fixed top-0 left-0 z-5 flex justify-center items-center w-screen h-screen bg-gray-500/10'>
        <ToastContainer />
        <div className='flex flex-col gap-2 w-[90%] md:w-[400px] border border-gray-200 shadow-2xl px-10 pt-2 pb-3 bg-white'>
          <button className="text-2xl text-end " onClick={(e) =>{setUpdateEventPopup(false)}}>X</button>
          <h1 className="text-2xl text-center font-bold italic">{props.actiontype} Events</h1>
          <form className='flex flex-col gap-2 pt-2' onSubmit={change}>
            <input type="text" placeholder='Event Name' className='w-full outline-none border border-gray-200 px-3 py-1' name="eventname" value={eventname} onChange={(e) => { setEventname(e.target.value) }} required />
            <input type="text" placeholder='Event Description' className='w-full outline-none border border-gray-200 px-3 py-1' name="description" value={description} onChange={(e) => { setDescription(e.target.value) }} required />

            <div className="flex justify-between gap-5 items-center">
              <h1>Event Date: </h1>
              <input type="date" className='outline-none border border-gray-200 px-3 py-1 w-1/2' name="date" value={date} onChange={(e) => { setDate(e.target.value) }} required />
            </div>
            <div className="flex justify-between gap-5 items-center">
              <h1>Start Time: </h1>
              <input type="time" className='outline-none border border-gray-200 px-3 py-1 w-1/2' name="starttime" value={starttime} onChange={(e) => { setStarttime(e.target.value) }} required />
            </div>
            <div className="flex justify-between gap-5 items-center">
              <h1>End Time: </h1>
              <input type="time" className='outline-none border border-gray-200 px-3 py-1 w-1/2' name="endtime" value={endtime} onChange={(e) => { setEndtime(e.target.value) }} required />
            </div>
            <button className="bg-black text-white py-2 my-3 cursor-pointer">{props.actiontype}</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default UpdateEvent