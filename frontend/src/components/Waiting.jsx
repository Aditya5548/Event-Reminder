import { ClipLoader } from "react-spinners"
const Waiting = () => {
  return (
    <>
    <div className='flex justify-center items-center w-screen h-screen'>
        <div className='flex flex-col justify-center items-center gap-2'>
            <h1 className="text-xl md:text-3xl">Please Wait...</h1>
            <ClipLoader size={60} color="#000000" loading />   
        </div>
    </div>
    </>
  )
}

export default Waiting
