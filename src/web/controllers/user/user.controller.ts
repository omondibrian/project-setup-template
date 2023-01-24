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
import { IUserService } from "@Application/user/user.service";
import { IUser } from "@Domain/user/dtos/user_dto";
@controller("/user")
class UserController implements interfaces.Controller {
  constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

  @httpPost("/")
  private async create(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const result = await this.userService.create(req.body);
    res.status(result!.status).json({
      user: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }


  @httpPut("/profile")
  private async update(
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
    res.status(result!.status).json({
      user: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }

  @httpGet("/:id")
  private async fetchUser(
    @requestParam("id") id: string,
    @response() res: express.Response
  ) {
    const result = await this.userService.findUser({
      field: "id",
      value: id,
    });
    res.status(result!.status).json({
      user: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }

  @httpDelete("/:id")
  private async delete(
    @requestParam("id") id: string,
    @response() res: express.Response
  ) {
    const result = await this.userService.removeSelectedUser(id);
    res.status(result!.status).json({
      user: result!.getResult().payload,
      message: result!.getResult().message,
    });
  }
}

export default UserController;

type UserUpdateRequest = {
  option: { field: "id" | "email"; value: string };
  data: Partial<IUser>;
};
