import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllChats, setSelectedChats } from "../../redux/userSlice.js";
import toast from 'react-hot-toast';

import { createNewChat } from "../../apiCalls/chat.js";
import moment from 'moment';

function UsersList({ searchKey }) {

    const { allUsers, allChats, user: CurrentUser, selectedChat } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    if (!allUsers || allUsers.length === 0) return <p>No users found</p>


    /// create chat api in the auth apicalls/auth api
    async function StartNewChat(searchUserId) {
        try {
            const response = await createNewChat([CurrentUser._id, searchUserId]);

            if (response.success) {
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChats(newChat))
            } else {
                toast.error(response.message || "Chat creation failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.message);
        }
    }


    // open chat function  
    function openChat(selectedUserId) {
        const chat = allChats.find(chat =>
            chat.members.map(m => m._id).includes(CurrentUser._id) &&
            chat.members.map(m => m._id).includes(selectedUserId)
        );

        if (chat) {
            dispatch(setSelectedChats(chat));
        } else {
            // If no chat exists, maybe create a new one?
            // StartNewChat(selectedUserId);
        }
    }


    const IsSelectedChat = (user) => {
        if (selectedChat) {
            return selectedChat.members.map(m => m._id).includes(user._id)
        }
        else false;
    }


    function getLastMessage(userId) {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId))
        console.log("User:", userId, "Chat:", chat);
        if (!chat || !chat.lastMessage) {
            return null
        } else {

            const msgPrefix = chat?.lastMessage?.sender === CurrentUser._id ? " you " : " "
            return msgPrefix + chat?.lastMessage?.text?.substring(0, 20);

        }
    }

    function getLastMessageTime(userId) {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId))

        if (!chat && chat.lastMessage) {
            return null
        } else {
            return moment(chat?.lastMessage?.createdAt).format('hh:mm A');
           
        }
    }

    function getUnreadMsg(userId) {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));
        if (chat && chat.unreadMessage && chat.lastMessage.sender !== CurrentUser._id) {
            return chat.unreadMessage
        } else {
            return null
        }
    }

    // function getData() {
    //     if (searchKey === " ") {
    //         return allChats;
    //     }
    //     else {
    //         allUsers.filter(userItem => {
    //             const key = searchKey.toLowerCase();
    //             return (
    //                 (userItem.firstname.toLowerCase().includes(key) ||
    //                     userItem.lastname.toLowerCase().includes(key)) && key.trim())
    //         })
    //     }
    // }
   
    return (
        allUsers
            .filter(userItem => {
                const key = searchKey.toLowerCase();
                return (
                    (userItem.firstname.toLowerCase().includes(key) ||
                     userItem.lastname.toLowerCase().includes(key)) && key) ||
                         ( allChats.some(chat => chat.members.map(m => m._id).includes(userItem._id)) )
            }).map( obj => {
                  let  userItem =obj;
                  if (obj.members) {
                    userItem =obj.members.find(mem=>mem._id !==CurrentUser._id)
                  }
                return (
                    <div className="user-card" key={userItem._id} onClick={() => openChat(userItem._id)}>
                        <div className={IsSelectedChat(userItem) ? "selected-user" : "user-info"}>
                            <div className="user-profile">
                                {
                                    userItem.profilePic ? <img src={userItem.profilePic} alt="profilepic" /> :
                                        <div className="full-name">
                                            {userItem.firstname.charAt(0).toUpperCase() + userItem.lastname.charAt(0).toUpperCase()}
                                        </div>
                                }
                            </div>
                            <div className="user-details">
                                <span className="name">{userItem.firstname} {userItem.lastname}</span>
                                <span className="email">{getLastMessage(userItem._id) || userItem.email}</span>

                                <span className="email">{getLastMessageTime(userItem._id)}</span>
                                <span className="email"> {getUnreadMsg(userItem._id) ? "unread:" + getUnreadMsg(userItem._id) : " "}</span>
                            </div>

                        </div>
                        {
                            !allChats.find(chat =>
                                chat.members.map(m => m._id).includes(userItem._id)
                            ) && (
                                <button onClick={() => StartNewChat(userItem._id)} className="start-chat-btn">
                                    Start Chat
                                </button>
                            )
                        }
                    </div>
                )
            })

    )
}

export default UsersList