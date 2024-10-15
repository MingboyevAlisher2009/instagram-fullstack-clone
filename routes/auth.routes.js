import { Router } from "express";
import {
  addProfileImage,
  getMe,
  login,
  register,
  removeImage,
  sendCode,
  updateImage,
  updateProfile,
} from "../controllers/auth.controller.js";
import AuthMiddleware from "../middleware/auth.meddleware.js";
import { body } from "express-validator";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/profiles" });

router.get("/get-me", AuthMiddleware, getMe);

router.post("/send-code", sendCode);

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  login
);

router.put("/update-profile", AuthMiddleware, updateProfile);

router.post(
  "/upload-image",
  AuthMiddleware,
  upload.single("profile-image"),
  addProfileImage
);

router.put(
  "/update-image",
  AuthMiddleware,
  upload.single("profile-image"),
  updateImage
);

router.delete("/delete-image", AuthMiddleware, removeImage);


export default router;
