import * as express from "express";
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpDelete,
  request,
  response,
  requestParam,
  httpPut,
} from "inversify-express-utils";
import { inject } from "inversify";
import TYPES from "@Utils/ioc_types";
import { IPostService } from "@Application/post/post.service";
import { IPost } from "@Domain/posts/dtos/post_dto";

@controller("/post")
class PostController implements interfaces.Controller {
  constructor(@inject(TYPES.IPostService) private postService: IPostService) {}

  @httpPost("/")
  private async create(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const result = await this.postService.create(req.body);
    res.status(result!.status).json({
      post: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
  @httpPut("/")
  private async update(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const requestPayload: postsUpdateRequest = {
      postId: req.body.postId,
      data: req.body.data,
    };

    const result = await this.postService.updatePost(
      requestPayload.postId,
      requestPayload.data
    );
    res.status(result!.status).json({
      post: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
  @httpGet("/:id")
  private async fetchpost(
    @requestParam("id") id: string,
    @response() res: express.Response
  ) {
    const result = await this.postService.findSinglePost(id)
    res.status(result!.status).json({
      post: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }

  @httpGet("/")
  private async fetchposts(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const result = await this.postService.fetchAvailablePosts()
    res.status(result!.status).json({
      post: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
  @httpDelete("/:id")
  private async delete(
    @requestParam("id") id: string,
    @response() res: express.Response
  ) {
    const result = await this.postService.removeSelectedPost(id)
    res.status(result!.status).json({
      post: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
}


export default PostController;
type postsUpdateRequest = {
  postId:string,
  data: Partial<IPost>;
};
