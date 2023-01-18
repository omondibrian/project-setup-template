import "reflect-metadata";
import "module-alias/register";

import UserServiceImpl, { IUserService } from "@Application/user/user.service";
import PostServiceImpl,{ IPostService } from "@Application/post/post.service";
import { IPostRepository } from "@Domain/posts/repository/posts_repository";
import { IUserRepository } from "@Domain/user/repository/user_repository";
import { PostRepositoryImpl } from "@Infranstructure/post/repository/post_repository_impl";
import { UserRepositoryImpl } from "@Infranstructure/user/repositories/user_repository_impl";
import TYPES from "@Utils/ioc_types";
import { Container } from "inversify";


const appContainer = new Container();
appContainer.bind<IUserService>(TYPES.IUserService).to(UserServiceImpl).inSingletonScope();
appContainer.bind<IPostService>(TYPES.IPostService).to(PostServiceImpl).inSingletonScope();
appContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryImpl).inSingletonScope();
appContainer.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepositoryImpl).inSingletonScope();
export { appContainer };
