import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (id) => {
  try {
    const user = await User.findOne({ id });
    if (!user) throw new Error("User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

export const signup = async (req,res) => {

    try{
        console.log("1111111");
        const {email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(409).json({message : "User already exists"});
        }
        
        const user = await User.create({email, password});
        console.log("2222222");

        return res.status(201).json({
            email: user.email
        })
    }
    catch(error){
        console.log("Error in signup");
        res.status(500).json({message: error.message});
    }
};

export const login = async (req,res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken, refreshToken, message: "User logged in successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const logout = async(req,res) => {
    
    try {
        await User.findOneAndUpdate(
            {
                id: req.user.id
            },
            {
                $set: {
                    refreshToken: undefined,
                }
            },
            {
                new: true,
            }
        );
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized request: No refresh token" });
    }
    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne({id: decoded.id});
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token: user not found" });
        }
        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken, refreshToken, message: "Access token refreshed" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
}