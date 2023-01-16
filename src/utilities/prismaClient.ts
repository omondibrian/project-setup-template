import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
@injectable()
export class DBClient {
  private static instance: DBClient;
  private _prisma:PrismaClient
  
  constructor() {
    this._prisma = new PrismaClient();
  }
 
  public get prisma() {
    return this._prisma;
  }

  public static getInstance() {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }
}

