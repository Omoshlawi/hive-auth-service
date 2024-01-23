import { Router } from "express";
import { loginUser } from "../controlers";

const router = Router();
router.get("/credentials", loginUser);
export default router;
