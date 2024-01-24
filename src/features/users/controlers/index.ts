import { NextFunction, Request, Response } from "express";
import { userRepo } from "../repositories";
import { UserRequest } from "../../../shared/types";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userRepo.findAll();
    return res.json({ results: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id)
      throw { status: 404, errors: { detail: "User not found" } };
    const users = await userRepo.findOneById(req.params.id);
    return res.json({ results: users });
  } catch (error) {
    next(error);
  }
};

export const viewProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json((req as UserRequest).user);
  } catch (error) {
    next(error);
  }
};
