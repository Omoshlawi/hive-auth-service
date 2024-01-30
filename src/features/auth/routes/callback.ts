import { Router } from "express";
import { googleSignInCallback } from "../controlers";

const router = Router();

router.get("/google", googleSignInCallback);

export default router;
