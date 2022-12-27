import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { DI } from "..";
import { Course } from "../entities/Course";

const router = Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const newCourse = new Course(req.body);
  await DI.courseRepository.persistAndFlush(newCourse);

  return res.status(201).send(newCourse);
});

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
      return res.status(401).send({ message: "You are not authorized" });
    }
    wrap(course).assign(req.body);
    await DI.courseRepository.flush();
    return res.status(200).send(course);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

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
      return res.status(401).send({ message: "You are not authorized" });
    }
    await DI.courseRepository.remove(course).flush();
    return res.status(204).send({ message: "Course deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

export const CourseController = router;
