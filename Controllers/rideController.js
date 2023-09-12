import Ride from "../models/Ride.js"
import User from "../models/User.js"

export const createRide= async(req,res) =>{
    const {id}=req.user
    try{
        const user=await User.findOne({_id:id})
        const {email} = user
        req.body.ride.driveremail=email
        const newRide=new Ride(req.body.ride)
        const saveRide = await newRide.save();
        res.status(200).json({success:true,message:"Successfully created",data:saveRide})
    } catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"Failed to create,try again"})
    }
}

export const updateRide = async(req,res) =>{
    const {id} = req.query
    
    try{
        const updateData=req.body.ride
        const updatedRide = await Ride.findOneAndUpdate({_id:id},updateData,{new:true})
        res.status(200).json({success:true,message:"Successfully updated"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"Failed to update,try again"})
    }
    
}

export const deleteRide = async(req,res) =>{
    const {id}=req.query
    try{
        const deleteRide=await Ride.findByIdAndRemove(id)
        res.status(200).json({success:true,message:"Successfully deleted"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"Failed to delete,try again"})
    }
}

export const getRide = async(req,res) =>{
    const {from , to, date ,passengers}=req.query
    const pickup=from.split(",")
    const dropoff=to.split(",")
    try{
        const rides=await Ride.find({from:{$regex:new RegExp(pickup[pickup.length-1])},from:{$regex:new RegExp(pickup[pickup.length-2])},to:{$regex:new RegExp(dropoff[dropoff.length-1])},to:{$regex:new RegExp(dropoff[dropoff.length-2])},date:date,passengers:{$gte:passengers}})
        if(!rides[0]){
            res.status(200).json({success:false,message:"There is no results matched"})
        }
        else{
            res.status(200).json({success:true,data:rides})
        }
    }catch(err){
        console.log(err)
        res.statue(500).json({success:false,message:"Failed to get rides,try again"})
    }
}

export const getDriverRides=async(req,res)=>{
    const {id}=req.query
    try{
        const user=await User.findById(id)
        const {email} = user
        const rides=await Ride.find({driveremail:email})
        if(!rides[0]){
            res.status(404).json({success:false,message:"There is no results matched"})
        }
        else{
            res.status(200).json({success:true,data:rides})
        }
    }catch(err){
        console.log(err)
    }
    
}

export const getSingleRide=async(req,res)=>{
    const {user}=req.query
    console.log(user)
    try{
        const ride=await Ride.findById({_id:user})
        res.status(200).json({ride:ride})
    }catch(err){
        res.send("This ride was canceled")
    }
    

}