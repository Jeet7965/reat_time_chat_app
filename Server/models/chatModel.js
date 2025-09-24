import mongoose from "mongoose";

const chatSchema= new mongoose.Schema({
members:{
    type:[
        {type:mongoose.Schema.Types.ObjectId,ref:"users"}
    ]
},
lastMessage:{
    type:mongoose.Schema.Types.ObjectId,ref:"messges"
},
unreadMessage:{
    type:Number,
    default:0
}

},{timestamps:true})

export default mongoose.model("chats",chatSchema);