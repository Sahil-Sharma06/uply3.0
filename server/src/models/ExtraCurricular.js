import mongoose from "mongoose";

const extraCurricularSchema = new mongoose.Schema(
  {
    activity: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Captain", "Member", "Organizer", "Other"],
      default: "Other",
    },
    organization: {
      type: String,
      trim: true,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    ongoing: {
      type: Boolean,
      default: false,
    },
    achievements: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public"],
      default: "public",
    },
  },
  { timestamps: true }
);

const ExtraCurricular =
  mongoose.models.ExtraCurricular ||
  mongoose.model("ExtraCurricular", extraCurricularSchema);

export default ExtraCurricular;
