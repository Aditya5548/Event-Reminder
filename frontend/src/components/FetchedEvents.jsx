import { useState, useEffect } from 'react'
import axios from 'axios'
import useSWR from 'swr';
import { toast, ToastContainer } from 'react-toastify';


import EventManage from './EventManage.jsx';
import UpdateEvent from  './UpdateEvent.jsx';
import { useUser } from "../context/UserContext";


const fetcher = (url) => axios.get(url).then(res => res.data);

const FetchedEvents = () => {
  const { eventAddPopUp ,setEventAddPopUp } = useUser();
  const { updateEventPopup,setUpdateEventPopup } = useUser();
  const [filterbydate, setFilterbydate] = useState("");
  const [search, setSearch] = useState("");
  const [category, SetCategory] = useState("All");
  const userId = localStorage.getItem('usertoken');
  const [updateRequestProp,SetUpdateRequestProp]=useState();

  const { data, error, isLoading, mutate } = useSWR(`${import.meta.env.VITE_BACKEND_URL}/eventfind?userid=${userId}&date=${filterbydate}`, fetcher);


  const filteredEvents = data?.data?.filter((item) =>
    item.eventname.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const DeleteEvent=async(id)=>{
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/eventdelete/${id}`)
    if(response.data.success){
      mutate()
    }
    else{
      toast.error(response.data.msg)
    }
  }

  const UpdateStatus=async(id)=>{
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/eventupdate`,{id:id,actiontype:"changestatus"})
    if(response.data.success){
      mutate()
    }
    else{
      toast.error(response.data.msg)
    }
  }

  const updateEvent=async(res,action)=>{
    const data={...res, ...action};
    SetUpdateRequestProp(data)
    setUpdateEventPopup(true)
  }


  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setFilterbydate(`${year}-${month}-${day}`);
  }, []);

  
  return (
    <div>
      <ToastContainer/>
      <div className='flex justify-center'>
        <div className='w-9/10 mt-5 p-5'>
          <div className='flex flex-col md:flex-row md:justify-around gap-3 bg-gray-700 px-3 py-3'>
            <input type="search" placeholder='Enter here to search' className='px-2 py-1 md:text-lg bg-white outline-none' value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className='px-2 py-1 outline-none md:text-lg bg-white' value={category} onChange={(e) => SetCategory(e.target.value)}>
              <option value="All">All</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Running">Running</option>
            </select>
            <input type="date" className='px-2 py-1 outline-none md:text-xl bg-white'
              value={filterbydate}
              onChange={(e) => setFilterbydate(e.target.value)}
            />
          </div>

          <div className='flex flex-wrap justify-center pt-5 min-h-[500px]'>
            {filteredEvents?.length === 0 && <h1 className='text-lg md:text-xl'>No events found</h1>}
            {isLoading && <h1 className='text-lg md:text-xl'>Please wait.....</h1>}
            {error && <h1>Unable to fetch data......</h1>}
            {filteredEvents?.filter((response) => category == "All" ? true : response.status == category).map((response, index) => (
              <div key={index} className='border border-gray-300/60 w-100 sm:max-w-[250px] h-fit mx-3 my-2 hover:bg-gray-100 hover:shadow-lg'>
                <div className='flex justify-between px-4 py-1 bg-gray-200 md:text-lg'>
                  <h1>{response.eventname}</h1>
                  <h1 className='font-bold cursor-pointer' onClick={(e)=>{DeleteEvent(response._id)}}>X</h1>
                </div>
                <div className='flex flex-col px-1'>
                  <img
                    src={response.imageurl}
                    alt='not found'
                    className='w-[150px] h-[100px] rounded-xl self-center py-2'
                  />
                  <h1 className='h-[50px]'>{response.description}</h1>
                  <p><b>Start: </b> {response.starttime}</p>
                  <p><b>End: </b> {response.endtime}</p>
                  <p><b>Date:</b> {response.date}</p>
                  <div className='flex justify-center gap-2'>
                  <button className='text-white font-medium text-md self-center my-2'>
                    <p className={response.status == 'Missed' ? 'bg-red-600 px-3 py-1 rounded-sm' : response.status == 'Running' ? 'bg-amber-400 w-full px-3 py-1 rounded-sm' : response.status == 'Upcoming' ? 'bg-green-500 w-fit px-3 py-1 rounded-sm' : response.status == 'Completed' ? 'bg-blue-600 w-fit px-15 py-1 rounded-sm' : ""}>{response.status}</p>
                  </button>
                  {response.status=="Running" && <button className='bg-gray-500 text-white text-md px-4 py-2 my-2 rounded-sm font-medium cursor-pointer transition-transform' onClick={(e)=>{UpdateStatus(response._id)}}>Mark Finished</button>}
                  {response.status=="Missed" && <button className='bg-gray-500 text-white text-md px-4 py-2 my-2 rounded-sm font-medium cursor-pointer'  onClick={(e)=>{updateEvent(response,{actiontype:"Reschedule"})}}>Reschedule</button>}
                  {response.status=="Upcoming" && <button className='bg-gray-500 text-white text-md px-4 py-2 my-2 rounded-sm font-medium cursor-pointer' onClick={(e)=>{updateEvent(response,{actiontype:"Update"})}}>Update</button>}
                 
                  </div>
                 </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {eventAddPopUp && <EventManage userId={userId} filterbydate={filterbydate}/>}
      {updateEventPopup && <UpdateEvent props={updateRequestProp} userId={userId} filterbydate={filterbydate}/>}
      <button className='fixed bottom-10 right-10 text-xl md:text-2xl bg-sky-500 px-5 py-2 font-bold text-white rounded-lg'
        onClick={() => setEventAddPopUp(true)}
      >
        ADD +
      </button>
    </div>
  );
};

export default FetchedEvents