import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password length must be atleast six"]
    },
    profilePic: {
        type: String,
        default: ""
    },
    isOnline: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

export const UserModel = mongoose.model("User",userSchema)