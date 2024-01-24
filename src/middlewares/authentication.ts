import config from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../shared/types";
import { userRepo } from "../features/users/repositories";
import { authRepo } from "../features/auth/repositories";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-access-token");
  if (!token)
    return res.status(401).json({ detail: "Unauthorized - Token missing" });
  try {
    const user = await authRepo.getUserByToken(token);
    (req as UserRequest).user = user;
    return next();
  } catch (err: any) {
    if (err.status) return res.status(err.status).json({ detail: err.detail });
    return res.status(401).json({ detail: "Unauthorized - Invalid token" });
  }
};

export default authenticate;
