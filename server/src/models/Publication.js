import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    journal_or_conference: {
      type: String,
      trim: true,
    },
    publication_date: {
      type: Date,
    },
    doi: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    abstract: {
      type: String,
      trim: true,
    },
    co_authors: {
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

const Publication =
  mongoose.models.Publication ||
  mongoose.model("Publication", publicationSchema);

export default Publication;
