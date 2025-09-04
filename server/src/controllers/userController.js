import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const createUser = async (req,res) =>{
    try{
        const {name,dob,gender,college,address,email,password,phone,profilePictureUrl} = req.body;

       if (!name || !email || !password) {
              return res.status(400).json({ message: "Name, email and password are required" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already Exists"})
        }
        const newUser = new User({name,dob,gender,college,address,email,password,phone,profilePictureUrl});
        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;
        return res.status(201).json({message: "User Created Successfully", user: userResponse});

    }catch(e){
        console.error("Error creating user:",e);
        if (e.code === 11000) {
            return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const getUser = async (req,res) =>{
    try {
        const {id} = req.params;
    if(id){
        const user = await User.findOne({ $or: [{ id }, { _id: id }] }).select('-password -refreshToken');

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({message: "User fetched successfully", user});
    }

    const allUsers = await User.find().select('-password -refreshToken');
    return res.status(200).json({message: "All users fetched successfully", users: allUsers});
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, gender, college, address, phone, profilePictureUrl } = req.body;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ id }, { _id: id }] }
      : { id };

    const updatedUser = await User.findOneAndUpdate(
      query,
      {
        $set: {
          ...(name && { name }),
          ...(dob && { dob }),
          ...(gender && { gender }),
          ...(college && { college }),
          ...(address && { address }),
          ...(phone && { phone }),
          ...(profilePictureUrl && { profilePictureUrl }),
        },
      },
      { new: true, select: "-password -refreshToken" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required for deletion" });
    }

    const deletedUser = await User.findOneAndDelete({
      $or: [{ id }, { _id: id }],
    }).select("-password -refreshToken");

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (e) {
    console.error("Error deleting user:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    const user = await User.findOne({ $or: [{ id }, { _id: id }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { profilePictureUrl } = req.body;

    if (!profilePictureUrl) {
      return res.status(400).json({ message: "Profile picture URL is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { profilePictureUrl } },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
