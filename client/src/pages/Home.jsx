import React, { useEffect, useState } from 'react'
import Header from './home/Header'

import '../assets/css/home.css'

import Sidebar from './home/sidebar'
import Chat from './home/Chat'


function Home() {
    return (
        <>
            <Header></Header>
            <div className="home-page">
                <Sidebar></Sidebar>
                <hr />

                <Chat></Chat>
            </div>


        </>
    )
}

export default Home