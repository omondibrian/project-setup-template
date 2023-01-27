import { DataException } from "@Domain/exceptions/data_exceptions";
import { IUser } from "@Domain/user/dtos/user_dto";
import { IUserRepository } from "@Domain/user/repository/user_repository";
import TYPES from "@Utils/ioc_types";
import Logger from "@Utils/logger";
import { ResultPayload } from "@Utils/result";
import { inject, injectable } from "inversify";

/**
 * @description contains implementation user service operations
 */
export interface IUserService {
  create(
    data: Omit<IUser, "id">
  ): Promise<ResultPayload<IUser> | ResultPayload<Error>>;
  updateUserInfo(
    options: { field: "email" | "id"; value: string },
    data: Partial<IUser>
  ): Promise<ResultPayload<IUser> | ResultPayload<Error>>;
  findUser(data: {
    field: "email" | "id";
    value: string;
  }): Promise<ResultPayload<IUser> | ResultPayload<Error>>;
  removeSelectedUser(
    id: string
  ): Promise<ResultPayload<IUser> | ResultPayload<Error>>;
}
@injectable()
class UserServiceImpl implements IUserService {
  private readonly repo: IUserRepository;
  constructor(@inject(TYPES.IUserRepository) repository: IUserRepository) {
    this.repo = repository;
  }
  create = async (
    data: Omit<IUser, "id">
  ): Promise<ResultPayload<IUser> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.insert(data);
      if(res instanceof DataException) throw res;
      return new ResultPayload<IUser>(res, 201);
    } catch (error: any) {
       Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV !== "production"
            ? error
            : "error creating new user  🔥🔥"
        ),
        500
      );
    }
  };

  updateUserInfo = async (
    options: { field: "id" | "email"; value: string },
    data: Partial<IUser>
  ): Promise<ResultPayload<IUser> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.update(options, data);
      if(res instanceof DataException) throw res;
      return new ResultPayload<IUser>(res, 201);
    } catch (error: any) {
       Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error updating user info  🔥🔥"
        ),
        500
      );
    }
  };
  findUser = async (data: {
    field: "id" | "email";
    value: string;
  }): Promise<ResultPayload<IUser> | ResultPayload<Error>> => {
    try {
      let res: IUser |  DataException;
      if (data.field !== "id") {
        res = await this.repo.find({
          field: "email",
          value: data.value,
        });
      } else {
        res = await this.repo.findById(data.value);
      }
      if (res instanceof DataException){
        Logger.warn(`User with ${data.field} = ${data.value} not Found`);
         throw res;
      }
      return new ResultPayload<IUser>(res, 201);
    } catch (error: any) {
       Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error retriving the specified user  🔥🔥"
        ),
        500
      );
    }
  };
  removeSelectedUser = async (
    id: string
  ): Promise<ResultPayload<IUser> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.Delete(id);
      if(res instanceof DataException) throw res;
      return new ResultPayload<IUser>(res, 201);
    } catch (error: any) {
       Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error while deleting the selected user  🔥🔥"
        ),
        500
      );
    }
  };
}

export default UserServiceImpl;


