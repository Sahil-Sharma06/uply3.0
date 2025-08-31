import mongoose from mongoose;
import {v4 as uuidv4} from 'uuid';
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    college: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profile_picture_url: {
      type: String,
      default: "",
    },
    // References
    academics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Academics' }],
    awards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Award' }],
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }],
    extraCurriculars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExtraCurricular' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    socials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Social' }],
    workExperiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkExperience' }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;