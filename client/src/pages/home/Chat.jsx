import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createNewMessage, getAllMessage } from '../../apiCalls/message.js';
// import { getAllMessage } from '../../apiCalls/message.js';
import { ClearUnreadmassage } from '../../apiCalls/chat.js';
import moment from 'moment';
import toast from 'react-hot-toast';

function Chat() {
  const { selectedChat, user, allChats } = useSelector(state => state.userReducer);
  const [message, setMessage] = useState("");
  const [Allmessage, setAllMessage] = useState([]);

  // Fetch messages when selectedChat changes
  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      getMessage();
 ClearUnreadMsg();
    }
    // if (selectedChat?.lastMessage?.sender!== user._id) {
     
    // }
  }, [selectedChat]);

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
      console.log("Response from server:", response);

      if (response.success) {
        setAllMessage(response.data);
      } else {
        toast.error(response.message || "Messages could not be retrieved.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }

  async function ClearUnreadMsg() {
    try {
      const response = await ClearUnreadmassage(selectedChat._id);
      console.log("Response from server:", response);

      if (response.success) {
        const updatedChats = allChats.map(chat => {
          if (chat._id === selectedChat._id) {
            return response.data; // Update chat with the latest data
          }
          return chat;
        });
      } else {
        toast.error(response.message || "Messages could not be clear .");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }

  // Send a new message
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
      console.log("Sending message payload:", newMessage);
      const response = await createNewMessage(newMessage);
      console.log("Response from server:", response);

      if (response.success) {
        setMessage(""); // Clear the input field
      } else {
        toast.error(response.message || "Message not sent.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }

  // Format timestamp for message display
  const formatTime = (timestamp) => {
    const time = moment.utc(timestamp).local(); // Convert to local time
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
        <div className="chat-messages" id="chat-messages">
          {Allmessage.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            Allmessage.map((msg) => {
              const isCurrentSender = msg.sender === user._id;
              return (
                <div key={msg._id}>
                  <div className={`message ${isCurrentSender ? 'outgoing' : 'incoming'}`}>
                    {msg.text}
                  </div>
                  <div className="timestamp">{formatTime(msg.createdAt)}
                    <div>
                      {isCurrentSender && msg.read &&<p>seen</p> }

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
