import { useState } from 'react'

import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Singup from './pages/Singup'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'
import ProtectRoute from './Protect/protectedRoute'
import Loader from './Protect/loader'
import { useSelector } from 'react-redux'


function App() {
  const { loader } = useSelector(state => state.loaderReducer)

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {
        loader && <Loader></Loader>
      }
      <BrowserRouter>
        <Routes>
          <Route path='' element={<ProtectRoute><Home /></ProtectRoute>} />
          <Route path='/singup' element={<Singup />} />
          <Route path='/login' element={<Login />} />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
