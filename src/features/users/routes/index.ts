import { Router } from "express";
import { getUser, getUsers, updateProfile, viewProfile } from "../controlers";
import { requireAuthenticated } from "../../../middlewares";

const router = Router();
router.get("/", getUsers);
router.get("/profile", requireAuthenticated, viewProfile);
router.post("/profile", requireAuthenticated, updateProfile);
router.get("/:id", getUser);
export default router;
