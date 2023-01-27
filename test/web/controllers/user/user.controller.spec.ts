import "reflect-metadata";
import "module-alias/register";
import { Container, interfaces } from "inversify";
import {
  cleanUpMetadata,
  InversifyExpressServer,
} from "inversify-express-utils";
import type { Request, Response } from "express";
import { describe, beforeEach, expect, it, vi } from "vitest";

import { mock } from "vitest-mock-extended";
import { IUser } from "@Domain/user/dtos/user_dto";
import UserController from "@Web/controllers/user/user.controller";
import UserServiceImpl, { IUserService } from "@Application/user/user.service";
import { IUserRepository } from "@Domain/user/repository/user_repository";
import { appContainer } from "src/inversify.config";
import TYPES from "@Utils/ioc_types";
import { ResultPayload } from "@Utils/result";

describe("UserController", () => {
  let controller: UserController;
  let service: IUserService;
  const mockedRequest = mock<Request>();
  const mockedResponse = mock<Response>();

  beforeEach(() => {
    cleanUpMetadata();
    service = appContainer.get<IUserService>(TYPES.IUserService);
    controller = new UserController(service);
  });

  const testUser: IUser = {
    email: "test@test.com",
    name: "John Doe",
  };
  let currentId = 0;
  describe("# create", () => {
    it("should successfully post a new user record", async () => {
      mockedRequest.body = testUser;
      mockedResponse.json.mockImplementationOnce((data) => data);
      const res = await controller.create(mockedRequest, mockedResponse);
      expect(res.statusCode).toEqual(201);
      const { email, name, id } = res.json.user;
      currentId = id;
      expect({ email, name }).toStrictEqual(testUser);
    });

    it("should return an error message when duplicate emails are passed", async () => {
      mockedRequest.body = testUser;
      mockedResponse.json.mockImplementationOnce((data) => data);
      const createSpy = vi
        .spyOn(service, "create")
        .mockImplementationOnce(async (args) => {
          return new ResultPayload<Error>(
            new Error("error creating new user  🔥🔥"),
            500
          );
        });
      const res = await controller.create(mockedRequest, mockedResponse);
      expect(res.statusCode).toEqual(500);
      expect(res.json.message).toBeDefined();
      expect(res.json.user).toBeUndefined();
      expect(createSpy).toBeCalledTimes(1);
      createSpy.mockClear();
    });
  });

  describe("# update", () => {
    it("should update the requested user field", async () => {
      //arrage
      const body = {
        option: {
          field: "id",
          value: currentId,
        },
        data: {
          name: "PlatCorp User",
        },
      };
      mockedRequest.body = body;
      mockedResponse.json.mockImplementationOnce((data) => data);
      //act
      const res = await controller.update(mockedRequest, mockedResponse);
      //assert
      expect(res.statusCode).toEqual(201);
      expect(res.json.user.name).toEqual("PlatCorp User");
    });
  });

  describe("# fetchUser", () => {
    it("should return the requested user based on the id param", async () => {
      //arrage
      mockedResponse.json.mockImplementationOnce((data) => data);
      //act
      const res = await controller.fetchUser(currentId + "", mockedResponse);
      //assert
      expect(res.statusCode).toEqual(201);
      expect(res.json.user.id).toEqual(currentId);
    });
  });

  describe("# delete", () => {
    it("should return data for the currently deleted user", async () => {
      //arrage
      mockedResponse.json.mockImplementationOnce((data) => data);
      //act
      const res = await controller.delete(currentId + "", mockedResponse);
      //assert
      expect(res.statusCode).toEqual(201);
      expect(res.json.user.id).toEqual(currentId);
    });
  });
});
