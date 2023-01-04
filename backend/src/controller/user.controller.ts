import { Router } from "express";
import { DI } from "../";
import { wrap } from "@mikro-orm/core";
import { uploadProfilePicture } from "../middleware/file.middleware"
import * as fs from "fs";
import path from "path";

const uploadPath = path.join(__dirname, process.env.STORAGE_PATH || '../../upload/tmp');

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const users = await DI.userRepository.findAll({
    populate: ['courses', 'joinedCourses']
  });
  res.status(200).send(users);
});

router.get("/:id", async (req, res) => {
  const user = await DI.userRepository.findOne({ id: req.params.id },
    {populate: ['courses', 'joinedCourses', 'courses.lecturer', 'joinedCourses.lecturer']});
  if (!user) {
    return res.status(204).send();
  }
  return res.status(200).send(user);
});

router.put("/:id", uploadProfilePicture, async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    wrap(user).assign({...req.body });

    const files = req.files as Express.Multer.File[];

    if(files && files.length === 1 && files[0].filename && files[0].filename !== user.photo){
      if(user.photo !== null && user.photo !== "profile_empty.png") fs.unlinkSync(path.join(uploadPath, user.photo));
      wrap(user).assign({ photo: files[0].filename});
    }
    await DI.userRepository.flush();
    return res.json(user);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    await DI.userRepository.remove(user).flush();
    return res.status(204).send({});
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Join a course
router.put("/:userId/course/:courseId", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const existingLearnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: user,
      course: course,
    });
    if (existingLearnerInCourse) {
      return res
        .status(409)
        .send({ message: "User has already joined the course" });
    }
    const newLearnerInCourse = DI.learnerInCourseRepository.create({
      learner: user,
      course: course,
    });
    await DI.learnerInCourseRepository.persistAndFlush(newLearnerInCourse);
    return res.status(200).send(newLearnerInCourse);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Leave a course
router.delete("/:userId/course/:courseId", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const existingLearnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: user,
      course: course,
    });
    if (!existingLearnerInCourse) {
      return res.status(409).send({ message: "User is not in the course" });
    }
    await DI.learnerInCourseRepository.removeAndFlush(existingLearnerInCourse);
    return res.status(204).send({ message: "Deleted user from course" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Join a group in a course
router.put("/:userId/course/:courseId/group/:groupId", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: user,
      course: course,
    });
    if (!learnerInCourse) {
      return res.status(404).send({ message: "User is not in the course" });
    }
    const existingLearnerInGroup = await DI.learnerInGroupRepository.findOne({
      member: learnerInCourse,
      group: group,
    });
    if (existingLearnerInGroup) {
      return res
        .status(409)
        .send({ message: "User has already joined the group" });
    }
    const newLearnerInGroup = DI.learnerInGroupRepository.create({
      member: learnerInCourse,
      group: group,
    });
    await DI.learnerInGroupRepository.persistAndFlush(newLearnerInGroup);
    return res.status(200).send(newLearnerInGroup);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Leave a group in a course
router.delete("/:userId/course/:courseId/group/:groupId", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const group = await DI.groupRepository.findOne(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: user,
      course: course,
    });
    if (!learnerInCourse) {
      return res.status(404).send({ message: "User is not in the course" });
    }
    const existingLearnerInGroup = await DI.learnerInGroupRepository.findOne({
      member: learnerInCourse,
      group: group,
    });
    if (!existingLearnerInGroup) {
      return res.status(409).send({ message: "User is not in the group" });
    }
    await DI.learnerInGroupRepository.removeAndFlush(existingLearnerInGroup);
    return res.status(204).send({ message: "Deleted user from group" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Read all courses from user
router.get("/:userId/course", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const learners = await DI.learnerInCourseRepository.find(
      { learner: user },
      { populate: ["course"] }
    );
    return res.status(200).send(learners);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Read all groups from user
router.get("/:userId/course/:courseId/group", async (req, res) => {
  try {
    const user = await DI.userRepository.findOne(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    const learnerInCourse = await DI.learnerInCourseRepository.findOne({
      learner: user,
      course: course,
    });
    const courses = await DI.learnerInGroupRepository.find(
      { member: learnerInCourse },
      { populate: ["group"] }
    );
    return res.status(200).send(courses);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

export const UserController = router;
