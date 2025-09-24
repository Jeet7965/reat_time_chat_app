import mongoose from "mongoose";

const msgSchema = mongoose.Schema({
    chatId:{
       type: mongoose.Schema.Types.ObjectId,ref:"chats"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,ref:"users"
    },
    text:{
        type:String,
        require:true
    },
    read:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model("messages",msgSchema);