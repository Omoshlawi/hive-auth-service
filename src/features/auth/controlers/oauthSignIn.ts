import { NextFunction, Request, Response } from "express";
import { getGoogleAuthUrl, getProfileInfo } from "../../../utils";

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.redirect(getGoogleAuthUrl());
  } catch (e: any) {
    res.status(401).json({ detail: e.message });
  }
};
