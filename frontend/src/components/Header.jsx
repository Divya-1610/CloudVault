import { useNavigate } from 'react-router'
import logo from '../assets/logo.png'

function Header() {
  const navigate = useNavigate()
  return (
    <div className="text-2xl flex justify-between h-[10vh] p-3 bg-white shadow-2xl">
      <div className='flex gap-2 items-center justify-center'>
        <img src={logo} onClick ={()=> navigate('/')} alt='logo' className='h-full rounded-full hover:cursor-pointer'/>
        <h1 className='text-2xl font-bold'>Cloud<span className='text-blue-700'>Vault</span></h1>
      </div>
      <div className='flex flex-wrap p-3 gap-4'>
        <button onClick={() => navigate('/login')} className='border p-2 px-4 hover:bg-black hover:cursor-pointer text-white bg-blue-700'>Login</button>
        <button onClick={()=>navigate('/register')} className='border p-2 px-4 hover:bg-black hover:cursor-pointer text-white bg-blue-700'>Register</button>

      </div>
    </div>
  )
}

export default Header
