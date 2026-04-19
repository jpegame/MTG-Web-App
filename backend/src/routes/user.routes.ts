import { Router } from "express";
import { AppDataSource } from "../dataSource";
import { User } from "../models/user";

const router = Router();

const UserRepo = () => AppDataSource.getRepository(User);

router.post("/", async (req, res) => {
  const { name, password } = req.body;

  const User = UserRepo().create({ name, password });
  await UserRepo().save(User);

  return res.json(User);
});

router.get("/", async (_, res) => {
  const User = await UserRepo().find();
  return res.json(User);
});

router.get("/:id", async (req, res) => {
  const User = await UserRepo().findOneBy({
    id: Number(req.params.id),
  });

  if (!User) return res.status(404).json({ message: "User not found" });

  return res.json(User);
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const User = await UserRepo().findOneBy({ name });
  if (!User) throw new Error("User not found");

  const isValid = await User.comparePassword(password);
  if (!isValid) throw new Error("Invalid credentials");

  return res.status(200).json({status: "success", data: User});
});



export default router;