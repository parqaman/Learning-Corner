import { Router } from "express";
import { DI } from "..";
import { Group } from "../entities";

const router = Router({ mergeParams: true });

// only for testing
router.post("/", async (req, res) => {
  const newGroup = new Group(req.body);
  await DI.groupRepository.persistAndFlush(newGroup);

  return res.status(201).send(newGroup);
});

export const GroupController = router;
