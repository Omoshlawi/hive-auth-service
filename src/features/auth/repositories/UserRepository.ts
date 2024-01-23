import { Account, Prisma, User } from "@prisma/client";
import { UserModel } from "../models";
import { isEmpty } from "lodash";

/**
 * Common Interfacefor ineracting with datasource to manage user, authenticate and authorize
 */

class UserRepository {
  /**
   * creates user if no other user with unique fields like phoneNumber, email or username dont exist
   * @param entity User information sed to create new user
   * @returns {User} object
   * @throws {{status: 400, errrors: Record<string, any>}} if user with unique field found
   */
  async create(entity: User): Promise<User> {
    const errors: any = {};
    if (entity.username && (await this.exists({ username: entity.username })))
      errors["username"] = { _errors: ["Username taken"] };
    if (entity.email && (await this.exists({ email: entity.email })))
      errors["email"] = { _errors: ["Email taken"] };
    if (
      entity.phoneNumber &&
      (await this.exists({ phoneNumber: entity.phoneNumber }))
    )
      errors["phoneNumber"] = { _errors: ["Username taken"] }; //Shape error to match zod formated validation error
    if (!isEmpty(errors)) throw { status: 400, errors }; //If errors object has properties then throw exeption
    return await UserModel.create({
      data: entity,
    });
  }
  /**
   * Finds user with specified id
   * @param id User unique id
   * @returns {User} if user exist otherwise null
   */
  async findOneById(id: string): Promise<User | null> {
    const user = await UserModel.findFirst({ where: { id } });
    return user;
  }
  /**
   * Findes user by account using account id or combination of fields provider and providerAccountId which is a unique combination(compound key)
   * Mostly use full in oauth
   * @param account Account Object used to search user
   * @returns {User} if does exist else null
   */
  async findByAccount(account: Account): Promise<User | null> {
    return await UserModel.findFirst({
      where: {
        accounts: {
          some: {
            OR: [
              {
                id: account.id,
              },
              {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            ],
          },
        },
      },
    });
  }
  /**
   * Links a user to account if not already linked
   * @param account Account bject to be linked wuth user object
   * @returns {boolean} true if linkage successfull or link already existed otherwise false
   * @todo Complee the linkage
   */
  async linkAccount(account: Account): Promise<boolean> {
    // check if already linked and return true
    if (await this.findByAccount(account)) return true;
    // Ensure account is not linked to other user
    //
    return true
  }
  /**
   * Checks if User object matching creatiria exists
   * @param where Condition used to evalute user existnce
   * @returns {boolean} true if exist else false
   */
  async exists(where: Prisma.UserWhereInput): Promise<boolean> {
    const user = await UserModel.findFirst({ where });
    return user ? true : false;
  }
  async findOne(where: Prisma.UserWhereInput): Promise<User | null> {
    const user = await UserModel.findFirst({ where });
    return user;
  }
  async findAll(): Promise<User[]> {
    return await UserModel.findMany();
  }
  async findByCriteria(criteria: Prisma.UserWhereInput): Promise<User[]> {
    return await UserModel.findMany({
      where: criteria,
    });
  }
  async updateById(
    id: string,
    updates: Partial<User>
  ): Promise<User | undefined> {
    return await UserModel.update({ where: { id }, data: updates });
  }
  async deleteById(id: string): Promise<User> {
    return await UserModel.delete({ where: { id } });
  }
}
