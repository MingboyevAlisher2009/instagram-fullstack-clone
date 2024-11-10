import { Router } from "express";
import AuthMiddleware from "../middleware/auth.meddleware.js";
import {
  addLike,
  addStory,
  addStoryView,
  getStorys,
  uploadFile,
} from "../controllers/story.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/storys" });

router.get("/get-storys", AuthMiddleware, getStorys);

router.post(
  "/upload-file",
  AuthMiddleware,
  upload.single("story-file"),
  uploadFile
);

router.post("/add-story", AuthMiddleware, addStory);

router.post("/like", AuthMiddleware, addLike);

router.post("/seen-story", AuthMiddleware, addStoryView);

export default router;
