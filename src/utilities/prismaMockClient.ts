import { beforeEach, jest } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "@Utils/prismaClient";

jest.mock("@Utils/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

 export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

