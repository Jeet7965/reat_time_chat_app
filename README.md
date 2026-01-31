# Real-Time Chat Application (MERN + Socket.IO)

This is a real-time chat application built using the MERN stack with Socket.IO.  
It allows users to communicate instantly with live message updates using WebSockets.

The project focuses on real-time communication, authentication, and scalable backend architecture.

---

## 🚀 Features

- User registration and login
- Real-time messaging using Socket.IO
- One-to-one chat support
- Online/offline user status
- Secure authentication using JWT
- MongoDB for message and user storage
- REST APIs combined with WebSocket communication

---

## 🛠 Tech Stack

**Frontend**
- React.js
- HTML5, CSS3, JavaScript

**Backend**
- Node.js
- Express.js
- Socket.IO

**Database**
- MongoDB (Mongoose)

**Tools & Libraries**
- JWT (Authentication)
- bcrypt (Password hashing)
- dotenv (Environment variables)
- Socket.IO (Real-time communication)

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/real-time-chat-app.git
cd real-time-chat-app/backend
2️⃣ Install Dependencies
npm install
3️⃣ Environment Variables (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4️⃣ Run the Server
npm start
Server will run at:

http://localhost:5000
📡 API Highlights
POST /api/auth/register – Register new user

POST /api/auth/login – User login

GET /api/chat/users – Get chat users

GET /api/chat/messages/:id – Get messages

POST /api/chat/send – Send message

🔌 Real-Time Socket Events
connection – User connects

join_room – Join chat room

send_message – Send message in real time

receive_message – Receive live message

disconnect – User disconnects

🎯 Learning Outcomes
WebSocket communication using Socket.IO

Real-time data handling

MERN stack integration

Authentication with JWT

Scalable chat architecture

REST API + Socket.IO combination


## 📂 Project Structure

real_time_chat_app/
│
├── backend/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ │
│ ├── controllers/
│ │ ├── authController.js # User authentication logic
│ │ └── chatController.js # Chat & message handling
│ │
│ ├── models/
│ │ ├── userModel.js # User schema
│ │ └── messageModel.js # Message schema
│ │
│ ├── routes/
│ │ ├── authRoutes.js # Auth routes
│ │ └── chatRoutes.js # Chat routes
│ │
│ ├── socket/
│ │ └── socket.js # Socket.IO configuration
│ │
│ ├── middleware/
│ │ └── authMiddleware.js # JWT authentication middleware
│ │
│ ├── index.js # Server entry point
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Chat pages
│ │ ├── context/ # Global state / context
│ │ ├── services/ # API calls
│ │ ├── App.js
│ │ └── main.jsx
│ │
│ └── package.json
│
├── .gitignore
└── README.md

## 📂 Project Structure

