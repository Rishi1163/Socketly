import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.models.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js'

export const registerUser = async (req, res) => {
    // console.log("REGISTER BODY:", req.body); 
    try {
        const { email, fullName, password } = req.body

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json("User already exists.")
        }

        if (password.length < 6) {
            return res.status(400).json("Password must atleast 6 characters.")
        }

        if (!email || !fullName || !password) {
            return res.status(400).json("All fields are required.")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await UserModel.create({
            email,
            fullName,
            password: hashedPassword
        })
        await UserModel.findByIdAndUpdate(user._id, { isOnline: true });

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const isProd = process.env.NODE_ENV === 'production';

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,                // Requires HTTPS in prod
            sameSite: isProd ? "None" : "Lax", // None for cross-origin, Lax for local dev
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 5 * 60 * 1000,
        });

        res.status(200).json({
            message: "User registered successfully",
            accessToken,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Error in register route", error)
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json("All fields are required.")
        }

        if (password.length < 6) {
            return res.status(400).json("Password must be atleast 6 characters.")
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json("User not registered.")
        }
        await UserModel.findByIdAndUpdate(user._id, { isOnline: true });

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json("Invalid credentials.")
        }

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const isProd = process.env.NODE_ENV === 'production';

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,                // Requires HTTPS in prod
            sameSite: isProd ? "None" : "Lax", // None for cross-origin, Lax for local dev
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 5 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successfull.",
            accessToken,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                isOnline: true
            }
        })
    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json("Error in login controller", error)
    }
}

export const logoutUser = async (req, res) => {
    const userId = req.user.id
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    await UserModel.findByIdAndUpdate(userId, {
        isOnline: false
    })
    res.status(200).json({ message: "Logged out successfully" });
};

export const editFullName = async (req, res) => {
    try {
        const userId = req.user.id
        console.log("userId", userId)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }
        const { fullName } = req.body
        console.log("Received full name:", fullName);

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!fullName || fullName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { fullName },
            { new: true }
        ).select('-password')

        res.status(200).json({
            success: true,
            message: "Full name updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating full name:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const editProfilepic = async (req, res) => {
    try {
        const userId = req.user.id

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                message: "No profile picture uploaded",
                success: false
            })
        }

        const profilepicUrl = req.file.path

        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { profilePic: profilepicUrl },
            { new: true }
        ).select('-password')

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.error("Error updating profile picture:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await UserModel.findById(userId).select('-password')
        if (!user) {
            return res.json({
                message: "No user found",
                error: true,
                success: false
            })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user
        })
    } catch (error) {
        console.log("Error in userDetails route", error)
        res.status(500).json("Internal server error.")
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const loggedInUser = req.user.id

        const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUser } }).select('-password')
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("error in getAllUsers", error)
        res.status(500).json({ message: "Internal server error!" })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        let token = req.cookies.refreshToken;

        if (!token && req.headers.authorization) {
            const [scheme, bearerToken] = req.headers.authorization.split(" ");
            if (scheme === "Bearer") token = bearerToken;
        }

        if (!token) {
            return res.status(400).json({ message: "Refresh token is missing" });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const accessToken = generateAccessToken(decoded.id);

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "Lax",
            maxAge: 5 * 60 * 1000, // 5 minutes
        });

        return res.status(200).json({ accessToken, message: "Access token refreshed" });
    } catch (err) {
        console.error("refreshAccessToken error:", err.message);
        return res.status(403).json({ message: "Invalid refresh token!" });
    }
};