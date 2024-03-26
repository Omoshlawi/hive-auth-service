import { NextFunction, Request, Response } from "express";
import { personRepo } from "../repositories";
import { z } from "zod";
import { PersonSchema } from "../schema";
import { APIException } from "../../../shared/exceprions";

export const getPeople = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const people = await personRepo.findAll();
    return res.json({ results: people });
  } catch (error) {
    next(error);
  }
};

export const getPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !z.string().uuid().safeParse(req.params.id).success ||
      !(await personRepo.exists({ id: req.params.id }))
    )
      throw { status: 404, errors: { detail: "Person not found" } };
    const person = await personRepo.findOneById(req.params.id);
    return res.json(person);
  } catch (error) {
    next(error);
  }
};

export const createPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PersonSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const person = await personRepo.create(validation.data);
    return res.json(person);
  } catch (error) {
    next(error);
  }
};
export const updatePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !z.string().uuid().safeParse(req.params.id).success ||
      !(await personRepo.exists({ id: req.params.id }))
    )
      throw { status: 404, errors: { detail: "Person not found" } };
    const validation = await PersonSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const person = await personRepo.updateById(req.params.id, validation.data);
    return res.json(person);
  } catch (error) {
    next(error);
  }
};
