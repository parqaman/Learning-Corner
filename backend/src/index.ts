import express from "express";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import {
  Course,
  CourseFile,
  CourseSection,
  Group,
  LearnerInCourse,
  LearnerInGroup,
  User,
} from "./entities";
import { Auth } from "./middleware/auth.middleware";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";
import { CourseController } from "./controller/course.controller";

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
  learnerInGroupRepository: EntityRepository<LearnerInGroup>;
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
  DI.learnerInGroupRepository = DI.orm.em.getRepository(LearnerInGroup);
  DI.userRepository = DI.orm.em.getRepository(User);

  // global middleware
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(Auth.prepareAuthentication);

  // routes
  app.get("/", (req, res) => {
    res.send("GET request to the homepage");
  });
  app.use("/auth", AuthController);
  app.use("/users", Auth.verifyAccess, UserController);
  app.use("/courses", CourseController);

  DI.server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

initializeServer();
