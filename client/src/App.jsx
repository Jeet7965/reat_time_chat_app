import { useState } from 'react'

import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Singup from './pages/Singup'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>react project</h1>
      <Home></Home>
      <Login></Login>
      <Singup></Singup>
    </>
  )
}

export default App
