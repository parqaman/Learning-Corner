import express from "express";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  MikroORM
} from "@mikro-orm/core";
import { Course, User } from "./entities";
import {AuthController} from "./controller/auth.controller";

const PORT = 4000;
const app = express();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  courseRepository: EntityRepository<Course>;
  userRepository: EntityRepository<User>;
};

export const initializeServer = async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.courseRepository = DI.orm.em.getRepository(Course);
  DI.userRepository = DI.orm.em.getRepository(User);

  app.use('/auth', AuthController);

  DI.server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
