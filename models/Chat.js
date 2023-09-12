import mongoose from "mongoose";
const chatSchema=new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    rideId:{
        type:String,
        required:true
    },
    messages:{
        type:[String],
    }
},{timestamps:true});
export default mongoose.model('Chat',chatSchema);