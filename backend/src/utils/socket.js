import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
import { UserModel } from '../models/user.models.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

const userSocketMap = {}

export const getReceiverId = (userId) => {
    return userSocketMap[userId]
}

io.on("connection", async (socket) => {
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId
    console.log("backend socket", userId)

    if (!userId || userId === "undefined") {
        console.error("❌ Invalid or missing userId:", userId)
        return socket.disconnect(true) // forcefully disconnect this socket
    }

    userSocketMap[userId] = socket.id

    try {
        await UserModel.findByIdAndUpdate(userId, { isOnline: true })
    } catch (error) {
        console.log("Failed to update online status", error)
    }

    // broadcast current online users
    io.emit("getOnlineUser", Object.keys(userSocketMap))

    socket.on("sendMessage", async (data) => {
        // your sendMessage logic
    })

    socket.on("disconnect", async () => {
        console.log("A user disconnected", socket.id)

        if (userId) {
            delete userSocketMap[userId]

            try {
                await UserModel.findByIdAndUpdate(userId, { isOnline: false })
            } catch (error) {
                console.log("Failed to update online status", error)
            }

            io.emit('getOnlineUser', Object.keys(userSocketMap))
        }
    })
})


export { io, server, app }