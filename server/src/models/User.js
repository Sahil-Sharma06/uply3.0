import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      default: "",
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
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
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

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      id: this.id,
      email: this.email
    }, process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      id: this.id,
      email: this.email
    }, process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;