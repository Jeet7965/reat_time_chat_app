import React, { useEffect, useState } from 'react'
import Header from './home/Header'

import '../assets/css/home.css'

import Sidebar from './home/sidebar'

function Home() {

    const [userdata, setUserdata] = useState()


    return (
        <>
            <Header></Header>
            <div className="home-page">
                <Sidebar></Sidebar>

            </div>


        </>
    )
}

export default Home