import { Router } from "express";
import { getUser, getUsers, viewProfile } from "../controlers";
import { requireAuthenticated } from "../../../middlewares";

const router = Router();
router.get("/", getUsers);
router.get("/profile", requireAuthenticated, viewProfile);
router.get("/:id", getUser);
export default router;
