import { summaryApi } from '../common/summaryApi'
import { setUser, clearUser, setError, setLoading, setAllUsers } from '../store/authSlice'
import { Axios } from '../utils/Axios'
import { toast } from 'sonner'

export const register = (formData, navigate, socket) => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await Axios.post(summaryApi.register.url, formData, { withCredentials: true })
        dispatch(setUser(res.data.user))
        toast.success("Registered successfully!")
        localStorage.setItem("user", JSON.stringify(res.data.user));

        socket.auth = { userId: res.data.user._id }
        socket.connect()
        navigate('/')
    } catch (error) {
        toast.error(error.res?.data?.message || "Register failed")
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}

export const login = (formData, navigate, socket) => async (dispatch) => {
    try {
        dispatch(setLoading(true))

        const res = await Axios.post(summaryApi.login.url, formData, { withCredentials: true })

        const user = res.data.user
        dispatch(setUser(user))
        toast.success("Login Successful")
        localStorage.setItem("user", JSON.stringify(user))

        if (user && user._id) {
            socket.io.opts.query = { userId: user._id }
            socket.connect()
        } else {
            console.error("User ID is undefined in login response")
            toast.error("Login failed: User ID is missing")
        }

        navigate('/')
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Login failed")
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}

export const logout = (navigate, socket) => async (dispatch) => {
    try {
        socket.disconnect()
        await Axios.post(summaryApi.logout.url)
        dispatch(clearUser())
        localStorage.removeItem("user")
        toast.success("Logout successfull.")
        navigate('/login')
    } catch (error) {
        console.log("error in logout", error)
        toast.error("Logout failed")
    }
}

export const editFullName = (fullName) => async (dispatch) => {
    console.log("Sending full name:", fullName);  // Log the full name
    try {
        const res = await Axios.patch(
            summaryApi.editFullName.url,
            { fullName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            }
        );
        const updatedUser = res.data.user

        dispatch(setUser(updatedUser))
        localStorage.setItem("user", JSON.stringify(updatedUser))

        toast.success("Fullname updated successfully")
    } catch (error) {
        console.log("Error updating name:", error)
        toast.error("Failed to update full name")
    }
}

export const editProfilepic = (file) => async (dispatch) => {
    try {
        const formData = new FormData()
        formData.append('profilePic', file)

        const res = await Axios.put(
            summaryApi.editProfilepic.url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            }
        )

        const updatedUser = res.data.user
        dispatch(setUser(updatedUser))
        localStorage.setItem("user", JSON.stringify(updatedUser))

        toast.success("Profilepic updated successfully")
    } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error("Failed to update profile picture");
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {
        const res = await Axios.get(summaryApi.getAllUsers.url, {
            withCredentials: true
        })

        dispatch(setAllUsers(res.data))
    } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Could not fetch users");
    }
}