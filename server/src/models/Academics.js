import mongoose from "mongoose";

const academicsSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
      enum: ["B.Tech", "MCA", "BSc", "Other"], 
    },
    branch: {
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
    gpa: {
      type: Number,
      min: 0,
      max: 10, 
    },
    achievements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
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

const Academics =
  mongoose.models.Academics || mongoose.model("Academics", academicsSchema);

export default Academics;
