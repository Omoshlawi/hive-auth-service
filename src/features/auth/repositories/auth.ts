import { z } from "zod";
import { Login, Register } from "../schema";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { userRepo } from "../../users/repositories";

class AuthRepository {
  async register(data: z.infer<typeof Register>) {
    const { password } = data;
    const hash = await this.hashPassword(password);
    return await userRepo.create({ ...data, password: hash });
  }
  async login({ identifier, password }: z.infer<typeof Login>) {
    const users = await userRepo.findByCriteria({
      OR: [
        { username: identifier },
        { email: identifier },
        { phoneNumber: identifier },
      ],
    });
    const passwordChecks = await Promise.all(
      users.map((user) => this.checkPassword(user, password))
    );
    if (passwordChecks.every((val) => val === false))
      throw {
        errors: {
          password: { _errors: ["Invalid username or password"] },
          identifier: { _errors: ["Invalid username or password"] },
        },
        status: 400,
      };
    return users[passwordChecks.findIndex((val) => val)];
  }

  async checkPassword(user: User, password: string) {
    const valid = await bcrypt.compare(password, user.password!);
    return valid;
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
export default AuthRepository;
