import React, { useEffect, useState } from 'react'
import Header from './home/Header'
import '../assets/css/home.css'
import Sidebar from './home/sidebar'
import Chat from './home/Chat'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3200');
function Home() {
    const { selectedChat, user } = useSelector(state => state.userReducer)
    
    useEffect(() => {
        

        if (user && user._id) {
            socket.emit('join-room', user._id);
        }
    }, [user]);

    return (
        <>
            <Header></Header>
            <div className="home-page">
                <Sidebar socket={socket} ></Sidebar>
                <hr />
                <Chat socket={socket}></Chat>
            </div>
        </>
    )
}

export default Home