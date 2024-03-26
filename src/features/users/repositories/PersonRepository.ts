import { $Enums, Person, Prisma } from "@prisma/client";
import { Repository } from "../../../shared/types";
import { PersonModel } from "../../auth/models";
import logger from "../../../shared/logger";
import MessageBroker from "../../../shared/MessageBroker";
import { configuration, messageBroker } from "../../../utils";

class PersonRepository implements Repository<Person> {
  
  selectFields: Prisma.PersonSelect = {
    id: true,
    firstName: true,
    lastName: true,
    name: true,
    email: true,
    gender: true,
    image: true,
    phoneNumber: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  };
  create(entity: Partial<Person>): Promise<Person> {
    return PersonModel.create({
      select: this.selectFields,
      data: { ...entity, image: entity.image as any },
    });
  }
  async findOneById(id: string): Promise<Person | undefined> {
    const person = await PersonModel.findUnique({
      where: { id },
      select: this.selectFields,
    });
    return person ?? undefined;
  }
  findAll(): Promise<Person[]> {
    return PersonModel.findMany({ select: this.selectFields });
  }
  findByCriteria(criteria: Prisma.PersonWhereInput): Promise<Person[]> {
    return PersonModel.findMany({ where: criteria, select: this.selectFields });
  }
  async updateById(
    id: string,
    updates: Partial<Person>
  ): Promise<Person | undefined> {
    const person = await PersonModel.update({
      where: { id },
      data: { ...updates, image: updates.image as any },
      select: this.selectFields,
    });
    return person ?? undefined;
  }
  async deleteById(id: string): Promise<void> {
    await PersonModel.delete({ where: { id } });
    return;
  }
  async exists(criteria: Prisma.PersonWhereInput): Promise<boolean> {
    const person = await PersonModel.findFirst({ where: criteria });
    return person !== null;
  }
}

export default PersonRepository;
