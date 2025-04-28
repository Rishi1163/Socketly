import { Router } from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { getAllMessages, sendMessage } from '../controllers/message.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const messageRoutes = Router()

messageRoutes.post('/send/:id', verifyUser, upload.single("image"), sendMessage)
messageRoutes.get('/chat/:id', verifyUser, getAllMessages)

export default messageRoutes