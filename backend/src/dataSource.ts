import "reflect-metadata";
import { DataSource } from "typeorm";
import { Ability } from "./models/ability";
import { User } from "./models/user";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // auto create tables (dev only)
  entities: [Ability, User],
});
