import express, { urlencoded }  from "express";
import path from "path";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import {Server} from 'socket.io'
import {createServer} from 'http'
import cookieParser from "cookie-parser";
import rideRoute from './routes/rides.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import profileRoute from './routes/profile.js'
import chatRoute from './routes/chat.js'
import linkTextRoute from './routes/linktext.js'
import { saveChatInfo } from "./Controllers/chatController.js";
import { sendEmail } from "./Controllers/emailVerify.js";
import User from "./models/User.js";
import { verifyAdmin } from "./utils/verifyToken.js";
dotenv.config()
const app = express()
const httpServer=createServer(app)
const io=new Server(httpServer,{
   cors:{
      origin:true,
      credentials:true
   }
})
const myNamespace = io.of("/myNamespace");
myNamespace.on('connection', (socket)=>{
   console.log("connected")
   
   socket.on("sendMessage", (data) => {
      let targetSocket=null
      const {sender, receiver, rideId} = socket.handshake.query;
      const roomId=`${receiver}${rideId}`
      socket.join(roomId)
      for(const newSocket of myNamespace.sockets.values()){
         if((newSocket.handshake.query.sender===receiver)&&(newSocket.handshake.query.rideId===rideId)){
            targetSocket=newSocket
            targetSocket.join(roomId)
            break
         }
      }
      myNamespace.to(roomId).emit("message",{receiver:receiver,sender:sender,text:data.text,rideId:rideId});
      if(!targetSocket){
         saveChatInfo({receiver:receiver,sender:sender,text:data.text,rideId:rideId})
         sendEmail({sender:sender,receiver:receiver,message:data.text})
      }
   });
   socket.on('disconnect',(socket)=>{
      console.log(`Socket disconnected`)
   })
})
const port = process.env.PORT || 8000
const corsOptions = {
   origin: true,
   credentials: true,
}

mongoose.set("strictQuery", false)
const connect = async() => {
   try {
      await mongoose.disconnect()
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      console.log('mongodb connected!')
      return "Successfully connected"
   } catch (error) {
      console.log('error: ', error);
      return "That atlas database couldn't fine.Please retype all initailize fields"
   }
}
const createSeed=async()=>{
   try{
      let adminData=await User.findOne({role:"admin"})
      if(!adminData){
         const salt = bcrypt.genSaltSync(10)
         const hash = bcrypt.hashSync("qwe123!@#", salt)
         adminData=new User({
            email:"eu.hopcar@gmail.com",
            firstname: "steve",
            lastname:"horvat",
            birthday:"1984-10-04",
            gender:"Mr",
            password: hash,
            phonenumber:"+385 994643517",
            role:"admin"
         })
         await adminData.save()
      }
      console.log("created seed")
   }catch(err){
      console.log(err)
   }
   
}
app.use(express.json())
app.use(express.urlencoded())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.static('assets'));
app.use(express.static(process.cwd()+"\/build"));
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/rides", rideRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/search",rideRoute)
app.use("/api/v1/profile",profileRoute)
app.use('/api/v1/chat',chatRoute)
app.use('/api/v1/linktext',linkTextRoute)
app.post('/api/v1/changeDatabaseSetting',verifyAdmin,async(req,res)=>{
   const {host,database,username,password}=req.body
   process.env.MONGO_URI=`mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`
   const result=await connect()
   await createSeed()
   res.json({message:result})
})
httpServer.listen(port, async () => {

   const result=await connect();
   await createSeed()
   console.log('server listening on port', port)
})