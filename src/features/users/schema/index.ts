import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  username: z.string().min(4).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  image: z.object({
    _id: z.string(),
    path: z.string(),
  }).optional(),
});
