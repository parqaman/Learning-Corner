import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { DI } from "..";
import { CreateGroupDTO, CreateGroupSchema, Group } from "../entities";

const router = Router({ mergeParams: true });

// Get group by ID
router.get("/:groupId", async (req, res) => {
  const group = await DI.groupRepository.findOne(req.params.groupId);
  if (!group) return res.status(404).send({ message: "Group not found" });
  return res.status(200).send(group);
});

// Create new group
router.post("/", async (req, res) => {
  const validatedData = await CreateGroupSchema.validate(req.body).catch(
    (e) => {
      res.status(400).send({ errors: e.errors });
    }
  );
  if (!validatedData) {
    return;
  }

  const createGroupDTO: CreateGroupDTO = {
    ...validatedData,
    course: req.body.course,
  };

  const course = await DI.courseRepository.findOne(createGroupDTO.course);
  if (!course) {
    return res.status(404).send({ message: "Course not found" });
  }

  const learnerInCourse = await DI.learnerInCourseRepository.findOne({
    learner: req.user,
    course: course,
  });
  if (!learnerInCourse) {
    return res.status(401).send({ message: "User not authorized" });
  }

  const newGroup = new Group(createGroupDTO);
  await DI.groupRepository.persistAndFlush(newGroup);

  const newLearnerInGroup = DI.learnerInGroupRepository.create({
    member: learnerInCourse,
    group: newGroup,
  });
  await DI.learnerInGroupRepository.persistAndFlush(newLearnerInGroup);

  return res.status(201).send(newGroup);
});

// Update group
router.put("/:groupId", async (req, res) => {
  try {
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    const course = await DI.courseRepository.findOne(group.course);
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: req.user,
      course: course,
    });
    const learnerInGroup = await DI.learnerInGroupRepository.findOne({
      member: learnerInCourse,
      group: group,
    });
    if (!learnerInGroup) {
      return res.status(401).send({ message: "User not authorized" });
    }

    wrap(group).assign(req.body);
    await DI.groupRepository.flush();
    return res.status(200).send(group);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Delete group
router.delete("/:groupId", async (req, res) => {
  try {
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    const course = await DI.courseRepository.findOne(group.course);
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: req.user,
      course: course,
    });
    const learnerInGroup = await DI.learnerInGroupRepository.findOne({
      member: learnerInCourse,
      group: group,
    });
    if (!learnerInGroup) {
      return res.status(401).send({ message: "User not authorized" });
    }

    await DI.groupRepository.removeAndFlush(group);
    return res.status(204).send({ message: "Group deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

export const GroupController = router;
