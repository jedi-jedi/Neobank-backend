import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import blacklistedTokenModel from "../models/blacklistedTokenModel.js";

export const isloggedIn = async (req, res, next) => {
    try {
        //check for Token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(404).json({
                status: "error",
                message: "Token not found"
            });
        }

        //verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error);
            return next(error)
            // return res.status(401).json({
            //     status: "error",
            //     message: "Invalid or expired token"
            // });
        }

        const { userId, email, userName } = decoded;

        //check if blacklisted
        const tokenIsBlacklisted = await blacklistedTokenModel.findOne({ token });
        if (tokenIsBlacklisted) {
            return res.status(401).json({
                status: "error",
                message: "This token has been blacklisted, login again."
            });
        }

        //find user by _id
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        //attach user to Request
        req.user = user;
        next()
    } catch (error) {
        next(error)
    }
}