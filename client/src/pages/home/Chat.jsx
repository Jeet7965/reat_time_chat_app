import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { createNewMessage } from '../../apiCalls/message'

import toast from 'react-hot-toast'
function Chat() {
  const { selectedChat, user } = useSelector(state => state.userReducer)

  const [message, setMessage] = useState(" ")


  if (!selectedChat || !selectedChat.members) {
    return <div className="no-chat">Please select a chat to start messaging.</div>
  }

  const selectedUser = selectedChat.members.find(u => u._id !== user._id)


  async function sendMessage() {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Message cannot be empty.");
      return;
    }
    try {
      const newMessage = {
        chatId: selectedChat._id, // ✅ key fix
        chat: selectedChat._id,
        sender: user._id,
        text: trimmedMessage
      };
      console.log("Sending message payload:", newMessage);
      const response = await createNewMessage(newMessage);
      console.log("Response from server:", response);

      if (response.success) {
        // toast.success(response.message);
        setMessage("");
      } else {
        toast.error(response.message || "Message not sent");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  }


  return (
    <div className='app-chat-area'>
      <div className="chat-area-hearder">
        <h3>{selectedUser?.firstname + " " + selectedUser?.lastname}</h3>
      </div>

      <div className="chat-messages">
        <div className="message incoming">Hello!</div>
        <div className="message outgoing">Hi, how are you?</div>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} >Send</button>
      </div>
    </div>

  )
}

export default Chat
