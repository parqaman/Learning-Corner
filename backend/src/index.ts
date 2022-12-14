import express from "express";
import http from "http";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { Answer } from "./entities/Answer";
import { Course } from "./entities/Course";
import { CourseFile } from "./entities/CourseFile";
import { CourseSection } from "./entities/CourseSection";
import { Group } from "./entities/Group";
import { LearnerInCourse } from "./entities/LearnerInCourse";
import { Question } from "./entities/Question";
import { Quiz } from "./entities/Quiz";
import { User } from "./entities/User";

const PORT = 4000;
const app = express();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  answerRepository: EntityRepository<Answer>;
  courseRepository: EntityRepository<Course>;
  courseFileRepository: EntityRepository<CourseFile>;
  courseSectionRepository: EntityRepository<CourseSection>;
  groupRepository: EntityRepository<Group>;
  learnerInCourseRepository: EntityRepository<LearnerInCourse>;
  questionRepository: EntityRepository<Question>;
  quizRepository: EntityRepository<Quiz>;
  userRepository: EntityRepository<User>;
};

export const initializeServer = async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.answerRepository = DI.orm.em.getRepository(Answer);
  DI.courseRepository = DI.orm.em.getRepository(Course);
  DI.courseFileRepository = DI.orm.em.getRepository(CourseFile);
  DI.courseSectionRepository = DI.orm.em.getRepository(CourseSection);
  DI.groupRepository = DI.orm.em.getRepository(Group);
  DI.learnerInCourseRepository = DI.orm.em.getRepository(LearnerInCourse);
  DI.questionRepository = DI.orm.em.getRepository(Question);
  DI.quizRepository = DI.orm.em.getRepository(Quiz);
  DI.userRepository = DI.orm.em.getRepository(User);

  DI.server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
