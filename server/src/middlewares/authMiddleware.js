import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyAccessToken = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized: No access token" });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ id: decoded.id }).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "Invalid access token: user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};