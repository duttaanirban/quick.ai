import React from 'react'

const Sidebar = ({sidebar, setSidebar}) => {
  return (
    <div className={`w-60 bg-white border-r border-gray-200 flex
    flex-col justify-between items-center max-sm:absolute top-14
    bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300
    ease-in-out`}>
        <div className='my-7 w-full'>
            <img />
        </div>

    </div>
  )
}

export default Sidebar