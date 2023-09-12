import LinkText from "../models/LinkText.js";

export const addLinkText=async(req,res)=>{
    const {url,comments}=JSON.parse(req.body.data)
    console.log(url,comments)
    const {file} = req
    console.log(file.path)
    try{
        const newLinkText=new LinkText({
        url:url,
        comments,comments,
        image:file.path
        })
        await newLinkText.save()
        res.status(200).json({message:"Link text added successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong, please try again"})
    }
}