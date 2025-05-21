import { summaryApi } from "../common/summaryApi";
import { Axios } from "../utils/Axios";
import { setMessages, setMessageLoading, setMessageError } from "../store/messageSlice";

export const getMessages = (receiverId) => async (dispatch) => {
    try{
        dispatch(setMessageLoading(true))

        const res = await Axios.get(summaryApi.getAllMessages.url.replace(':id',receiverId),
        {withCredentials: true}
    )

    dispatch(setMessages(res.data.messages))
    }catch(error){
        console.error("Failed to fetch messages:", error);
        dispatch(setMessageError(error.message));
    }finally{
        dispatch(setMessageLoading(false))
    }
}

export const sendMessage = (text, image, receiverId) => async (dispatch, getState) => {
    try {
        dispatch(setMessageLoading(true))

        const formData = new FormData()

        if(text?.trim()){
            formData.append("text", text?.trim())
        }

        if(image) {
            formData.append("image", image)
        }

        const res = await Axios.post(
            summaryApi.sendMessage.url.replace(':id', receiverId),
            formData,
            {
                withCredentials:true,
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            }
        )

        const {data : newMessage} = res.data

        const {messages} = getState().message;
        dispatch(setMessages([...messages, newMessage]))
    } catch (error) {
        console.error("Failed to send message:", error);
        dispatch(setMessageError(error.message));
    }finally{
        dispatch(setMessageLoading(false))
    }
}
