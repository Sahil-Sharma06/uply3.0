import User from "../models/User.js";
import Certification from "../models/Certifications.js";


export const addCertification = async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, issuer, issue_date, expiry_date, credential_id, credential_url, visibility } = req.body;

    const user = await User.findOne({ $or: [{ id }, { _id: id }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCertification = new Certification({
      title,
      issuer,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
      visibility,
    });
    await newCertification.save();

    user.certifications.push(newCertification._id);
    await user.save();

    return res.status(201).json({ message: "Certification added successfully", certification: newCertification });
  } catch (error) {
    console.error("Error adding certification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCertifications = async (req, res) => {
  try {
    const { id, certId } = req.params;

    const user = await User.findOne({ $or: [{ id }, { _id: id }] }).populate("certifications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (certId) {
      const certification = user.certifications.find(
        (cert) => cert._id.toString() === certId
      );
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      return res.status(200).json({ message: "Certification fetched successfully", certification });
    }

    return res.status(200).json({ message: "Certifications fetched successfully", certifications: user.certifications });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateCertification = async (req, res) => {
  try {
    const { certId } = req.params;
    const { title, issuer, issue_date, expiry_date, credential_id, credential_url, visibility } = req.body;

    const updatedCertification = await Certification.findByIdAndUpdate(
      certId,
      {
        $set: {
          ...(title && { title }),
          ...(issuer && { issuer }),
          ...(issue_date && { issue_date }),
          ...(expiry_date && { expiry_date }),
          ...(credential_id && { credential_id }),
          ...(credential_url && { credential_url }),
          ...(visibility && { visibility }),
        },
      },
      { new: true }
    );

    if (!updatedCertification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    return res.status(200).json({ message: "Certification updated successfully", certification: updatedCertification });
  } catch (error) {
    console.error("Error updating certification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteCertification = async (req, res) => {
  try {
    const { id, certId } = req.params;

    const user = await User.findOne({ $or: [{ id }, { _id: id }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const certification = await Certification.findById(certId);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    await Certification.findByIdAndDelete(certId);

    await User.updateOne({ _id: user._id }, { $pull: { certifications: certId } });

    return res.status(200).json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
