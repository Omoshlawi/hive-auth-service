import { Router } from "express";
import { default as oauthSignInRoutes } from "./signin";
import { authProviders, registerUser } from "../controlers";
const router = Router();
router.use("/signin", oauthSignInRoutes);
router.use("/signup", registerUser);
router.get("/providers", authProviders);
export default router;
