import {Outlet} from 'react-router'
import Header from './Header'

function RootLayout() {
  return (
    <div>
        <Header/>
        <div className='h-[90vh]'>
          <Outlet/>
        </div>
    </div>
  )
}

export default RootLayout