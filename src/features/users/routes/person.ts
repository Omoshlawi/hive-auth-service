import { Router } from "express";
import {
  getPeople,
  createPerson,
  getPerson,
  updatePerson,
} from "../controlers";
import { requireAuthenticated } from "../../../middlewares";

const router = Router();
router.get("/", getPeople);
router.post("/", createPerson);
router.get("/:id", getPerson);
router.put("/:id", requireAuthenticated, updatePerson);
// router.delete("/:id", requireAuthenticated, deleteUser);
export default router;
