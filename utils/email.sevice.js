import nodemailer from "nodemailer";
import otpModel from "../models/otp.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated OTP:", otp);

  const hashedOtp = await bcrypt.hash(otp.toString(), 10);
  await otpModel.create({
    email,
    otp: hashedOtp,
    expireAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `OTP for verification - ${new Date().toLocaleString()}`,
    html: `<h1>Your OTP is: <b>${otp}</b></h1>`,
  });
};

export const verify = async (email, otp) => {
  const otpData = await otpModel.find({ email });
  if (!otpData.length) throw new Error("OTP not found");

  const latestOtp = otpData[otpData.length - 1];
  if (latestOtp.expireAt < new Date()) throw new Error("OTP expired");

  const isValid = await bcrypt.compare(otp.toString(), latestOtp.otp);
  if (!isValid) throw new Error("Invalid OTP");

  await otpModel.deleteMany({ email });
  return true;
};
