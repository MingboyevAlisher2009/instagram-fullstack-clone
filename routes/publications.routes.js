import multer from "multer";
import {
  addComent,
  addLike,
  addPublication,
  addPublicationContent,
  deleteAnser,
  deleteComment,
  deletePublicatioImage,
  deletePublication,
  getPublications,
  savePublication,
  uploadFile,
  writeAnswer,
} from "../controllers/publications.controller.js";
import AuthMiddleware from "../middleware/auth.meddleware.js";
import { Router } from "express";

const router = Router();
const upload = multer({ dest: "uploads/publications" });

router.get("/get-publications", AuthMiddleware, getPublications);

router.post("/upload-file", upload.array("publication-file", 10), uploadFile);

router.post("/add-publication", AuthMiddleware, addPublication);

router.post("/add-content", AuthMiddleware, addPublicationContent);

router.post("/add-publication-comment", AuthMiddleware, addComent);

router.post("/like", AuthMiddleware, addLike);

router.post("/answer", AuthMiddleware, writeAnswer);

router.post("/save-publication", AuthMiddleware, savePublication);

router.delete(
  "/delete-publication/:publicationId",
  AuthMiddleware,
  deletePublication
);

router.delete(
  "/delete-comment/:publicationId/:commentId",
  AuthMiddleware,
  deleteComment
);

router.delete(
  "/delete-answer/:publicationId/:commentId/:answerId",
  AuthMiddleware,
  deleteAnser
);

router.delete(
  "/delete-image/:publicationId/:contentId",
  AuthMiddleware,
  deletePublicatioImage
);

export default router;
