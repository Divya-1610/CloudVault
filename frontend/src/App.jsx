import { createBrowserRouter, RouterProvider } from "react-router" 
import Home from './components/Home.jsx'
import RootLayout from './components/RootLayout.jsx'
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Profile from './components/Profile.jsx'


function App() {
  const routerobj = createBrowserRouter([
    // Public routes (Marketing pages)
    {
      path: '/',
      element: <RootLayout />, 
      children: [
        { path: '', element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> }
      ]
    },
    {path: '/dashboard',element: <Dashboard />},
     { path: 'profile', element: <Profile /> },

  ])

  return <RouterProvider router={routerobj} />
}

export default App
