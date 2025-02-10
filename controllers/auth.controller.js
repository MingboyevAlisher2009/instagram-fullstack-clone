import Auth from "../models/user.model.js";
import { sendEmail, verify } from "../utils/email.sevice.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { renameSync, unlinkSync, existsSync } from "fs";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const user = await Auth.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    generateToken(res, user._id);

    return res.json({ success: true, message: "Lofin succefully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Email, user name, and password are required.",
      });
    }

    const existUser = await Auth.findOne({ email });

    if (existUser) {
      await sendEmail(existUser.email);
      return res.status(200).json({ email: existUser.email });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({
      email,
      username,
      fullName,
      password: hashPassword,
    });

    return res.json({ success: true, message: user.email });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verify(email, otp);
    if (result) {
      const user = await Auth.findOne({ email }).select("-password");
      generateToken(res, user._id);
      res.status(200).json({ user });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await Auth.findById(userId).select("-password");

    res.json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const obj = req.body;
  const userId = req.userId;

  if (Object.keys(obj).length === 0) {
    return res.status(400).json({ error: "Please enter the information" });
  }

  try {
    const data = await Auth.findByIdAndUpdate(userId, obj, {
      new: true,
    }).select("-password");

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Your information has been updated successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Update Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addProfileImage = async (req, res) => {
  const userId = req.userId;
  const file = req.file;
  try {
    if (!file) res.status(400).json({ error: "File is required" });

    const date = new Date();

    const formattedDate =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}_` +
      `${String(date.getHours()).padStart(2, "0")}-${String(
        date.getMinutes()
      ).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`;

    let fileName =
      "uploads/profiles/" + "photo_" + formattedDate + file.originalname;

    renameSync(file.path, fileName);

    const updateUser = await Auth.findByIdAndUpdate(
      userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    ).select("image");

    res.json({ image: updateUser.image });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateImage = async (req, res) => {
  const userId = req.userId;
  const file = req.file;
  try {
    const user = await Auth.findById(userId);

    if (!user.image) {
      res.status(404).json({ error: "Image not found" });
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    if (!file) res.status(400).json({ error: "File is required" });

    const date = new Date();

    const formattedDate =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}_` +
      `${String(date.getHours()).padStart(2, "0")}-${String(
        date.getMinutes()
      ).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`;

    const fileName =
      "uploads/profiles/" + "photo_" + formattedDate + file.originalname;

    renameSync(file.path, fileName);

    user.image = fileName;

    await user.save();
    res.json({ image: fileName });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeImage = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await Auth.findById(userId);

    if (!user) res.status(404).json({ error: "User not found" });

    if (existsSync(user.image)) {
      unlinkSync(user.image);
    }

    user.image = null;

    await user.save();

    res.json({ message: "Profile image removed successfuly" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
