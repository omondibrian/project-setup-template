import { injectable } from "inversify";

import { IUser } from "@Domain/user/dtos/user_dto";
import { DataException } from "@Domain/exceptions/data_exceptions";
import { IUserRepository } from "@Domain/user/repository/user_repository";
import type { PrismaClient, User } from "@prisma/client";
import Logger from "@Utils/logger";
import Prisma from "@Utils/prismaClient"

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  private readonly dbConn: PrismaClient =Prisma ;

  private formatUserInput = (user: User): IUser => {
    return { email: user.email, id: user.id, name: user.name + "" };
  };
  insert = async (data: Omit<IUser, "id">): Promise<IUser | DataException> => {
    try {
      const res = await this.dbConn.user.create({ data });
      return this.formatUserInput(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  update = async (
    options: { field: "id" | "email"; value: string },
    data: Partial<IUser>
  ): Promise<IUser | DataException> => {
    try {
      const existingDetails = await this.find({
        field: options.field,
        value: options.value,
      });
      if (existingDetails instanceof DataException) return existingDetails;
      const res = await this.dbConn.user.update({
        data: {
          ...existingDetails,
          ...data,
        },
        where: {
          id: existingDetails.id,
        },
      });
      return this.formatUserInput(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  find = async (data: {
    field: "id" | "email";
    value: string;
  }): Promise<IUser | DataException> => {
    try {
      const where = { [data.field]: data.field === "id" ?  + data.value : data.value}
      const res = await this.dbConn.user.findUnique({  where  });
      if (res === null) return new DataException("Resource not found", 404);
      return this.formatUserInput(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  findById = async (id: string): Promise<IUser | DataException> => {
    try {
      const res = await this.dbConn.user.findUnique({
        where: { id: +id },
      });
      if (res === null) return new DataException("Resource not found", 404);
      return this.formatUserInput(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  Delete = async (id: string): Promise<IUser | DataException> => {
    try {
      const res = await this.dbConn.user.delete({
        where: { id: +id },
      });
      return this.formatUserInput(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
}
