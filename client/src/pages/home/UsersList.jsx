import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllChats, setSelectedChats } from "../../redux/userSlice.js";
import toast from 'react-hot-toast';
import store from '../../redux/store.js';
import { createNewChat } from "../../apiCalls/chat.js";
import moment from 'moment';

function UsersList({ searchKey, socket, onlineUser }) {

    const { allUsers, allChats, user: CurrentUser, selectedChat } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()



    useEffect(() => {
        socket.off('set-message-count').on('set-message-count', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            let allChats = store.getState().userReducer.allChats;

            // Check if the message is in a chat that's not selected
            if (selectedChat?._id !== message.chatId) {
                // Update unread message count and last message
                const updatedChats = allChats.map(chat => {
                    if (chat._id === message.chatId) {
                        return {
                            ...chat,
                            unreadMessage: (chat?.unreadMessage || 0) + 1,
                            lastMessage: message,
                        };
                    }
                    return chat;
                });

                allChats = updatedChats;
            }

            // Reorder chats so that the latest chat appears at the top
            const latestChat = allChats.find(chat => chat._id === message.chatId);
            const otherChats = allChats.filter(chat => chat._id !== message.chatId);
            allChats = [latestChat, ...otherChats];

            // Dispatch updated chat list
            dispatch(setAllChats(allChats));
        });
    }, []);



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
        // console.log("User:", userId, "Chat:", chat);
        if (!chat || !chat.lastMessage) {
            return null
        } else {

            const msgPrefix = chat?.lastMessage?.sender === CurrentUser._id ? "You: " : " "
            return msgPrefix + chat?.lastMessage?.text?.substring(0, 20);

        }
    }

    function getLastMessageTime(userId) {
        // Find the chat where the user is a member
        const chat = allChats.find(chat =>
            chat.members.some(member => member._id === userId)
        );

        // If no chat or no last message, return null
        if (!chat || !chat.lastMessage) {
            return null;
        }
        // Format the time or date
        const msgTime = moment(chat?.lastMessage?.createdAt);
        const today = moment();

        if (msgTime.isSame(today, 'day')) {
            return msgTime.format('hh:mm A'); // e.g., 02:45 PM
        } else {
            return msgTime.format('MMM DD');  // e.g., Sep 28
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
                    (allChats.some(chat => chat.members.map(m => m._id).includes(userItem._id)))
            }).map(obj => {
                let userItem = obj;
                if (obj.members) {
                    userItem = obj.members.find(mem => mem._id !== CurrentUser._id)
                }
                return (

                    <div className="user-card" key={userItem._id} onClick={() => openChat(userItem._id)}>
                        <div className={`user-info ${IsSelectedChat(userItem) ? "selected-user" : ""}`}>
                            <div className="user-profile">
                                {userItem.profilePic ? (
                                    <img
                                        src={userItem.profilePic}
                                        alt="profilepic"
                                        className={onlineUser.includes(userItem._id) ? " online-status"  : {}}
                                    />
                                ) : (
                                    <div
                                        className={onlineUser.includes(userItem._id) ? " online-status" :"full-name"}
                                    >
                                        {userItem.firstname.charAt(0).toUpperCase() +
                                            userItem.lastname.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="user-details">
                                <div className="left">
                                    <div className="name">{userItem.firstname} {userItem.lastname}</div>
                                    <div className="lastmsg">{getLastMessage(userItem._id) || userItem.email}</div>
                                </div>
                                <div className="right">
                                    <div className="read">
                                        {getUnreadMsg(userItem._id) ? getUnreadMsg(userItem._id) : ""}
                                    </div>
                                    <div className="lastmsgtime">{getLastMessageTime(userItem._id)}</div>
                                </div>
                            </div>


                            <div>
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
                        </div>
                    </div>

                )
            })

    )
}

export default UsersList