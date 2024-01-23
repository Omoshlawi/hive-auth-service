import { NextFunction, Request, Response } from "express";
import { authRepo } from "../repositories";
import { Login, Register } from "../schema";
import { APIException } from "../../../shared/exceprions";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await Register.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const user = await authRepo.register(validation.data);
    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await Login.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const user = await authRepo.login(validation.data);
    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const authProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ action: "Auth Providers!" });
  } catch (error) {
    next(error);
  }
};
