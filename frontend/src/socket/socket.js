import {io} from 'socket.io-client'

const user = JSON.parse(localStorage.getItem("user"))

export const socket = io(import.meta.env.VITE_BACKEND_URL,{
    query: {
        userId: user?._id
    },
    withCredentials: true
})