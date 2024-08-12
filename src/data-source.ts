import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { Painting } from "./entity/painting";
import config from "../config/config";
import { logger } from "./createServer";
import { Exhibition } from "./entity/exhibition";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: false,
  entities: [User, Painting, Exhibition],
  migrations: [],
  subscribers: [],
});
AppDataSource.initialize()
  .then(async () => {
    logger.debug("AppDataSource initialized from data-source.ts");
  })
  .catch((error) => {
    logger.error("Error initializing AppDataSource from data-source.ts");
    logger.error(error);
  });
