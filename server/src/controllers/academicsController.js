import Academics from "../models/Academics.js";
import User from "../models/User.js";

export const addAcademic = async (req, res) => {
  try {
    const { id } = req.params; 
    const {
      institution,
      degree,
      branch,
      start_date,
      end_date,
      ongoing,
      gpa,
      achievements,
      location,
      visibility,
    } = req.body;

    const academic = new Academics({
      institution,
      degree,
      branch,
      start_date,
      end_date,
      ongoing,
      gpa,
      achievements,
      location,
      visibility,
    });

    await academic.save();

    const user = await User.findOneAndUpdate(
      { $or: [{ _id: id }, { id }] },
      { $push: { academics: academic._id } },
      { new: true }
    ).populate("academics");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Academic record added successfully",
      user,
    });
  } catch (error) {
    console.error("Error adding academic record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAcademics = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({ $or: [{ id }, { _id: id }] })
      .populate("academics")
      .select("academics");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Academics fetched successfully",
      academics: user.academics,
    });
  } catch (error) {
    console.error("Error fetching academics:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAcademic = async (req, res) => {
  try {
    const { id, academicId } = req.params;
    const updateData = req.body;

    const user = await User.findOne({ $or: [{ id }, { _id: id }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const academic = await Academics.findById(academicId);
    if (!academic) {
      return res.status(404).json({ message: "Academic record not found" });
    }

    const updatedAcademic = await Academics.findByIdAndUpdate(
      academicId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      message: "Academic record updated successfully",
      academic: updatedAcademic,
    });
  } catch (error) {
    console.error("Error updating academic record:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAcademic = async (req, res) => {
  try {
    const { id, academicId } = req.params;

    // check if user exists
    const user = await User.findOne({ $or: [{ id }, { _id: id }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if academic record exists
    const academic = await Academics.findById(academicId);
    if (!academic) {
      return res.status(404).json({ message: "Academic record not found" });
    }

    // remove academic record
    await Academics.findByIdAndDelete(academicId);

    // also pull it from user's academics array
    await User.updateOne(
      { _id: user._id },
      { $pull: { academics: academicId } }
    );

    return res.status(200).json({
      message: "Academic record deleted successfully",
      deletedAcademicId: academicId,
    });
  } catch (error) {
    console.error("Error deleting academic record:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
