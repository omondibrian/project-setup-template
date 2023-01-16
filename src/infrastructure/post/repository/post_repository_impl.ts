import { DataException } from "@Domain/exceptions/data_exceptions";
import { IPost } from "@Domain/posts/dtos/post_dto";
import { IPostRepository } from "@Domain/posts/repository/posts_repository";
import { Post } from "@prisma/client";
import TYPES from "@Utils/ioc_types";
import Logger from "@Utils/logger";
import { DBClient } from "@Utils/prismaClient";
import { inject, injectable } from "inversify";
@injectable()
export class PostRepositoryImpl implements IPostRepository {
  private readonly dbConn: DBClient;
  constructor(@inject(TYPES.DBClient) db: DBClient) {
    this.dbConn = db;
  }
  private returnPostPayload(res: Post): IPost {
    return {
      ...res,
      content: res.content + "",
    };
  }
  insert = async (data: Omit<IPost, "id">): Promise<IPost | DataException> => {
    try {
      const res = await this.dbConn.prisma.post.create({ data });
      return this.returnPostPayload(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };

  update = async (
    id: string,
    data: Partial<IPost>
  ): Promise<IPost | DataException> => {
    try {
      const res = await this.dbConn.prisma.post.update({
        data,
        where: {
          id: +id,
        },
      });
      return this.returnPostPayload(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  findAll = async (): Promise<IPost[] | DataException> => {
    try {
      const res = await this.dbConn.prisma.post.findMany();
      return res.map((p) => this.returnPostPayload(p));
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  findById = async (id: string): Promise<IPost | DataException> => {
    try {
      const res = await this.dbConn.prisma.post.findUnique({
        where: {
          id: +id,
        },
      });
      if (res === null) return new DataException("data not found", 500);
      return this.returnPostPayload(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
  delete = async (id: string): Promise<IPost | DataException> => {
    try {
      const res = await this.dbConn.prisma.post.delete({
        where: {
          id: +id,
        },
      });
      return this.returnPostPayload(res);
    } catch (error: any) {
      Logger.error(error.message)
      return new DataException(error.message, 500);
    }
  };
}
