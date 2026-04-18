import express from "express";
import { AppDataSource } from "./dataSource";
import abilityRoutes from "./routes/ability.routes";

const app = express();

app.use(express.json());

app.use("/ability", abilityRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((error) => console.error(error));
