import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entity/user";
import { Painting } from "./entity/painting";
import config from "../config/config";
import { UsersPaintingMigration1688461344409 } from "./migrations/1688461344409-UsersPaintingMigration";
import { SeedingPaintings1688561879775 } from "./migrations/1688561879775-SeedingPaintings";
import { SeedingUsers1688562737955 } from "./migrations/1688562737955-SeedingUsers";
import { SeedingCategories1688494833326 } from "./migrations/1688494833326-SeedingCategories";
import { SeedingExhibition1692201761742 } from "./migrations/1692201761742-SeedingExhibition";
import { Category } from "./entity/category";
import { Exhibition } from "./entity/exhibition";

export const AppMigrationDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  logging: false,
  entities: [User, Painting, Category, Exhibition],
  migrations: [
    UsersPaintingMigration1688461344409,
    SeedingPaintings1688561879775,
    SeedingUsers1688562737955,
    SeedingCategories1688494833326,
    SeedingExhibition1692201761742,
  ],
  subscribers: [],
});
