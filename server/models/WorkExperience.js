import mongoose from "mongoose";

const workExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      default: "Internship",
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
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    tech_stack: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  {
    timestamps: true, 
  }
);

const WorkExperience =
  mongoose.models.WorkExperience ||
  mongoose.model("WorkExperience", workExperienceSchema);

export default WorkExperience;
