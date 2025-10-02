export const createNewMessage = async (message) => {
  try {
    const resp = await fetch("https://real-chat-app-58ba.onrender.com/message/new-message", {
      method: "POST",
      body: JSON.stringify({ ...message }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include"
    });

    let result = {};
    try {
      result = await resp.json(); 
    } catch (e) {
      // const text = await resp.text(); // fallback
      result = { success: false|| "Invalid JSON from server" };
    }

    return result;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllMessage = async (chatId) => {
  try {
    const resp = await fetch(`https://real-chat-app-58ba.onrender.com/message/get-all-message/${chatId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include"
    });

    let result = {};
    try {
      result = await resp.json(); // ✅ attempt to parse
    } catch (e) {
      const text = await resp.text(); // fallback
      result = { success: false, message: text || "Invalid JSON from server" };
    }

    return result;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
