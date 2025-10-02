import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/dbConfig.js";
import userModel from './models/userModel.js'
import bycrypt from 'bcryptjs'
import cors from 'cors';
import jwt from 'jsonwebtoken'
import verifyAuth from "./middleware/authmiddleware.js";
import chatModel from "./models/chatModel.js";
import multer from "multer";
import cloudImage from "./cloudinary.js";
import cookieParser from "cookie-parser";
import msgModel from './models/messageModel.js'

import serverHttp from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load env variables
dotenv.config({ path: "./config.env" });
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(cors({
    origin: ['http://localhost:5173',"https://your-frontend.netlify.app"], // frontend URL
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']               // if you want to send cookies/auth headers
}));

const server = serverHttp.createServer(app);

const io = new SocketIOServer(server, {
    cors: {
        origin: ["http://localhost:5173","https://your-frontend.netlify.app"], // your frontend URL
        methods: ["GET", "POST"],
        credentials: true, // if you need to send cookies or headers
    },
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));





const onlineUser = []

io.on('connection', (socket) => {

    socket.on('join-room', userid => {
        socket.join(userid);

    });
    socket.on('send-message', (message) => {

        io
            .to(message.members[0])
            .to(message.members[1])
            .emit('receive-message', message)

        io
            .to(message.members[0])
            .to(message.members[1])
            .emit('set-message-count', message)

    });
    socket.on('clear-unread-message', (data) => {
        io
            .to(data.members[0])
            .to(data.members[1])
            .emit('message-count-cleared', data)
    })

    socket.on('user-typing', (data) => {
        io
            .to(data.members[0])
            .to(data.members[1])
            .emit('started-typing', data)
    })
    socket.on('user-login', userId => {
        if (!onlineUser.includes(userId)) {
            onlineUser.push(userId);
        }
        // io.emit('online-users', onlineUser);
        socket.emit('online-users', onlineUser);
    });
    socket.on('user-offline', userId => {
        onlineUser.splice(onlineUser.indexOf(userId), 1);
        io.emit('online-user-updated', onlineUser)
    })

});



// Connect to DB
connectDB();

app.use(express.json());

//sinup  
app.post("/api/singup", async (req, resp) => {

    try {
        const users = await userModel.findOne({ email: req.body.email })
        if (users) {

            return resp.send({
                message: "User already exists",
                success: false

            })
        }

        const hashpass = await bycrypt.hash(req.body.password, 10);
        req.body.password = hashpass;

        const newuser = new userModel(req.body)
        await newuser.save()
        resp.send({
            message: "User created successfully",
            success: true

        })
    } catch (error) {
        resp.send({
            message: error.message,
            success: false

        })

    }
})

// login


app.post("/api/login", async (req, resp) => {
    try {
        const users = await userModel.findOne({ email: req.body.email }).select("+password");
        if (!users) {
            return resp.send({
                message: "User does not exist",
                success: false
            });
        }

        const pass = await bycrypt.compare(req.body.password, users.password);
        if (!pass) {
            return resp.send({
                message: "Invalid password",
                success: false
            });
        }

        const authToken = jwt.sign({ userId: users._id }, process.env.SECRET_KEY, { expiresIn: '2d' });

        resp.send({
            message: "User Login successfully",
            success: true,
            token: authToken
        });
    } catch (error) {
        resp.send({
            message: error.message,
            success: false
        });
    }
});



//user login


app.get("/user/logedin", verifyAuth, async (req, resp) => {

    try {
        const users = await userModel.findOne({ _id: req.userId });

        // resp.send("User Login")

        resp.send({
            message: "Fetch successfully",
            success: true,
            data: users

        })

    } catch (error) {
        resp.send({
            message: error.message,
            success: false

        })
    }

})

// all user feath

app.get("/user/alluser", verifyAuth, async (req, resp) => {

    try {

        const Allusers = await userModel.find({ _id: { $ne: req.userId } });

        // resp.send("User Login")

        resp.send({
            message: " All user Fetch successfully",
            success: true,
            data: Allusers

        })

    } catch (error) {
        resp.send({
            message: error.message,
            success: false

        })
    }

})

app.post('/upload-profile-pic', verifyAuth, upload.single('profilePic'), async (req, resp) => {

    try {

        const file = req.file;
        if (!file) {
            return resp.status(400).send({
                message: "No image file uploaded",
                success: false
            });
        }
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const UploadedimageUrl = await cloudImage.uploader.upload(base64Image, {
            folder: 'Chat_App'
        })
        const user = await userModel.findByIdAndUpdate(
            { _id: req.userId },
            { profilePic: UploadedimageUrl.secure_url },
            { new: true }
        )
        resp.send({
            message: "Profile Pic updated Successfully",
            success: true,
            data: user

        })

    } catch (error) {

        resp.send({
            message: error.message,
            success: false
        })
    }
})

app.post("/chat/create", verifyAuth, async (req, resp) => {

    try {
        const chat = new chatModel(req.body);
        const savechat = await chat.save();
        // console.log(savechat)
        resp.send({
            message: "chat Created Successfully",
            success: true,
            data: savechat
        })

    } catch (error) {

        resp.send({
            message: error.message,
            success: false

        })
    }
})


app.get("/chat/get-all-chats", verifyAuth, async (req, resp) => {

    try {
        const AllChat = await chatModel.find({ members: { $in: req.userId } }).populate('members')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });



        // console.log(AllChat)
        resp.send({
            message: "  all  chat Successfully",
            success: true,
            data: AllChat
        })

    } catch (error) {

        resp.send({
            message: error.message,
            success: false

        })
    }
})


app.post("/message/new-message", verifyAuth, async (req, resp) => {

    try {
        const newMsg = new msgModel(req.body);
        const saveMsg = await newMsg.save()




        const currentChat = await chatModel.findOneAndUpdate({
            _id: req.body.chatId
        }, {
            lastMessage: saveMsg._id,
            $inc: { unreadMessage: 1 }
        })

        // console.log(saveMsg).
        resp.send({
            message: " Massage  send  Successfully",
            success: true,
            data: saveMsg
        })

    } catch (error) {

        resp.send({
            message: error.message,
            success: false

        })
    }
})


app.get("/message/get-all-message/:chatId", verifyAuth, async (req, resp) => {
    try {

        const allmsg = await msgModel.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });

        // console.log(allmsg)
        resp.send({
            message: "Message fetched successfully",
            success: true,
            data: allmsg
        })

    } catch (error) {

        resp.send({
            message: error.message,
            success: false

        })
    }
})

app.post("/clear-unread-messages", verifyAuth, async (req, resp) => {

    try {

        const chatId = req.body.chatId;

        const chat = await chatModel.findById(chatId)

        if (!chat) {
            resp.send({
                message: "No Chat found with the given chat",
                success: false
            })
            return;
        }

        const updatedChat = await chatModel.findByIdAndUpdate(
            chatId,
            { unreadMessage: 0 },
            { new: true }).populate('members').populate('lastMessage');


        await msgModel.updateMany(
            { chatId: chatId, read: false },
            { read: true }
        )

        resp.send({
            message: "clear read masssage successfully",
            success: true,
            data: updatedChat
        })
    } catch (error) {

        resp.send({
            message: error.message,
            success: false

        })
    }

})




server.listen(process.env.PORT_NUMBER, () => {
    console.log(`This app is listening on port: ${process.env.PORT_NUMBER}!`);
});
