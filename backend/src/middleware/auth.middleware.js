import jwt from 'jsonwebtoken'

export const verifyUser = async (req, res, next) => {
    try {
        let token = req.cookies.refreshToken;

        if (!token && req.headers.authorization) {
            const [scheme, bearerToken] = req.headers.authorization.split(" ");
            if (scheme === "Bearer") token = bearerToken;
        }

        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("Decoded Refresh Token:", decode);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access!",
                error: true,
                success: false
            })
        }

        req.user = decode
        next()

    } catch (error) {
        return res.status(500).json({
            message: "Please login!",
            error: true,
            success: false
        })
    }
}