import { Router } from "express";
import { loginUser } from "../controlers";

const router = Router();
router.post("/credentials", loginUser);
export default router;
