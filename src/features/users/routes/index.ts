import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateProfile,
  viewProfile,
} from "../controlers";
import { requireAuthenticated } from "../../../middlewares";
export { default as personRouter } from "./person";

const router = Router();
router.get("/profile", requireAuthenticated, viewProfile);
router.post("/profile", requireAuthenticated, updateProfile);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", requireAuthenticated, getUser);
router.delete("/:id", requireAuthenticated, deleteUser);
export default router;
