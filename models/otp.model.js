import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expireAt: { type: Date },
});

export default model("Otp", otpSchema);
