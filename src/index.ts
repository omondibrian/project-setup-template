import server from "./app";
import Logger from "@Utils/logger";


let serverInstance = server.build();
serverInstance.listen(process.env.PORT || 3000);

Logger.info(
  `Server listenning on http://localhost:${process.env.PORT || 3000}`
);
