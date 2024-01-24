import { NextFunction, Request, Response } from "express";
import { authRepo } from "../repositories";
import { Login, Register } from "../schema";
import { APIException } from "../../../shared/exceprions";
import { omit } from "lodash";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await Register.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const user = await authRepo.credentialsSignUp(
      omit(validation.data, ["confirmPassword"]) as any
    );
    const token = authRepo.generateUserToken(user);
    return res.json({ user, token });
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
    const token = authRepo.generateUserToken(user);
    return res.json({ user, token });
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


export const refreshToken =async (req:Request, res:Response, next:NextFunction) => {
  
  
}