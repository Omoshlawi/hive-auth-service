import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  username: z.string().min(4),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  image: z.string().optional(),
  password: z.string().min(4),
});
