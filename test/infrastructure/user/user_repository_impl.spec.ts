import "reflect-metadata";
import "module-alias/register";
import { IUser } from "@Domain/user/dtos/user_dto";
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  beforeAll,
  vi,
  afterEach,
} from "vitest";
import { cleanUpMetadata } from "inversify-express-utils";
import { UserRepositoryImpl } from "@Infranstructure/user/repositories/user_repository_impl";
import Prisma from "@Utils/__mocks__/prismaClient";
import { DataException } from "@Domain/exceptions/data_exceptions";
import prisma from "@Utils/prismaClient";
vi.mocked("@Utils/prismaClient");
describe("User Repository Implementation", () => {
  const testUser: IUser = {
    email: "test@site.com",
    name: "John Doe",
    id: 1,
  };
  beforeEach((done) => {
    cleanUpMetadata();
    done;
  });
  let repo: UserRepositoryImpl;
  let currentUserId = 0;
  beforeAll(async () => {
    repo = new UserRepositoryImpl();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("User Repository - insert", () => {
    it("should be able to add new user entry on invocation", async () => {
      Prisma.user.create.mockResolvedValue({ ...testUser, id: 1 });
      const { email, name } = testUser;
      const user = (await repo.insert({ email, name })) as IUser;
      currentUserId = +user.id!;
      expect(user).toStrictEqual({ ...testUser, id: user.id });
    });
    it("should throw a DataExeception when it receives a database exception", async () => {
      const { email, name } = testUser;
      const result = await repo.insert({ email, name });
      expect(result).toBeInstanceOf(DataException);
    });
  });

  describe("User Repository - update", () => {
    it("should  successfully update user information ", async () => {
      const user = (await repo.update(
        {
          field: "email",
          value: testUser.email,
        },
        {
          name: "Jane Doe",
        }
      )) as IUser;
      expect(user).toStrictEqual({
        ...testUser,
        id: user.id,
        name: "Jane Doe",
      });
    });
    it("should return DataException incase of an error", async () => {
      const user = await repo.update(
        {
          field: "email",
          value: "test@site.web",
        },
        {
          name: "Jane Doe",
        }
      );
      expect(user).toBeInstanceOf(DataException);
    });
  });
  describe("User Repository - findById", () => {
    it("should  successfully retrive user information ", async () => {
      const user = (await repo.findById(currentUserId + "")) as IUser;
      expect(user).toStrictEqual({
        ...testUser,
        id: user.id,
        name: "Jane Doe",
      });
    });
    it("should return DataException incase the requested user is not found", async () => {
      const user = await repo.findById("0");
      expect(user).toBeInstanceOf(DataException);
    });
    it("should return DataException incase of an error", async () => {
      const user = await repo.findById("0");
      expect(user).toBeInstanceOf(DataException);
    });
  });
  describe("User Repository - find", () => {
    it("should  successfully retrive user information based on the id passed ", async () => {
      const user = (await repo.find({
        field: "email",
        value: testUser.email,
      })) as IUser;
      expect(user).toStrictEqual({
        ...testUser,
        id: user.id,
        name: "Jane Doe",
      });
    });
    it("should return DataException incase the requested user is not found", async () => {
      const user = await repo.findById("0");
      expect(user).toBeInstanceOf(DataException);
    });
    it("should return DataException incase of an error", async () => {
      const user = await repo.findById("0");
      expect(user).toBeInstanceOf(DataException);
    });
  });
  describe("User Repository - Delete", () => {
    
    it("should  successfully delete user information based on the id passed ",async () => {
      const user = await repo.Delete(currentUserId+'') as IUser;
      console.log(user)
      expect(user).toBeDefined()
      expect(user).toEqual({
         ...testUser,
        id: user.id,
        name: "Jane Doe",})
    });
    it("should return DataException incase of an error",async  () => {
      const user = await repo.Delete('0');
      expect(user).instanceOf(DataException)

    });
  });
});
