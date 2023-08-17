import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { Painting } from "./entity/painting";
import config from "../config/config";

import { logger } from "./createServer";
import { Category } from "./entity/category";
import { Exhibition } from "./entity/exhibition";

export const AppTestDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: false,
  entities: [User, Painting, Category, Exhibition],
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
