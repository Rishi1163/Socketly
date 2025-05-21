import cloudinary from "../config/cloudinary.js";
import { messageModel } from "../models/message.models.js";
import { getReceiverId, io } from "../utils/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.user.id //auth middleware
        const { text } = req.body
        const {id: receiverId } = req.params

        if(!receiverId && !text && !req.file){
            return res.status(400).json({message: "Message must contain either text or image."})
        }
        
        const newMessageData = {
            sender: senderId,
            receiver: receiverId
        }

        if(text && text.trim()){
            newMessageData.text = text.trim()
        }

        if(req.file){
           const uploadResult = await cloudinary.uploader.upload(req.file.path,{
            folder: "chatImages"
           })

           newMessageData.image = uploadResult.secure_url
        }

        const newMessage = await messageModel.create(newMessageData)

        const receiverSocketId = getReceiverId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json({
            message: "Message sent successfully",
            data: newMessage
        })
    } catch (error) {
        console.log("error in sendMessage controller",error)
        res.status(500).json({message: "Internal server error."})
    }
}

export const getAllMessages = async (req,res) => {
    try {
        const senderId = req.user.id
        const { id: receiverId } = req.params
    
        const messages = await messageModel.find({
            $or:[
                {sender: senderId, receiver: receiverId},
                {sender: receiverId, receiver: senderId}
            ]
        }).sort({createdAt: 1})
    
        res.json({messages})
    } catch (error) {
        console.log("error in getMessage", error)
        res.status(500).json("Internal server error")
    }
}