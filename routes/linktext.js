import express from "express";
import {addLinkText} from '../Controllers/linkTextController.js'
const Router=express.Router()
import multer from "multer"
import path from 'path'


const uploadImage = multer({ dest: 'assets/linktextimages' });
Router.post("/addLinkText",uploadImage.single("image"),addLinkText)

export default Router