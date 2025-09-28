import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, getAllMessage } from '../../apiCalls/message.js';
import { v4 as uuidv4 } from 'uuid';
import store from '../../redux/store.js'
import { ClearUnreadmassage } from '../../apiCalls/chat.js';
import moment from 'moment';
import toast from 'react-hot-toast';
import { setAllChats } from '../../redux/userSlice.js';



function Chat({ socket }) {
  const { selectedChat, user, allChats } = useSelector(state => state.userReducer);
  const [message, setMessage] = useState("");
  const [Allmessage, setAllMessage] = useState([]);


  const dispatch = useDispatch()
  const msgContainerRef = useRef(null);
  // Fetch messages when selectedChat changes
  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      getMessage();
      ClearUnreadMsg();

      socket.off('receive-message').on('receive-message', data => {
        const selectedChat = store.getState().userReducer.selectedChat;
        if (selectedChat._id === data.chatId) {

          setAllMessage(prevmsg => [...prevmsg, data])
        }
        if (selectedChat._id === message.chatId && message.sender !== user._id) {
          ClearUnreadMsg();
        }
      })
      socket.on('message-count-cleared', data => {
        const selectedChat = store.getState().userReducer.selectedChat;
        const allChats = store.getState().userReducer.allChats;


        if (selectedChat._id === data.chatId) {
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
    }

  }, [selectedChat]);


  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [Allmessage]);


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


  // async function ClearUnreadMsg() {
  //   try {
  //     socket.emit('clear-unread-message', {
  //       chatId: selectedChat._id,
  //       members: selectedChat.members.map(m => m._id)
  //     })
  //     const response = await ClearUnreadmassage(selectedChat._id);
  //     if (response.success) {
  //       const updatedChats = allChats.map(chat => {
  //         if (chat._id === selectedChat._id) {
  //           return response.data; // Update chat with the latest data
  //         }
  //         return chat;
  //       });
  //     } else {
  //       toast.error(response.message || "Messages could not be clear .");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.error || error.message);
  //   }
  // }






  // Send a new message


  
  // async function sendMessage() {
  //   const trimmedMessage = message.trim();
  //   if (!trimmedMessage) {
  //     toast.error("Message cannot be empty.");
  //     return;
  //   }
  //   try {
  //     const newMessage = {
  //       chatId: selectedChat._id,
  //       sender: user._id,
  //       text: trimmedMessage,
  //     };
  //     const createdAt = moment().toISOString();
  //     socket.emit('send-message', {
  //       ...newMessage,
  //       members: selectedChat.members.map(m => m._id),
  //       read: false,
  //       createdAt: createdAt
  //     })

  //     const response = await createNewMessage(newMessage);


  //     if (response.success) {
  //       setMessage(""); // Clear the input field
  //     } else {
  //       toast.error(response.message || "Message not sent.");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.error || error.message);
  //   }
  // }



  //Function to clear unread messages in the chat when selected

 
 
 async function sendMessage() {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
        toast.error("Message cannot be empty.");
        return;
    }
    try {
        const newMessage = {
            chatId: selectedChat._id,
            sender: user._id,
            text: trimmedMessage,
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
    const time = moment.utc(timestamp).local(); // moment will correctly handle ISO format
    const now = moment();
    const diff = now.diff(time, 'days');

    if (diff < 1 && now.isSame(time, 'day')) {
      return `Today ${time.format("hh:mm A")}`;
    } else if (time.isSame(now.subtract(1, 'day'), 'day')) {
      return `Yesterday ${time.format("hh:mm A")}`;
    } else {
      return time.format("MM D, hh:mm A");
    }
  };


  return (
    <div className="chat-container">
      {

      }
      <div className="app-chat-area">
        <div className="chat-area-header">
          <img
            src="https://placehold.co/40x40/ffffff/000000?text=JD"
            alt="User Profile"
            className="chat-profile"
          />
          <h3 className="chat-title">
            {selectedUser?.firstname + " " + selectedUser?.lastname}
          </h3>
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
                    {msg.text}
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
        </div>

        <div className="chat-input">
          <input
            type="text"
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="focus:ring-2 focus:ring-teal-500 transition-all duration-200"
          />
          <button onClick={sendMessage} id="send-button">
            Send
          </button>
        </div>
      </div>
    </div>

  );
}

export default Chat;
