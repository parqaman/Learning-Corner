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
  File,
  Section,
  Group,
  LearnerInCourse,
  LearnerInGroup,
  User,
} from "./entities";
import { Auth } from "./middleware/auth.middleware";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";
import { CourseController } from "./controller/course.controller";
import { GroupController } from "./controller/group.controller";
import * as path from "path";
import * as socketIo from "socket.io";
import {Socket} from "socket.io";

const PORT = 4000;
const app = express();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  courseRepository: EntityRepository<Course>;
  fileRepository: EntityRepository<File>;
  sectionRepository: EntityRepository<Section>;
  groupRepository: EntityRepository<Group>;
  learnerInCourseRepository: EntityRepository<LearnerInCourse>;
  learnerInGroupRepository: EntityRepository<LearnerInGroup>;
  userRepository: EntityRepository<User>;
};

interface ChatMessage {
  message: string
  time: number,
  sender: User
}


export const initializeServer = async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.courseRepository = DI.orm.em.getRepository(Course);
  DI.fileRepository = DI.orm.em.getRepository(File);
  DI.sectionRepository = DI.orm.em.getRepository(Section);
  DI.groupRepository = DI.orm.em.getRepository(Group);
  DI.learnerInCourseRepository = DI.orm.em.getRepository(LearnerInCourse);
  DI.learnerInGroupRepository = DI.orm.em.getRepository(LearnerInGroup);
  DI.userRepository = DI.orm.em.getRepository(User);

  // global middleware
  app.use(express.json({limit: '5mb'}));
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(Auth.prepareAuthentication);

  // routes

  app.use("/upload/tmp", express.static(path.join(__dirname, '../upload/tmp')))

  app.get("/", (req, res) => {
    res.send("GET request to the homepage");
  });
  app.use("/auth", AuthController);
  app.use("/users", Auth.verifyAccess, UserController);
  app.use("/courses", CourseController);
  app.use("/groups", GroupController);

  const server = http.createServer(app)
  const io = new socketIo.Server(server, {
    cors: {
      origin: "http://127.0.0.1:3000",
      methods: ["GET", "POST"]
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const res = Auth.verifyToken(token);
    console.log('Socket-Auth:', res)
    if(!res) {
      const err = new Error("not authorized");
      next(err);
    }
    next()
  });

  io.on("connection", async (socket: Socket) => {
    console.log('Connection: ', socket);
    socket.on("helloRoom", (args) => {
      console.log('helloRoom: ', args)
      socket.join(args.room)
      const message: ChatMessage = {
        message: args.user.firstName + ' ' + args.user.lastName + ' joined the room!',
        sender: socket.handshake.auth.user,
        time: Date.now()
      }
      socket.in(args.room).emit('message', message)
    })

    socket.on("message", (args) => {
      console.log('message: ', args)
      const message: ChatMessage = {
        message: args.message,
        sender: socket.handshake.auth.user,
        time: Date.now()
      }
      const clients = io.sockets.adapter.rooms.get(args.room);
      io.in(args.room).emit('message', message)
    })

    socket.on("disconnect", (reason) => {
      console.log('disconnect: ', reason)
    })

  });

  DI.server = server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

initializeServer();
