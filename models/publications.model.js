import { model, Schema } from "mongoose";

const PublicationsSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    likes: [{ type: Schema.ObjectId, ref: "User" }],
    content: [
      {
        file: { type: String, required: true },
        fileType: {
          type: String,
          enum: ["photo", "video"],
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
      },
    ],
    isComment: {
      type: Boolean,
      default: true,
    },
    hideLikeNum: {
      type: Boolean,
      default: true,
    },
    comments: [
      {
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
      },
    ],
    sevedPople: [{ type: Schema.ObjectId, ref: "User" }],
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const Publications = model("Publications", PublicationsSchema);

export default Publications;
