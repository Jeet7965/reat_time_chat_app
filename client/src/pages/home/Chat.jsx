import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, getAllMessage } from '../../apiCalls/message.js';
import { v4 as uuidv4 } from 'uuid';
import store from '../../redux/store.js'
import { ClearUnreadmassage } from '../../apiCalls/chat.js';
import moment from 'moment';
import toast from 'react-hot-toast';
import { setAllChats,clearSelectedChat } from '../../redux/userSlice.js';

import EmojiPicker from 'emoji-picker-react'

function Chat({ socket }) {
  const { selectedChat, user, allChats } = useSelector(state => state.userReducer);
  const [message, setMessage] = useState("");
  const [Allmessage, setAllMessage] = useState([]);
  const [istyping, setTyping] = useState(false)
  const [showEmoji, setShowEmolji] = useState(false)


  const dispatch = useDispatch()
  const msgContainerRef = useRef(null);
  // Fetch messages when selectedChat changes

  const isMobile = window.innerWidth <= 768

  useEffect(() => {
    const handleBack = () => {
      dispatch(clearSelectedChat());
    };

    window.addEventListener('back-to-sidebar', handleBack);
    return () => window.removeEventListener('back-to-sidebar', handleBack);
  }, []);


  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      getMessage();
      ClearUnreadMsg();
    }
    socket.off('receive-message').on('receive-message', data => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (selectedChat?._id === data.chatId) {

        setAllMessage(prevmsg => [...prevmsg, data])
      }
      if (selectedChat?._id === message.chatId && message.sender !== user._id) {
        ClearUnreadMsg();
      }
    })

    socket.on('message-count-cleared', data => {
      const selectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;


      if (selectedChat?._id === data.chatId) {
        // Updating unread msg count in chat obj

        const updatedChat = allChats.map(chat => {
          if (chat._id === data.chatId) {

            return { ...chat, unreadmessage: 0 }
          }
          return chat
        })
        dispatch(setAllChats(updatedChat));
        // Updating read msg proprty in msg onj
        setAllMessage(prevmsg => {
          return prevmsg.map(msg => {
            return { ...msg, read: true }
          })
        })
      }

    })

    socket.on('started-typing', (data) => {

      if (selectedChat?._id === data.chatId && data.sender !== user._id) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
        }, 2000)
      }
    });


  }, [selectedChat]);


  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [Allmessage, istyping]);


  // If no selected chat, show a prompt
  if (!selectedChat || !selectedChat.members || selectedChat.members.length === 0) {
    return (
      <div className="no-chat">
        <p>Please select a chat to start messaging.</p>
      </div>
    );
  }

  // Get the selected user (the one we're chatting with)
  const selectedUser = selectedChat.members.find(u => u._id !== user._id);

  // Fetch messages from the API
  async function getMessage() {
    try {
      const response = await getAllMessage(selectedChat._id);


      if (response.success) {
        setAllMessage(response.data);
      } else {
        toast.error(response.message || "Messages could not be retrieved.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }

  async function sendMessage(image) {
    const trimmedMessage = message.trim();
    // if (!trimmedMessage) {
    //   toast.error("Message cannot be empty.");
    //   return;
    // }
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: trimmedMessage,
        image: image
      };
      const createdAt = moment().toISOString();
      socket.emit('send-message', {
        ...newMessage,
        members: selectedChat.members.map(m => m._id),
        read: false,
        createdAt: createdAt
      });

      const response = await createNewMessage(newMessage);

      if (response.success) {
        setMessage(""); // Clear the input field
        setShowEmolji('')

        // Reorder chats so that the latest chat appears at the top
        let updatedChats = [...allChats];
        const latestChat = updatedChats.find(chat => chat._id === selectedChat._id);
        updatedChats = updatedChats.filter(chat => chat._id !== selectedChat._id);
        updatedChats = [latestChat, ...updatedChats];

        dispatch(setAllChats(updatedChats)); // Update the Redux store
      } else {
        toast.error(response.message || "Message not sent.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }



  async function ClearUnreadMsg() {
    try {
      socket.emit('clear-unread-message', {
        chatId: selectedChat._id,
        members: selectedChat.members.map(m => m._id)
      });

      const response = await ClearUnreadmassage(selectedChat._id);
      if (response.success) {
        const updatedChats = allChats.map(chat => {
          if (chat._id === selectedChat._id) {
            return response.data; // Update chat with the latest data
          }
          return chat;
        });
        dispatch(setAllChats(updatedChats)); // Update the Redux store with the cleared unread message count
      } else {
        toast.error(response.message || "Failed to clear unread messages.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }
  // Format timestamp for message display
  const formatTime = (timestamp) => {
    const time = moment.utc(timestamp).local(); // Convert the timestamp to local time
    const now = moment(); // Current time
    const diffInDays = now.diff(time, 'days'); // Difference in days between now and the message time

    // If the message was sent today
    if (diffInDays === 0) {
      return `Today ${time.format("hh:mm A")}`;
    }

    // If the message was sent yesterday
    if (diffInDays === 1) {
      return `Yesterday ${time.format("hh:mm A")}`;
    }

    // For messages sent on other days, show the full date
    return time.format("MM DD , hh:mm A");
  };
  async function sendImage(e) {
    const file = e.target.files[0]
    const reader = new FileReader(file)
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      sendMessage(reader.result);
    }

  }

  return (
    <div className="chat-container">

      <div className="app-chat-area">
        <div className="chat-area-header">

          <div className='chat-header-title'>
            {
              selectedUser.profilePic ? (
                <img src={selectedUser.profilePic} className="chat-profile" alt="profilepic" />
              ) : (
                <div className="flname">
                  {selectedUser.firstname.charAt(0).toUpperCase() + selectedUser.lastname.charAt(0).toUpperCase()}
                </div>
              )
            }
            <h3 className="chat-title">
              {selectedUser?.firstname + " " + selectedUser?.lastname}
            </h3>
          </div>
          <div className='chat-header-back-button'>
            {isMobile && (
              <button onClick={() => dispatch(clearSelectedChat())} className="back-button">← Back</button>
            )}
          </div>
        </div>
        <div className="chat-messages" ref={msgContainerRef} id="main-chat-area">
          {Allmessage.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            Allmessage.map((msg) => {
              const isCurrentSender = msg.sender === user._id;
              return (
                <div key={msg._id || uuidv4()}>
                  <div className={`message ${isCurrentSender ? 'outgoing' : 'incoming'}`}>
                    <div>{msg.text}</div>
                    <div>{msg.image && <img src={msg.image} alt='image' height="120px" width="120px"></img>}</div>
                  </div>
                  <div className="timestamp">{formatTime(msg.createdAt)}
                    <div>
                      {isCurrentSender && msg.read && <p>seen</p>}

                    </div>
                  </div>

                </div>
              );
            })
          )}

          <div>{istyping && selectedChat.members.map(m=>m._id).includes(data?.sender) && <i>typing....</i>}</div>
        </div>
        {
          showEmoji &&
          <div>
            <EmojiPicker onEmojiClick={(e) => setMessage(message + e.emoji)}></EmojiPicker>
          </div>
        }
        <div className="chat-input">
          <input
            type="text"
            id="message-input"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              socket.emit('user-typing', {

                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id), // User IDs
                sender: user._id
              })
            }
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="focus:ring-2 focus:ring-teal-500 transition-all duration-200"
          />

          <button
            className='fa fa-send-o'
            onClick={() => sendMessage('')} id="send-button">

          </button>
          <button

            className="fa fa-smile-o"
            aria-hidden="true"

            onClick={() => setShowEmolji(!showEmoji)} id="send-button">

          </button   >
          <label htmlFor="file">
            <i className='fa fa-picture-o button' ></i>
            <input type="file" id='file'
              style={{ display: "none" }}
              accept='image/jpg,image/png,image/jpeg,image/gif'

              onChange={sendImage}

            />
          </label>


        </div>
      </div>
    </div>

  );
}

export default Chat;
