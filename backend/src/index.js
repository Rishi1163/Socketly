import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connDb from './config/conn.js'
import { userRoutes } from './routes/user.routes.js'
import messageRoutes from './routes/message.routes.js'
import { server, app } from './utils/socket.js'

dotenv.config({
    path: "./.env"
})
const port = process.env.PORT

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v2/message', messageRoutes)

app.get('/', (req, res) => {
    res.send("Hello")
})


server.listen(port, () => {
    connDb()
    console.log(`Listening on port: ${port}`)
})