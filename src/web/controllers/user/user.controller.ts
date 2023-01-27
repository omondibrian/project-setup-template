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
  BaseHttpController,
} from "inversify-express-utils";
import { inject } from "inversify";
import TYPES from "@Utils/ioc_types";
import { IUserService } from "@Application/user/user.service";
import { IUser } from "@Domain/user/dtos/user_dto";
@controller("/user")
class UserController
  extends BaseHttpController
  implements interfaces.Controller
{
  constructor(@inject(TYPES.IUserService) private userService: IUserService) {
    super();
  }

  @httpPost("/")
  public async create(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const result = await this.userService.create(req.body);

    return this.json(
      {
        user: result!.getResult().payload,
        message: result!.getResult().message,
      },
      result!.status
    );
  }

  @httpPut("/profile")
  public async update(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const requestPayload: UserUpdateRequest = {
      option: req.body.option,
      data: req.body.data,
    };
    const result = await this.userService.updateUserInfo(
      requestPayload.option,
      requestPayload.data
    );
    return this.json(
      {
        user: result!.getResult().payload,
        message: result!.getResult().message,
      },
      result!.status
    );
  }

  @httpGet("/:id")
  public async fetchUser(
    @requestParam("id") id: string,
    @response() res: express.Response
  ) {
    const result = await this.userService.findUser({
      field: "id",
      value: id,
    });
    return this.json(
      {
        user: result!.getResult().payload,
        message: result!.getResult().message,
      },
      result!.status
    );
  }

  @httpDelete("/:id")
  public async delete(
    @requestParam("id") id: string,
    @response() res: express.Response
  ) {
    const result = await this.userService.removeSelectedUser(id);
    return this.json(
      {
        user: result!.getResult().payload,
        message: result!.getResult().message,
      },
      result!.status
    );
  }
}

export default UserController;

type UserUpdateRequest = {
  option: { field: "id" | "email"; value: string };
  data: Partial<IUser>;
};
