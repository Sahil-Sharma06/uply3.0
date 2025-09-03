import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      trim: true,
      enum: ["LinkedIn", "GitHub", "Twitter", "Instagram", "Facebook", "Other"],
      required: true,
    },
    username: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Social =
  mongoose.models.Social || mongoose.model("Social", socialSchema);

export default Social;
