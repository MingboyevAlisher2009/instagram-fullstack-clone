import { model, Schema } from "mongoose";

const contentSchema = new Schema({
  file: { type: String, required: true },
  fileType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  audio: {
    type: String,
  },
  label: [
    {
      type: Schema.ObjectId,
      ref: "User",
    },
  ],
  comment: {
    type: String,
  },
  coverPhoto: {
    type: String,
    required: function () {
      return this.fileType === "video";
    },
  },
  isSound: {
    type: Boolean,
    default: true,
  },
});

const commentSchema = new Schema({
  publicationId: {
    type: Schema.ObjectId,
    required: true,
  },
  sender: {
    type: Schema.ObjectId,
    required: true,
    ref: "User",
  },
  comment: {
    type: String,
    required: true,
  },
  likes: [{ type: Schema.ObjectId, ref: "User" }],
  answers: [
    {
      author: { type: Schema.ObjectId, ref: "User" },
      comment: { type: String },
      likes: [{ type: Schema.ObjectId, ref: "User" }],
      user: { type: Schema.ObjectId, ref: "User" },
    },
  ],
});

const PublicationsSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    likes: [{ type: Schema.ObjectId, ref: "User" }],
    content: [contentSchema],
    isComment: {
      type: Boolean,
      default: true,
    },
    hideLikeNum: {
      type: Boolean,
      default: true,
    },
    sevedPople: [{ type: Schema.ObjectId, ref: "User" }],
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Publications = model("Publications", PublicationsSchema);
export const Comment = model("Comment", commentSchema);
