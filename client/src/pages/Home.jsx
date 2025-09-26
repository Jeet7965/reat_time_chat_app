import React, { useEffect, useState } from 'react'
import Header from './home/Header'

import '../assets/css/home.css'

import Sidebar from './home/sidebar'
import Chat from './home/Chat'
import { useSelector } from 'react-redux'


function Home() {
 const { selectedChat} = useSelector(state => state.userReducer)

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