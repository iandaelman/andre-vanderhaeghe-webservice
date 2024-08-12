import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entity/user";
import { Painting } from "./entity/painting";
import config from "../config/config";
import { UsersPaintingMigration1688461344409 } from "./migrations/1688461344409-UsersPaintingMigration";
import { SeedingPaintings1688561879775 } from "./migrations/1688561879775-SeedingPaintings";
import { SeedingUsers1688562737955 } from "./migrations/1688562737955-SeedingUsers";
import { SeedingExhibition1692201761742 } from "./migrations/1692201761742-SeedingExhibition";
import { Exhibition } from "./entity/exhibition";

export const AppMigrationDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  logging: false,
  entities: [User, Painting, Exhibition],
  migrations: [
    UsersPaintingMigration1688461344409,
    SeedingPaintings1688561879775,
    SeedingUsers1688562737955,
    SeedingExhibition1692201761742,
  ],
  subscribers: [],
});
