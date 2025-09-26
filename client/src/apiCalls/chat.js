
export const createNewChat = async (members) => {
  try {
    const resp = await fetch("http://localhost:3200/chat/create", {
      method: "POST",
      body: JSON.stringify({ members }), // send members in body
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include"
    });

    const result = await resp.json(); // await here
    return result; // return the whole result, not just result.data
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const ClearUnreadmassage = async (chatId) => {
  try {
    const resp = await fetch("http://localhost:3200/clear-unread-messages", {
      method: "POST",
      body: JSON.stringify({chatId:chatId}), // send members in body
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include"
    });

    const result = await resp.json(); // await here
    return result; // return the whole result, not just result.data
  } catch (error) {
    return { success: false, message: error.message };
  }
};


