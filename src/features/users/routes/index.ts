import { Router } from "express";
import { getUser, getUsers } from "../controlers";

const router = Router();
router.get("/", getUsers);
router.get("/:id", getUser);
export default router;
