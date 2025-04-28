import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    loading: false,
    error: null,
}

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers:{
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessages: (state, action) => {
            state.messages.push(action.payload)
        },
        setMessageLoading: (state, action) => {
            state.loading = action.payload
        },
        setMessageError: (state, action) => {
            state.error = action.payload
        },
        clearMessages: (state, action) => {
            state.messages = []
            state.error = null
        },
    }
})

export const { setMessages, addMessages, setMessageLoading, setMessageError, clearMessages } = messageSlice.actions
export default messageSlice.reducer