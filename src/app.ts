import "reflect-metadata";
import "module-alias/register";
import helmet from "helmet";
import cors from "cors";

import express, { Express } from "express";
import { InversifyExpressServer } from "inversify-express-utils";

import Logger from "@Utils/logger";
import { appContainer } from "./inversify.config";

import "@Web/controllers/user/user.controller";
import "@Web/controllers/posts/posts.controller";
import morganMiddleware from "@Web/middlewares/morgan_logger";
import "@Utils/registry";

import { postSchemaObj } from "@Domain/posts/dtos/post_dto";
const app: Express = express();
let server = new InversifyExpressServer(
  appContainer,
  null,
  {
    rootPath: "/api/v1",
  },
  app
);

server.setConfig((app) => {
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morganMiddleware);
});

let serverInstance = server.build();
serverInstance.listen(process.env.PORT || 3000);

Logger.info(
  `Server listenning on http://localhost:${process.env.PORT || 3000}`
);

interface Test {
  name: string;
  email: string;
}
