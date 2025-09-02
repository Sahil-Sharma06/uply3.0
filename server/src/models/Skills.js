import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    category: {
      type: String,
      enum: ["Programming", "Design", "Tools", "Languages", "Other"],
      default: "Programming",
    },
    endorsements: {
      type: Number,
      default: 0,
      min: 0,
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

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);

export default Skill;
