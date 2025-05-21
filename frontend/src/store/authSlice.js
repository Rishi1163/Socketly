import { createSlice } from '@reduxjs/toolkit'

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    allUsers: [],
    onlineUsers: [], // ✅ add this line
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        setOnlineUsers: (state, action) => { // ✅ add this reducer
            state.onlineUsers = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.onlineUsers = []; // ✅ clear online users when logging out
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setUser, clearUser, setLoading, setError, setAllUsers, setOnlineUsers } = authSlice.actions; 
export default authSlice.reducer;