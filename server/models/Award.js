import mongoose from "mongoose";

const awardSchema = new mongoose.Schema(
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
    date: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Academic", "Hackathon", "Other"],
      default: "Other",
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

const Award = mongoose.models.Award || mongoose.model("Award", awardSchema);

export default Award;
