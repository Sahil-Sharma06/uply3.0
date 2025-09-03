import User from "../models/User.js";
import mongoose from "mongoose";
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
