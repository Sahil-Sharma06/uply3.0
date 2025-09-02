import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      trim: true,
    },
    issue_date: {
      type: Date,
    },
    expiry_date: {
      type: Date,
    },
    credential_id: {
      type: String,
      trim: true,
    },
    credential_url: {
      type: String,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public"],
      default: "public",
    },
  },
  {
    timestamps: true, 
  }
);

const Certification =
  mongoose.models.Certification ||
  mongoose.model("Certification", certificationSchema);

export default Certification;
