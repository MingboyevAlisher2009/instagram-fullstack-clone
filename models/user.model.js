import { model, Schema } from "mongoose";

const AuthSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    bio: {
      type: String,
      required: false,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Auth = model("User", AuthSchema);

export default Auth;
