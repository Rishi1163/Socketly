import { Router } from "express";
import { editFullName, editProfilepic, getAllUsers, getUserDetails, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const userRoutes = Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/login',loginUser)
userRoutes.post('/logout',logoutUser)
userRoutes.patch('/edit-name', verifyUser, editFullName)
userRoutes.put('/edit-profilePic', verifyUser, upload.single("profilePic"), editProfilepic)
userRoutes.get('/details',verifyUser,getUserDetails)
userRoutes.post('/refreshAccessToken',refreshAccessToken)
userRoutes.get('/all',verifyUser, getAllUsers)
export { userRoutes }