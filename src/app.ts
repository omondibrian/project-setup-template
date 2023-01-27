import "reflect-metadata";
import "module-alias/register";
import helmet from "helmet";
import cors from "cors";

import express, { Express } from "express";
import { InversifyExpressServer } from "inversify-express-utils";

import { appContainer } from "./inversify.config";

import "@Web/controllers/user/user.controller";
import "@Web/controllers/posts/posts.controller";
import morganMiddleware from "@Web/middlewares/morgan_logger";

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

export default server;
