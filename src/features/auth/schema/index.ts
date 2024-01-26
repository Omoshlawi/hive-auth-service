import { z } from "zod";
export const Register = z
  .object({
    name: z.string().min(1).optional(),
    username: z.string().min(4),
    email: z.string().email(),
    phoneNumber: z.string(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    image: z.string().optional(),
    password: z.string().min(4),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must much",
    path: ["confirmPassword"],
  });

export const Login = z.object({
  identifier: z.string().min(1, { message: "Identifier required" }),
  password: z.string().min(4, { message: "Password required" }),
});
