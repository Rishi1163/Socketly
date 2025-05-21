import mongoose from 'mongoose'

const connDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if(conn){
            console.log("Db connected successfully")
        }else{
            console.log("connection error")
        }
    } catch (error) {
        console.log("Error in connection",error)
    }
}

export default connDb