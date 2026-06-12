import { useNavigate } from 'react-router'
import logo from '../assets/logo.png'
import homeimg from '../assets/homeimage1.png'

function Home() {
  const navigate = useNavigate()

  return (
    <div className='container mx-auto min-h-screen px-4 flex flex-col md:grid md:grid-cols-2 gap-10 items-center justify-center'>
      <div className='flex flex-col gap-6 w-full max-w-xl'>
        <div className='flex h-12 md:h-16 gap-5 items-center'>
          <img src={logo} alt="logo" className='h-full aspect-square rounded-full object-cover'/>
          <h1 className='text-4xl md:text-6xl font-bold text-blue-700 whitespace-nowrap'><span className='text-black'>Cloud</span>Vault</h1>
        </div>
        
        <div className='w-full'>
          <p className='text-3xl md:text-5xl font-bold text-gray-800 leading-tight'>Store and Access Files Online</p>
        </div>
        
        <div className='w-full text-lg md:text-xl text-gray-500 flex flex-col gap-2'>
          <p>Your digital vault, reimagined. Experience seamless file access online.</p>
          <p>Upload, open, and access any file anywhere.</p>
        </div>
        
        <div>
          <button 
            onClick={() => navigate('/register')} 
            className='shadow-xl text-white hover:bg-blue-600 bg-blue-500 transition-colors duration-200 p-3 px-6 text-xl rounded-2xl font-semibold cursor-pointer'
          >
            Get Started
          </button>
        </div>
      </div>

      <div className='w-full max-w-md md:max-w-full justify-self-center'>
        <img src={homeimg} alt="home image" className='w-full h-auto object-contain max-h-[60vh]' />
      </div>
    </div>
  )
}

export default Home
