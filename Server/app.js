import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/dbConfig.js";
import userModel from './models/userModel.js'
import bycrypt from 'bcryptjs'
import cors from 'cors';
import jwt from 'jsonwebtoken'
import verifyAuth from "./middleware/authmiddleware.js";
import chatModel from "./models/chatModel.js";

import msgModel from './models/messageModel.js'

// Load env variables



const app = express();

dotenv.config({ path: "./config.env" });

app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true               // if you want to send cookies/auth headers
}));

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
                message: "User does not exists",
                success: false

            })
        }
        const pass = await bycrypt.compare(req.body.password, users.password);
        if (!pass) {
            return resp.send({
                message: "Ivailid password",
                success: false

            })
        }
        const authToken = jwt.sign({ userId: users._id }, process.env.SECRET_KEY, { expiresIn: '2d' })
        resp.send({
            message: "User Login successfully",
            success: true,
            token: authToken

        })
    } catch (error) {
        resp.send({
            message: error.message,
            success: false

        })

    }


})

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



app.post("/chat/create", verifyAuth, async (req, resp) => {

    try {
        const chat = new chatModel(req.body);
        const savechat = await chat.save();
        console.log(savechat)
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
            .sort({ updateAt: -1 });

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

app.post("/clear-unread-messages", verifyAuth, async (req,resp) => {

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
            {chatId:chatId,read:false},
            { read:true}
        )

        resp.send({
            message:"clear read masssage successfully",
            success:true,
            data:updatedChat
        })
    } catch (error) {

        resp.send({
            message: error.message,
            success: false

        })
    }

})

app.listen(process.env.PORT_NUMBER, () => {
    console.log(`This app is listening on port: ${process.env.PORT_NUMBER}!`);
});
