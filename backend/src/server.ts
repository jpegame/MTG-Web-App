import express from "express";
import { createServer } from "http";
import { AppDataSource } from "./dataSource";
import { initSocket } from "./socket";

import abilityRoutes from "./routes/ability.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const httpServer = createServer(app);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use("/ability", abilityRoutes);
app.use("/user", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    initSocket(httpServer);
    httpServer.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((error) => console.error(error));
