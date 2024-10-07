import { Router } from "express";
import AuthMiddleware from "../middleware/auth.meddleware.js";
import { getUserWithContacts, searchContacts } from "../controllers/all-filter.controller.js";

const router = Router();

router.get("/similar-contacts", AuthMiddleware, getUserWithContacts);
router.get("/search-contacts", searchContacts)
export default router;
