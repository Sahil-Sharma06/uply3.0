import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
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
    tech_stack: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["Individual", "Team Lead", "Contributor"],
      default: "Individual",
    },
    repo_link: {
      type: String,
      trim: true,
    },
    demo_link: {
      type: String,
      trim: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
    tags: {
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

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
