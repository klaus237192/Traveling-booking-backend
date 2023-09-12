import Chat from "../models/Chat.js"

export const getChatInfo=async(req,res)=>{
    const {receiver}=req.query
    try{
        const chats=await Chat.find({receiver:receiver})
        const filterChats=chats.filter((chat)=>chat.messages[0]!=="")
        res.status(200).json({data:filterChats})
    }catch{
        res.json({message:"Something went wrong, try again"})
    }
}

export const saveChatInfo=async(data)=>{
    try{
        const chatInfo=await Chat.findOne({sender:data.sender,receiver:data.receiver,rideId:data.rideId})
        if(!chatInfo){
            const newChat=new Chat({
                sender:data.sender,
                receiver:data.receiver,
                rideId:data.rideId,
                messages:data.text
            })
            await newChat.save()
        }else if(chatInfo.messages[0]!==""){
            const messages=[...chatInfo.messages,data.text]
            await Chat.findOneAndUpdate({sender:data.sender,receiver:data.receiver,rideId:data.rideId},{messages:messages},{new:true})
        }else{
            const messages=[...chatInfo.messages,data.text]
            await Chat.findOneAndUpdate({sender:data.sender,receiver:data.receiver,rideId:data.rideId},{messages:data.text},{new:true})
        }
    }catch(err){
        console.log(err)
    }
    
}

export const clearChat=async(req,res)=>{
    const {receiver}=req.query
    try{
        await Chat.findOneAndUpdate({receiver:receiver},{messages:""},{new:true})
    }catch{
        
    }
    
}