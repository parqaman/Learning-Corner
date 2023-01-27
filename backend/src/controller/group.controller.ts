import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { DI } from "..";
import {
  CreateGroupDTO,
  CreateGroupSchema,
  CreateSectionDTO,
  CreateSectionSchema,
  Group,
  Section,
} from "../entities";
import { deleteSectionFiles } from "../helpers/file.helper";

const router = Router({ mergeParams: true });

// Get group by ID
router.get("/:groupId", async (req, res) => {
  const group = await DI.groupRepository.findOne(
    {
      id: req.params.groupId,
    },
    {
      populate: [
        "course",
        "members",
        "members.learner",
        "sections",
        "sections.files",
      ],
    }
  );
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

  // Check authorization
  const course = await DI.courseRepository.findOne({
    id: createGroupDTO.course.id,
  });

  
  if (!course) {
    console.log(createGroupDTO)
    return res.status(404).send({ message: "Course not found" });
  }
  const learnerInCourse = await DI.learnerInCourseRepository.findOne({
    learner: req.user,
    course: course,
  });
  if (!learnerInCourse && course.lecturer !== req.user) {
    return res.status(401).send({ message: "User not authorized" });
  }

  const newGroup = new Group(createGroupDTO);
  await DI.groupRepository.persistAndFlush(newGroup);

  return res.status(201).send(newGroup);
});

// Update group
router.put("/:groupId", async (req, res) => {
  try {
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    // Check authorization
    const course = await DI.courseRepository.findOne({
      id: group.course.id,
    });
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: req.user,
      course: course,
    });
    const learnerInGroup = await DI.learnerInGroupRepository.findOne({
      member: learnerInCourse,
      group: group,
    });
    if (!learnerInGroup && course.lecturer !== req.user) {
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
    const group = await DI.groupRepository.findOne(req.params.groupId, {
      populate: ["sections", "sections.files"],
    });
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    // Check authorization
    const course = await DI.courseRepository.findOne({
      id: group.course.id,
    });
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: req.user,
      course: course,
    });
    const learnerInGroup = await DI.learnerInGroupRepository.findOne({
      member: learnerInCourse,
      group: group,
    });
    if (!learnerInGroup && course.lecturer !== req.user) {
      return res.status(401).send({ message: "User not authorized" });
    }

    group.sections?.getItems().map((section) => {
      if (section.files.length > 0) {
        const files = section.files.getItems();
        deleteSectionFiles(files, section.id);
      }
    });

    const messages = await DI.messageRepository.find({roomId: req.params.groupId});
    if (messages) await DI.messageRepository.removeAndFlush(messages);

    const document = await DI.documentRepository.findOne({id: req.params.groupId});
    if (document) await DI.documentRepository.removeAndFlush(document);

    await DI.groupRepository.removeAndFlush(group);
    return res.status(204).send({ message: "Group deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Create section in group
router.post("/:groupId/section", async (req, res) => {
  const validatedData = await CreateSectionSchema.validate(req.body).catch(
    (e) => {
      res.status(400).send({ errors: e.errors });
    }
  );
  if (!validatedData) {
    return;
  }

  const group = await DI.groupRepository.findOne(req.params.groupId);
  if (!group) {
    return res.status(404).send({ message: "Group not found" });
  }

  const course = await DI.courseRepository.findOne(group.course);
  if (!course) {
    return res.status(404).send({ message: "Course not found" });
  }

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

  const createSectionDTO: CreateSectionDTO = {
    ...validatedData,
    group: group,
  };

  const newSection = new Section(createSectionDTO);
  await DI.sectionRepository.persistAndFlush(newSection);

  return res.status(201).send(newSection);
});

// Update section in group
router.put("/:groupId/section/:sectionId", async (req, res) => {
  try {
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    const course = await DI.courseRepository.findOne(group.course);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

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

    const section = await DI.sectionRepository.findOne(req.params.sectionId);
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    if (section.group !== group) {
      return res.status(400).send({ message: "Section is not in the group" });
    }

    wrap(section).assign(req.body);
    await DI.sectionRepository.flush();
    return res.status(200).send(section);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Delete section in group
router.delete("/:groupId/section/:sectionId", async (req, res) => {
  try {
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    const course = await DI.courseRepository.findOne(group.course);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

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

    const section = await DI.sectionRepository.findOne(req.params.sectionId, {
      populate: ["files"],
    });
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    if (section.group !== group) {
      return res.status(400).send({ message: "Section is not in the group" });
    }

    if (section.files.length > 0) {
      const files = section.files.getItems();
      deleteSectionFiles(files, req.params.sectionId);
    }

    await DI.sectionRepository.removeAndFlush(section);
    return res.status(204).send({ message: "Section deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Get messages
router.get("/:groupId/message", async (req, res) => {
  const group = await DI.groupRepository.findOne(req.params.groupId);
  if (!group) {
    return res.status(404).send({ message: "Group not found" });
  }

  const course = await DI.courseRepository.findOne(group.course);
  if (!course) {
    return res.status(404).send({ message: "Course not found" });
  }

  const learnerInCourse = await DI.learnerInCourseRepository.findOne({
    learner: req.user,
    course: course,
  });

  const learnerInGroup = await DI.learnerInGroupRepository.findOne({
    member: learnerInCourse,
    group: group,
  });

  if (!learnerInGroup) {
    return res
      .status(401)
      .send({ message: "You are not the member of this group" });
  }
  const messages = await DI.messageRepository.find(
    { roomId: group.id },
    { populate: ["sender"] }
  );
  return res.status(200).send(messages);
});

export const GroupController = router;
