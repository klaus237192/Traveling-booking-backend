import mongoose from "mongoose";
const linktextSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    comments:{
        type:String,
        required:true
    }
},{timestamps:true});
export default mongoose.model('LinkText',linktextSchema);