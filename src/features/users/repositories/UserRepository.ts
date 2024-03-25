import { Account, Person, Prisma, User } from "@prisma/client";
import { AccountModel, UserModel } from "../../auth/models";
import { isEmpty } from "lodash";
import { NotFoundException, ValidationException } from "../../../shared/types";

/**
 * Common Interfacefor ineracting with datasource to manage user, authenticate and authorize
 */

class UserRepository {
  selectFields: Prisma.UserSelect = {
    id: true,
    username: true,
    password: true,
    accounts: true,
    accountVerified: true,
    active: true,
    person: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        phoneNumber: true,
        image: true,
        name: true,

        createdAt: true,
        updatedAt: true,
      },
    },

    lastLogin: true,
    createdAt: true,
    updatedAt: true,
  };
  /**
   * creates user if no other user with unique fields like phoneNumber, email or username dont exist
   * @param entity User information sed to create new user
   * @returns {User} object
   * @throws {ValidationException} if user with unique field found
   */

  async create(entity: Partial<User> & Partial<Person>): Promise<User> {
    const errors: any = {};
    if (entity.username && (await this.exists({ username: entity.username })))
      errors["username"] = { _errors: ["Username taken"] };
    if (
      entity.email &&
      (await this.exists({ person: { email: entity.email } }))
    )
      errors["email"] = { _errors: ["Email taken"] };
    if (
      entity.phoneNumber &&
      (await this.exists({ person: { phoneNumber: entity.phoneNumber } }))
    )
      errors["phoneNumber"] = { _errors: ["phone number taken"] }; //Shape error to match zod formated validation error
    if (!isEmpty(errors)) throw { status: 400, errors }; //If errors object has properties then throw exeption
    return await UserModel.create({
      data: {
        username: entity.username,
        password: entity.password,
        person: {
          create: {
            phoneNumber: entity.phoneNumber,
            email: entity.email,
            firstName: entity.firstName,
            lastName: entity.firstName,
            gender: entity.gender,
            image: entity.image as any,
            name: entity.name,
          },
        },
      },
      select: this.selectFields,
    });
  }
  /**
   * Finds user with specified id
   * @param id User unique id
   * @throws {NotFoundException}
   * @returns {User} user object
   */
  async findOneById(id: string): Promise<User> {
    const user = await UserModel.findFirst({
      where: { id },
      select: this.selectFields,
    });
    if (!user) throw { status: 404, errors: { detail: "User not found" } };
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
                type: account.type,
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
   * @param user User object to be linked wuth account object
   * @returns {boolean} true if linkage successfull or link already existed otherwise false
   * @todo Complee the linkage
   */
  async linkAccount(user: User, account: Account): Promise<boolean> {
    const user_ = await this.findByAccount(account);
    // Link if no link exist for he account
    if (!user_ || user.id !== user_.id) {
      await AccountModel.update({
        where: { id: account.id },
        data: { userId: user.id },
      });
      return true;
    }
    // check if already linked and return true
    if (user.id === user_.id) {
      return true;
    }
    return false;
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
      select: this.selectFields,
    });
  }
  /**
   * updates user if no other user with unique fields like phoneNumber, email or username dont exist
   * @param id - user to update its information
   * @param updates user information to be updated
   * @throws {ValidationException}
   * @returns updated user
   */
  async updateById(
    id: string,
    updates: Partial<User> & Partial<Person>
  ): Promise<User> {
    const currUser = await this.findOneById(id);
    const errors: any = {};
    if (updates.username) {
      const newUser = await UserModel.findFirst({
        where: {
          AND: [
            { username: updates.username },
            { id: { not: { equals: currUser.id } } }, // Exclude the user being updated
          ],
        },
      });
      if (newUser) errors["username"] = { _errors: ["Username taken"] };
    }
    if (updates.email) {
      const newUser = await UserModel.findFirst({
        where: {
          AND: [
            { person: { email: updates.email } },
            { id: { not: { equals: currUser.id } } }, // Exclude the user being updated
          ],
        },
      });
      if (newUser) errors["email"] = { _errors: ["Email taken"] };
    }
    if (updates.phoneNumber) {
      const newUser = await UserModel.findFirst({
        where: {
          AND: [
            { person: { phoneNumber: updates.phoneNumber } },
            { id: { not: { equals: currUser.id } } },
          ],
        },
      });
      if (newUser) errors["phoneNumber"] = { _errors: ["Phone number taken"] };
    }
    if (!isEmpty(errors)) throw { status: 400, errors };
    const {
      accountVerified,
      active,
      email,
      firstName,
      gender,
      image,
      lastName,
      name,
      phoneNumber,
      username,
    } = updates;
    return (await UserModel.update({
      where: { id },
      data: {
        accountVerified,
        username,
        active,
        person: {
          update: {
            firstName,
            lastName,
            name,
            gender,
            email,
            image: image as any,
            phoneNumber,
          },
        },
      },
      select: this.selectFields,
    }))!;
  }
  async deleteById(id: string): Promise<User> {
    return await UserModel.delete({ where: { id } });
  }
}

export default UserRepository;
