import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserAccount } from "../src/entity/useraccount";
import { Painting } from "./entity/painting";
import config from "../config/config";

import { logger } from "./createServer";
import { Exhibition } from "./entity/exhibition";

export const AppTestDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: false,
  entities: [UserAccount, Painting, Exhibition],
  migrations: [],
  subscribers: [],
});
AppTestDataSource.initialize()
  .then(async () => {
    logger.debug("AppTestDataSource initialized from test-data-source.ts");
  })
  .catch((error) => {
    logger.error("Error initializing AppDataSource from test-data-source.ts");
    logger.error(error);
  });
