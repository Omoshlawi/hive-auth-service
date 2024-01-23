import { Router } from "express";
import { default as oauthSignInRoutes } from "./signin";
const router = Router();
router.use("/signin", oauthSignInRoutes);
router.get("users")
export default router;
