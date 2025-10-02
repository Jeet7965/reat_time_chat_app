import React, { useEffect, useState } from 'react'
import Header from './homePage/Header'
import '../assets/css/home.css'
import Sidebar from '../homePage/Asidebar'
import Chat from './homePage/Chat'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const socket = io('https://real-chat-app-58ba.onrender.com', {
    transports: ["websocket", "polling"]
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});
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
    }, [user, onlineUser]);

    return (
        <>
            <Header socket={socket}></Header>
            <div className="home-page">
                <div className={`sidebar ${selectedChat ? 'hide-on-mobile' : 'show'}`}>
                    <Sidebar socket={socket} onlineUser={onlineUser} />
                </div>

                <div className={`main-chat ${selectedChat ? 'show' : 'hide-on-mobile'}`}>
                    <Chat
                        socket={socket}
                        onBack={() => window.dispatchEvent(new Event('back-to-sidebar'))}
                    />
                </div>
            </div>
        </>
    )
}

export default Home
