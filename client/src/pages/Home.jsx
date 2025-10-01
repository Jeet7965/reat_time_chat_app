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

    const [onlineUser, setOnlineUsers] = useState([])
    useEffect(() => {


        if (user && user._id) {
            socket.emit('join-room', user._id);
            socket.emit('user-login', user._id)
            socket.on('online-users', onlineusers => {
                setOnlineUsers(onlineusers)
            })
            socket.on('online-user-updated', onlineusers => {
                setOnlineUsers(onlineusers)
            })
        }
    }, [user,onlineUser]);

    return (
        <>
            <Header socket={socket}></Header>
            <div className="home-page">
                <div className='sidebar'>
                    <Sidebar socket={socket} onlineUser={onlineUser} ></Sidebar>
                </div>
                <hr />
                <div className='main-chat'>
                    <Chat socket={socket}></Chat>
                </div>
            </div>
        </>
    )
}

export default Home