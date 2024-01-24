import { z } from "zod";
import { Login, Register } from "../schema";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { userRepo } from "../../users/repositories";
import { AccountModel } from "../models";
import {
  sign,
  verify,
  decode,
  TokenExpiredError,
  VerifyErrors,
  JsonWebTokenError,
} from "jsonwebtoken";
import { configuration } from "../../../utils";
import { TokenPayload } from "../../../shared/types";

class AuthRepository {
  async credentialsSignUp(data: z.infer<typeof Register>) {
    const { password } = data;
    const hash = await this.hashPassword(password);
    const user = await userRepo.create({ ...data, password: hash });
    const { accessToken, refreshToken } = this.generateUserToken(user);
    const account = await AccountModel.create({
      data: {
        provider: "Credentials",
        type: "credentials",
        userId: user.id,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
    return await userRepo.findOneById(user.id);
  }

  async register(data: z.infer<typeof Register>) {
    const { password } = data;
    const hash = await this.hashPassword(password);
    const user = await userRepo.create({ ...data, password: hash });

    return user;
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

  /**
   * Decordes jwt token to extract Id and gets user with Id
   * @param token {string}
   * @throws Unauthorized exception with status 401
   * @returns {User} object
   */
  async getUserByToken(token: string) {
    if (!token) {
      throw { status: 401, detail: "Unauthorized - Token required" };
    }
    try {
      const { id, type: tokenType }: TokenPayload = verify(
        token,
        configuration.oauth.auth_secrete
      ) as TokenPayload;
      if (tokenType !== "access") throw Error();
      const user = await userRepo.findOneById(id);
      return user;
    } catch (error) {
      let detail;
      if (error instanceof TokenExpiredError) {
        detail = "Unauthorized - Token expired";
      } else if (error instanceof JsonWebTokenError) {
        detail = "Unauthorized - Invalid Token";
      } else {
        detail = "Unauthorized - Invalid Token";
      }
      throw { status: 401, detail };
    }
  }
  async refreshUserToken(token: string) {
    if (!token) {
      throw { status: 401, detail: "Unauthorized - Token required" };
    }
    try {
      const { id, type: tokenType }: TokenPayload = verify(
        token,
        configuration.oauth.auth_secrete
      ) as TokenPayload;
      if (tokenType !== "refresh") throw Error();
      const user = await userRepo.findOneById(id);
      return this.generateUserToken(user)
    } catch (error) {
      let detail;
      if (error instanceof TokenExpiredError) {
        detail = "Unauthorized - Token expired";
      } else if (error instanceof JsonWebTokenError) {
        detail = "Unauthorized - Invalid Token";
      } else {
        detail = "Unauthorized - Invalid Token";
      }
      throw { status: 401, detail };
    }
  }

  generateUserToken(user: User) {
    const accessPayload: TokenPayload = { id: user.id, type: "access" };
    const refreshPayload: TokenPayload = { id: user.id, type: "refresh" };
    const accessToken = sign(accessPayload, configuration.oauth.auth_secrete, {
      expiresIn: configuration.oauth.access_token_age,
    });
    const refreshToken = sign(
      refreshPayload,
      configuration.oauth.auth_secrete,
      {
        expiresIn: configuration.oauth.refresh_token_age,
      }
    );
    return { accessToken, refreshToken };
  }

  async getUserProviderAccount(user: User, provider: string) {
    const account = await AccountModel.findFirst({
      where: { userId: user.id, provider },
    });
    return account;
  }
}
export default AuthRepository;
