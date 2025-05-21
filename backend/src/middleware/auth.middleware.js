import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {
    try {
        let token;

        // Check for accessToken in cookies
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        // Or check for Bearer token in headers
        if (!token && req.headers.authorization) {
            const [scheme, bearerToken] = req.headers.authorization.split(" ");
            if (scheme === "Bearer") token = bearerToken;
        }

        if (!token) {
            return res.status(401).json({
                message: "Access token missing!",
                error: true,
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access!",
                error: true,
                success: false
            });
        }

        req.user = decode;
        next();

    } catch (error) {
        console.log("Verify error:", error);
        return res.status(401).json({
            message: "Invalid or expired access token!",
            error: true,
            success: false
        });
    }
};