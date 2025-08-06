import { useNavigate } from 'react-router-dom'

const Hero = () => {
    
    const navigate = useNavigate();
  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full
    justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat
    min-h-screen'>

        <div className='text-center mb-6'>
            <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl
            font-semibold mx-auto leading-[1.2]'>Create amazing contents <br/>with <span className='text-primary'>AI tools</span></h1>
            <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto
            max-sm:text-xs text-gray-600'>Transform your content creation with our site of premium AI tools -
            Generate images, remove backgrounds, and more with just a few clicks.
            </p>
        </div>

        <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
            <button onClick={() => navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg
            hover:scale-102 active:scale-95 transition cursor-pointer'>Start creating now</button>
            <button className=" rounded-lg hover:before:bg-red border-purple-500 relative h-[50px] w-40 overflow-hidden border bg-white px-3
          text-black shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0
            before:h-full before:w-0 before:bg-[#9F149F] before:transition-all before:duration-500 hover:text-white
            hover:before:left-0 hover:before:w-full"><span class="relative z-10">Watch demo</span></button>
        </div>
    </div>
  )
}

export default Hero