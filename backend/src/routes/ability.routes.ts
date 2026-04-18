import { Router } from "express";
import { AppDataSource } from "../dataSource";
import { Ability } from "../models/ability";

const router = Router();

const AbilityRepo = () => AppDataSource.getRepository(Ability);

// CREATE
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  const Ability = AbilityRepo().create({ name, description });
  await AbilityRepo().save(Ability);

  return res.json(Ability);
});

// GET ALL
router.get("/", async (_, res) => {
  const Abilitys = await AbilityRepo().find();
  return res.json(Abilitys);
});

// GET BY ID
router.get("/:id", async (req, res) => {
  const Ability = await AbilityRepo().findOneBy({
    id: Number(req.params.id),
  });

  if (!Ability) return res.status(404).json({ message: "Ability not found" });

  return res.json(Ability);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const repo = AbilityRepo();
  const Ability = await repo.findOneBy({ id: Number(req.params.id) });

  if (!Ability) return res.status(404).json({ message: "Ability not found" });

  repo.merge(Ability, req.body);
  await repo.save(Ability);

  return res.json(Ability);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const repo = AbilityRepo();
  const Ability = await repo.findOneBy({ id: Number(req.params.id) });

  if (!Ability) return res.status(404).json({ message: "Ability not found" });

  await repo.remove(Ability);

  return res.json({ message: "Deleted" });
});

export default router;
