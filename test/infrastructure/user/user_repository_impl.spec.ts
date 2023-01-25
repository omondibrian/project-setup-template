import "reflect-metadata";
import "module-alias/register";
import { IUser } from "@Domain/user/dtos/user_dto";
import {
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

vi.mock("@Utils/prismaClient");
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
      expect(Prisma.user.create).toHaveBeenCalled()
      expect(user).toStrictEqual({ ...testUser, id: 1 });
    });
    it("should throw a DataExeception when it receives a database exception", async () => {
      const { email, name } = testUser;
      const errorMsg = "testing db error"
      Prisma.user.create.mockImplementationOnce((args)=>{
        throw new Error(errorMsg);
        
      })
      const result = await repo.insert({ email, name }) ;
      expect(result).toBeInstanceOf(DataException);
      expect((result as DataException).message).toBe(errorMsg)
    });
  });

  describe("User Repository - update", () => {
    it("should  successfully update user information ", async () => {
      const spy = vi.spyOn(repo, 'find')
      spy.mockResolvedValueOnce(testUser)
      Prisma.user.update.mockResolvedValue({ ...testUser, id: 1,name: "Jane Doe", });
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
        name: "Jane Doe",
      });
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockClear()
    });
    it("should return DataException incase the requested user to update doen't exist",async()=>{
      const spy = vi.spyOn(repo, 'find')
      spy.mockResolvedValueOnce(new DataException("testing",500))
      const user = (await repo.update(
        {
          field: "email",
          value: testUser.email,
        },
        {
          name: "Jane Doe",
        }
      )) ;
      expect(user).toBeInstanceOf(DataException)
      expect(spy).toHaveBeenCalledOnce()
    })

    it("should return DataException incase of an error", async () => {
      const spy = vi.spyOn(repo, 'find')
      spy.mockResolvedValueOnce(testUser)
      Prisma.user.update.mockImplementationOnce((args)=>{
        throw new Error("error while test updating");
        
      })
      const user = await repo.update(
        {
          field: "email",
          value:  testUser.email,
        },
        {
          name: "Jane Doe",
        }
      );
      expect(user).toBeInstanceOf(DataException);
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockClear()
    });
  });
  describe("User Repository - findById", () => {
    it("should  successfully retrive user information ", async () => {
      Prisma.user.findUnique.mockResolvedValue({ ...testUser, id: 1 });
      const user = (await repo.findById(currentUserId + "")) as IUser;
      expect(user).toStrictEqual({
        ...testUser,
        id: user.id
      });
    });
    it("should return DataException incase the requested user is not found", async () => {
      Prisma.user.findUnique.mockResolvedValue(null);
      const user = await repo.findById("0");
      expect(user).toBeInstanceOf(DataException);
    });
    it("should return DataException incase of an error", async () => {
      Prisma.user.findUnique.mockImplementationOnce((args)=>{
        throw new Error("Error while testing");
        
      })
      const user = await repo.findById("0");
      expect(user).toBeInstanceOf(DataException);
    });
  });
  describe("User Repository - find", () => {
    it("should  successfully retrive user information based on the id passed ", async () => {
      Prisma.user.findUnique.mockResolvedValue({ ...testUser, id: 1 });
      const user = (await repo.find({
        field: "email",
        value: testUser.email,
      })) as IUser;
      expect(user).toStrictEqual({
        ...testUser,
        id: user.id,
      });
    });
    it("should return DataException incase the requested user is not found", async () => {
      Prisma.user.findUnique.mockResolvedValue(null);
      const user = (await repo.find({
        field: "email",
        value: testUser.email,
      })) as IUser;
      expect(user).toBeInstanceOf(DataException);
    });
    it("should return DataException incase of an error", async () => {
      Prisma.user.findUnique.mockImplementationOnce((args)=>{
        throw new Error("Error while testing");
        
      })
      const user = (await repo.find({
        field: "email",
        value: testUser.email,
      })) as IUser;
      expect(user).toBeInstanceOf(DataException);
    });
  });
  describe("User Repository - Delete", () => {
    
    it("should  successfully delete user information based on the id passed ",async () => {
      Prisma.user.delete.mockResolvedValue({ ...testUser, id: 1 });
      const user = await repo.Delete(currentUserId+'') as IUser;
      console.log(user)
      expect(user).toBeDefined()
      expect(user).toEqual({
         ...testUser,
        id: user.id,
        })
    });
    it("should return DataException incase of an error",async  () => {
      Prisma.user.delete.mockImplementationOnce((args)=>{
        throw new Error("Error while testing");
        
      })
      const user = await repo.Delete('0');
      expect(user).instanceOf(DataException)

    });
  });
});
