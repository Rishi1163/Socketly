import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => {
    return jwt.sign({id:userId}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "7d",
    })
}

export const generateRefreshToken =  (userId) => {
    return jwt.sign({id:userId}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: "7d"
    })
}