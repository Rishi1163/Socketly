export const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export const summaryApi = {
    register : {
        url: "/api/v1/user/register",
        method: "post"
    },
    login: {
        url: '/api/v1/user/login',
        method: "post"
    },
    logout: {
        url: "/api/v1/user/logout",
        method: "post"
    },
    editFullName: {
        url: '/api/v1/user/edit-name',
        method: "patch"
    },
    editProfilepic: {
        url: '/api/v1/user/edit-profilePic',
        method: "put"
    },
    getAllUsers: {
        url: '/api/v1/user/all',
        method: "get"
    },
    getAllMessages: {
        url: '/api/v2/message/chat/:id',
        method: 'get'
    },
    sendMessage: {
        url: '/api/v2/message/send/:id',
        method: 'post'
    },
}