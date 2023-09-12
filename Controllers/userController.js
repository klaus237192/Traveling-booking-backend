import { UsageRecordInstance } from 'twilio/lib/rest/supersim/v1/usageRecord.js'
import User from '../models/User.js'
import bcrypt from "bcryptjs"

export const updateUser = async (req, res) => {
   const {id} = req.user
   try{
      const user=await User.findById(id)
      if(req.body.password&&!req.body.newpassword){
         const{password}=req.body
         const salt = bcrypt.genSaltSync(10)
         const hash = bcrypt.hashSync(password, salt)
         req.body.password=hash
      }
      if(req.body.password&&req.body.newpassword){
         const {password,newpassword}=req.body
         const checkCorrectPassword = await bcrypt.compare(password, user.password)
         if(checkCorrectPassword){
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newpassword, salt)
            req.body={}
            req.body.password=hash
         }else{
            res.status(400).json({message:"Previous password is incorrect.Try again"})
            return 
         }
         
      }
   }catch(err){
      console.log(err)
   }
   
   try {
      const updateData=req.body
 
      const updatedUser = await User.findOneAndUpdate({_id:id},updateData,{new:true})

      res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser })
   } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: 'Failed to update' })
   }
}
export const updateUserByAdmin = async (req, res) => {
   const {id} = req.query
   console.log(id)
   try{
      const{password}=req.body.updatedData
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      req.body.updatedData.password=hash
   }catch(err){
      console.log(err)
   }
   
   try {
      const updateData=req.body.updatedData
 
      const updatedUser = await User.findOneAndUpdate({_id:id},updateData,{new:true})

      res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser })
   } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: 'Failed to update' })
   }
}
export const updateAdminPassword=async(req,res)=>{
   const {currentPassword, newPassword}=req.body
   console.log(currentPassword,newPassword)
   try{
      const user=await User.findOne({role:"admin"})
      const checkCorrectPassword = await bcrypt.compare(currentPassword, user.password)
      if(checkCorrectPassword){
         const salt = bcrypt.genSaltSync(10)
         const hash = bcrypt.hashSync(newPassword, salt)
         await User.findOneAndUpdate({role:"admin"},{password:hash},{new:true})
         res.status(200).json({message:"Successfully updated",success:true})
      }else{
         res.status(400).json({message:"Current password is incorrect.Try again",success:false}) 
      }
   }catch(err){
      console.log(err)
   }
   
}
//Delete User
export const deleteUser = async (req, res) => {
   const {id} = req.query
   
   try {
      await User.findByIdAndRemove(id)
      
      res.status(200).clearCookie("accessToken").json({ success: true, message: 'Successfully deleted' })
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete' })
   }
}

//Get single User
export const getSingleUser = async (req, res) => {
   const {id} = req.user
   try {
      const user = await User.findById(id)
      res.status(200).json({ success: true, message: 'Successfully', data: user })
   } catch (error) {
      res.status(400).json({ success: false, message: 'Not Found' })
   }
}

//GetAll User
export const getAllUser = async (req, res) => {
   //console.log(page)

   try {
      const users = await User.find({role:"user"})

      res.status(200).json({ success: true, message: 'Successfully', data: users })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}

export const getNames =async (req,res)=>{
   const {email} = req.query
   try{
      const user=await User.findOne({email:email})
      res.status(200).json({name:user.firstname})
      res.end()
   }catch(err){
      console.log(err)
   }
   
}

export const getDriverInfo=async(req,res)=>{
   const {email}=req.query
   try{
      const user=await User.findOne({email:email})
      res.status(200).json({driverInfo:user})
   }catch(err){
      console.log(err)
   }
   
}

export const getUser=async(req,res)=>{
   const {user}=req.query
   console.log(user)
   try{
      const newuser=await User.findById({_id:user})
      const name=`${newuser.firstname} ${newuser.lastname}`
      res.status(200).json({name:name})
   }catch(err){
      console.log(err)
   }
   
}

export const getChatAvatar=async(req,res)=>{
   const {id}=req.query
   try{
      const user=await User.findOne({_id:id})
      const path=user.avatar
      if(!path){
         res.status(500).json({success:false})
      }
      else{
         const absolutePath=process.cwd()+"\\"+path
         res.status(200).sendFile(absolutePath)
       }
   }catch(err){
      console.log(err)
   }
  
}