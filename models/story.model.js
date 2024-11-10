import { model, Schema } from "mongoose";

const viewerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  viewedAt: { type: Date, default: Date.now },
  reaction: {
    type: String,
  },
});

const storySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  labels: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000,
  },
  viewers: [viewerSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
});

storySchema.pre("save", function (next) {
  if (Date.now() > this.expiresAt) {
    this.isActive = false;
  }
  next();
});

const Story = model("Story", storySchema);

export default Story;
