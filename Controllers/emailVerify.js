import nodemailer from 'nodemailer'
import User from '../models/User.js'
export const sendVerifyCode =async(req,res)=>{
   const {email}=req.body
   try{
      const user=await User.findOne({email:email})
      if(user!==null){
      res.status(400).json({message:"This email is already exist"})
      }else{
         const transporter=nodemailer.createTransport({
            //host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
               user: 'klaus237192@gmail.com', // your email address
               pass: 'ucybtcwnpnlqvidw' // your email password
            },
            //tls: {rejectUnauthorized: false},
            service:'gmail'
         })
         process.env.VERIFICATION_CODE=Math.floor(100000+Math.random()*900000)
         process.env.GENERATED_TIME=Date.now()
         const mailOptions={
            from:'klaus237192@gmail.com',
            to:email,
            subject:`Your verification code is ${process.env.VERIFICATION_CODE}`,
            text:"code",
            html:`<h1>Verify your email address</h1>
                  <hr><h3><p>Please enter this 6-digit code to access our platform.</p></h3>
                  <h2>${process.env.VERIFICATION_CODE}</h2><h3><p>This code is valid for 2 minutes.</p></h3>`
         }
         await transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
               console.log(err)
               res.status(500).json({success:false,message:"Internal Server Error"})
            }else{
               res.status(200).json({success:true,message:"Email sent successfully"})
            }
         })
      }
   }catch(err){
      console.log(err)
   }
   
}

export const verifyEmail =(req,res)=>{
   const {verificationCode}=req.body
   console.log(verificationCode)
   try{
      console.log(process.env.VERIFICATION_CODE)
      if(verificationCode==process.env.VERIFICATION_CODE){
            if((Date.now()-process.env.GENERATED_TIME)<process.env.VALID_DURATION){
               res.status(200).json({success:true,data:"verifypassed"})
            }else{
               res.status(400).json({success:false,message:"This code is expired, please try again"})
            }
      }else{
            res.status(400).json({succcess:false,message:"The code is incorrect,try again"})
      }
   }catch(err){
      console.log(err)
   }
   
}
 
export const sendEmail=async({sender,receiver,message})=>{
   try{
      const receiverUser=await User.findById({_id:receiver})
      const {email}=receiverUser
      const senderUser=await User.findById({_id:sender})
      const {firstname,lastname}=senderUser
      const transporter=nodemailer.createTransport({
         //host: 'smtp.gmail.com',
         port: 587,
         secure: false, // true for 465, false for other ports
         auth: {
            user: 'klaus237192@gmail.com', // your email address
            pass: 'ucybtcwnpnlqvidw' // your email password
         },
         //tls: {rejectUnauthorized: false},
         service:'gmail'
      })
      const mailOptions={
         from:'klaus237192@gmail.com',
         to:email,
         subject:`New message from ${firstname} ${lastname}`,
         text:"code",
         html:`<h1>${firstname} sent you message</h1>
               <hr><h3>${message}</h3>`
      }
      await transporter.sendMail(mailOptions)
   }catch(err){
      console.log(err)
   }
  
}