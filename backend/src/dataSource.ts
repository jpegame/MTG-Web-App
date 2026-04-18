import "reflect-metadata";
import { DataSource } from "typeorm";
import { Ability } from "./models/ability";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // auto create tables (dev only)
  entities: [Ability],
});
