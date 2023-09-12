import express from 'express'
import { deleteUser, getAllUser, getSingleUser, updateUser ,updateUserByAdmin,getNames,getDriverInfo,getUser,getChatAvatar,updateAdminPassword} from '../Controllers/userController.js'

import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

//Update user
router.put('/', verifyUser, updateUser)
router.put('/admin', verifyAdmin, updateUserByAdmin)
router.put('/changeAdminPassword', verifyAdmin, updateAdminPassword)
//Delete user
router.delete('/', verifyAdmin, deleteUser)

//Get single user
router.get('/getone', verifyUser, getSingleUser)

//Get all user
router.get('/', verifyAdmin, getAllUser)
router.get('/getNames',getNames)
router.get('/getDriverInfo',getDriverInfo)
router.get('/getuser',getUser)
router.get('/getavatar',getChatAvatar)
export default router