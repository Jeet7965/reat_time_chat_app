import { useState } from 'react'

import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Singup from './pages/Singup'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'
import ProtectRoute from './Protect/protectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position="top-center"reverseOrder={false}/>


    <BrowserRouter>
    <Routes>
      <Route path='' element={<ProtectRoute><Home/></ProtectRoute>}/>
      <Route path='/singup' element={<Singup/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
