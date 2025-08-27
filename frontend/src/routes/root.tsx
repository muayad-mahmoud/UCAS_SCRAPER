import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Root() {
  return (
    <div className='relative flex min-h-screen flex-col bg-transparent'>
      {/* Navbar */}
      <div className='sticky top-0 z-50 flex items-center border-y bg-white px-4 py-2 transition-all md:px-24'>
        <h1 className='text-xl text-gray-700'>
          <Link to='/' className='flex items-center'>
            <span className='font-bold -tracking-[0.07rem]'>
              Course Gallery
            </span>
          </Link>
        </h1>
      </div>

      <div className='flex flex-1 flex-col'>
        <Outlet />
      </div>
    </div>
  )
}

export default Root
