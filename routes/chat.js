import express from 'express'
import {clearChat, getChatInfo} from '../Controllers/chatController.js'
const Router=express.Router()

Router.get('/chatInfo',getChatInfo)
Router.get('/clearChat',clearChat)

export default Router