import express from "express";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  MikroORM
} from "@mikro-orm/core";
import { Course, CourseFile, CourseSection, Group, LearnerInCourse, User } from "./entities";
import {AuthController} from "./controller/auth.controller";

const PORT = 4000;
const app = express();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  courseRepository: EntityRepository<Course>;
  courseFileRepository: EntityRepository<CourseFile>;
  courseSectionRepository: EntityRepository<CourseSection>;
  groupRepository: EntityRepository<Group>;
  learnerInCourseRepository: EntityRepository<LearnerInCourse>;
  userRepository: EntityRepository<User>;
};

export const initializeServer = async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.courseRepository = DI.orm.em.getRepository(Course);
  DI.courseFileRepository = DI.orm.em.getRepository(CourseFile);
  DI.courseSectionRepository = DI.orm.em.getRepository(CourseSection);
  DI.groupRepository = DI.orm.em.getRepository(Group);
  DI.learnerInCourseRepository = DI.orm.em.getRepository(LearnerInCourse);
  DI.userRepository = DI.orm.em.getRepository(User);

  app.use('/auth', AuthController);

  DI.server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
