import { DataException } from "@Domain/exceptions/data_exceptions";
import { IPost } from "../dtos/post_dto";

export interface IPostRepository {
    insert(data: Omit<IPost, "id">): Promise<IPost| DataException>;
    update(
      id: string,
      data: Partial<IPost>
    ): Promise<IPost  | DataException>;
    findAll(): Promise<Array<IPost> | DataException>;
    findById(id: string): Promise<IPost | DataException>;
    delete(id: string): Promise<IPost|DataException>;
  }
  