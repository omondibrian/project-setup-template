import { DataException } from "@Domain/exceptions/data_exceptions";
import { IUser } from "@Domain/user/dtos/user_dto";

export interface IUserRepository {
    insert(data: Omit<IUser, "id">): Promise<IUser| DataException>;
    update(
      options: { field: "email" | "id"; value: string },
      data: Partial<IUser>
    ): Promise<IUser| DataException>;
    find(data: {
      field: "email" | "id";
      value: string;
    }): Promise<IUser | DataException>;
    findById(id: string): Promise<IUser | DataException>;
    Delete(id: string): Promise<IUser| DataException>;
  }
  