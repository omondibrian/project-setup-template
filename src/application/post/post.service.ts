import { DataException } from "@Domain/exceptions/data_exceptions";
import { IPost } from "@Domain/posts/dtos/post_dto";
import { IPostRepository } from "@Domain/posts/repository/posts_repository";
import TYPES from "@Utils/ioc_types";
import Logger from "@Utils/logger";
import { ResultPayload } from "@Utils/result";
import { inject, injectable } from "inversify";

export interface IPostService {
  create(
    data: Omit<IPost, "id">
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>>;
  updatePost(
    postId: string,
    data: Partial<IPost>
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>>;
  findSinglePost(
    id: string
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>>;
  fetchAvailablePosts(): Promise<
    ResultPayload<Array<IPost>> | ResultPayload<Error>
  >;
  removeSelectedPost(
    id: string
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>>;
}
@injectable()
class PostServiceImpl implements IPostService {
  private readonly repo: IPostRepository;
  constructor(@inject(TYPES.IPostRepository) repository: IPostRepository) {
    this.repo = repository;
  }
  create = async (
    data: Omit<IPost, "id">
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.insert(data);
      if(res instanceof DataException) throw res;
      return new ResultPayload<IPost>(res, 201);
    } catch (error: any) {
      Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV !== "production"
            ? error
            : "error while creating post 🔥🔥"
        ),
        500
      );
    }
  };
  updatePost = async (
    postId: string,
    data: Partial<IPost>
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.update(postId, data);
      if(res instanceof DataException) throw res;
      return new ResultPayload<IPost>(res, 201);
    } catch (error: any) {
      Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error while updating post 🔥🔥"
        ),
        500
      );
    }
  };
  findSinglePost = async (
    id: string
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.findById(id);
      if(res instanceof DataException) throw res;
      if (res === undefined){
        Logger.warn(`The specified post -(${id})  was not found`);
        throw new Error("The specified post was not found");
      }

      return new ResultPayload<IPost>(res, 201);
    } catch (error: any) {
      Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error while retriving post 🔥🔥"
        ),
        500
      );
    }
  };
  fetchAvailablePosts = async (): Promise<
    ResultPayload<Array<IPost>> | ResultPayload<Error>
  > => {
    try {
      const res = await this.repo.findAll();
      if(res instanceof DataException) throw res;
      return new ResultPayload<Array<IPost>>(res || [], 201);
    } catch (error: any) {
      Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error while retriving posts 🔥🔥"
        ),
        500
      );
    }
  };
  removeSelectedPost = async (
    id: string
  ): Promise<ResultPayload<IPost> | ResultPayload<Error>> => {
    try {
      const res = await this.repo.delete(id);
      if(res instanceof DataException) throw res;
      return new ResultPayload<IPost>(res, 201);
    } catch (error: any) {
      Logger.error(error.message);
      return new ResultPayload<Error>(
        new Error(
          process.env.NODE_ENV != "production"
            ? error
            : "error while deleting post 🔥🔥"
        ),
        500
      );
    }
  };
}

export default PostServiceImpl;
