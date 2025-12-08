import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { mutate } from 'swr';

const UpdateEvent = ({props, userId, filterbydate}) => {
  let {setUpdateEventPopup} = useUser();
  let [eventname,setEventname]=useState(props.eventname);
  let [description,setDescription]=useState(props.description);
  let [date,setDate]=useState(props.date);
  let [starttime,setStarttime]=useState(props.starttime);
  let [endtime,setEndtime]=useState(props.endtime);
  let [highlight, setHighlight] = useState(false);
  let change = async (e) => {
    e.preventDefault();
    setHighlight(true);
    let data={eventname,description,date,starttime,endtime,id:props._id,status:"Upcoming",actiontype:"updatevent"}
    let response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/eventupdate`,data)
    setHighlight(false)
    if (response.data.success == true) {
      mutate(`${import.meta.env.VITE_BACKEND_URL}/eventfind?userid=${userId}&date=${filterbydate}`)
      setUpdateEventPopup(false)
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
            <div className="w-[50%] h-full bg-linear-to-r from-blue-300 to-purple-300 backdrop-blur-xl animate-[leftToRight_0.5s_linear_infinite] z-30">
            </div>
          </div>
        )}
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