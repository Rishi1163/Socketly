import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        trim: true
    },
    image: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const messageModel = mongoose.model("Message", messageSchema)