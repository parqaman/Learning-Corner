import { Router } from "express";
import { DI } from "../";
import { Course, CreateCourseDTO, CreateCourseSchema } from "../entities";
import { wrap } from "@mikro-orm/core";

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
    const courseName = req.query?.name as string;
    if(courseName){
        return (res.json(await DI.courseRepository.find(
          {},
          {
              filters: { name: { name: courseName } },
              populate: ['sections', 'participants', 'lecturer']
          }
      )));
    }
    return res.json(await DI.courseRepository.findAll({
        populate: ['sections', 'participants', 'lecturer']
    }));
});

router.get("/:id", async (req, res) => {
  const course = await DI.courseRepository.findOne(
    { id: req.params.id },
    {
      populate: ["sections", "participants", 'lecturer'],
    }
  );
  if (!course) return res.status(404).send({ message: "Course not found" });
  return res.json(course);
});

router.post("/", async (req, res) => {
  const validatedData = await CreateCourseSchema.validate(req.body).catch(
    (e) => {
      res.status(400).json({ errors: e.errors });
    }
  );
  if (!validatedData) {
    return;
  }
  if (!req.user) {
    return;
  }
  const createCourseDTO: CreateCourseDTO = {
    ...validatedData,
    lecturer: req.user,
  };

  const course = new Course(createCourseDTO);
  const hasSections =
    createCourseDTO.sections && createCourseDTO.sections.length > 0;
  const hasParticipants =
    createCourseDTO.participants && createCourseDTO.participants.length > 0;

  if (hasSections) wrap(course).assign({ sections: createCourseDTO.sections });
  if (hasParticipants)
    wrap(course).assign({ participants: createCourseDTO.participants });

  await DI.courseRepository.persistAndFlush(course);

  if (hasSections) await DI.courseRepository.populate(course, ["sections"]);
  if (hasParticipants)
    await DI.courseRepository.populate(course, ["participants"]);

  return res.status(201).send(course);
});

// Update a course
router.put("/:courseId/user/:userId", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    if (course.lecturer !== user) {
      return res.status(401).send({ message: "User not authorized" });
    }
    wrap(course).assign(req.body);
    await DI.courseRepository.flush();
    return res.status(200).send(course);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Delete a course
router.delete("/:courseId/user/:userId", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    if (course.lecturer !== user) {
      return res.status(401).send({ message: "User not authorized" });
    }
    await DI.courseRepository.removeAndFlush(course);
    return res.status(204).send({ message: "Course deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

export const CourseController = router;
