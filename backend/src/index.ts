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
  Document,
  File,
  Section,
  Group,
  LearnerInCourse,
  LearnerInGroup,
  Message,
  User,
  CreateMessageDTO,
} from "./entities";
import { Auth } from "./middleware/auth.middleware";
import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";
import { CourseController } from "./controller/course.controller";
import { GroupController } from "./controller/group.controller";
import { UploadController } from "./controller/upload.controller";
import * as path from "path";
import { TestSeeder } from "./seeders/TestSeeder";
import * as socketIo from "socket.io";
import { Socket } from "socket.io";

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
  messageRepository: EntityRepository<Message>;
  userRepository: EntityRepository<User>;
  documentRepository: EntityRepository<Document>;
};

export const findOrCreateDocument = async (groupId: string, em: EntityManager) => {
  if (groupId == null) return;

  const group = await em.findOne(Group, groupId);
  console.log(group);
  if (!group) return;
  var document = await em.findOne(Document, group.id);
  if (!document) {
    document = new Document(group.id, {});
    await em.persistAndFlush(document);
    return document;
  }
  return document;
};

export const initializeServer = async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.courseRepository = DI.orm.em.getRepository(Course);
  DI.fileRepository = DI.orm.em.getRepository(File);
  DI.sectionRepository = DI.orm.em.getRepository(Section);
  DI.groupRepository = DI.orm.em.getRepository(Group);
  DI.learnerInCourseRepository = DI.orm.em.getRepository(LearnerInCourse);
  DI.learnerInGroupRepository = DI.orm.em.getRepository(LearnerInGroup);
  DI.messageRepository = DI.orm.em.getRepository(Message);
  DI.userRepository = DI.orm.em.getRepository(User);
  DI.documentRepository = DI.orm.em.getRepository(Document);

  const numUser = await DI.userRepository.count();
  const numCourse = await DI.courseRepository.count();
  if (numUser === 0 && numCourse === 0) {
    const seeder = DI.orm.getSeeder();
    await seeder.seed(TestSeeder);
  }

  // global middleware
  app.use(express.json({ limit: "5mb" }));
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(Auth.prepareAuthentication);

  // routes

  app.use("/upload/tmp", express.static(path.join(__dirname, "../upload/tmp")));
  app.use(
    "/upload/profile",
    express.static(path.join(__dirname, "../upload/profile"))
  );
  app.use(
    "/upload/files",
    express.static(path.join(__dirname, "../upload/files"))
  );

  app.get("/", (req, res) => {
    res.send("GET request to the homepage");
  });
  app.use("/auth", AuthController);
  app.use("/users", Auth.verifyAccess, UserController);
  app.use("/courses", CourseController);
  app.use("/groups", GroupController);
  app.use("/sections", UploadController);

  const server = http.createServer(app);
  const io = new socketIo.Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const res = Auth.verifyToken(token);
    // console.log("Socket-Auth:", res);
    if (!res) {
      const err = new Error("not authorized");
      next(err);
    }
    next();
  });

  io.on("connection", async (socket: Socket) => {
    // console.log("Connection: ", socket);
    socket.on("helloRoom", (args) => {
      socket.join(args.room);
      // console.log("helloRoom: ", args);
      // const message: ChatMessage = {
      //   message:
      //     args.user.firstName + " " + args.user.lastName + " joined the room!",
      //   sender: socket.handshake.auth.user,
      //   time: Date.now(),
      // };
      // socket.in(args.room).emit("message", message);
    });

    socket.on("message", (args) => {
      console.log("message: ", args);
      const message: CreateMessageDTO = {
        message: args.message,
        sender: socket.handshake.auth.user,
        time: Date.now().toString(),
        roomId: args.room,
      };
      io.in(args.room).emit("message", message);
      // save message to the database
      const em = DI.orm.em.fork();
      em.persistAndFlush(
        new Message({
          message: message.message,
          sender: message.sender,
          time: message.time,
          roomId: args.room,
        })
      );
    });

    socket.on("get-document", async (groupID) => {
      const em = DI.orm.em.fork();
      const document = await findOrCreateDocument(groupID, em);
      socket.join(groupID);
      if (document) socket.emit("load-document", document.data);

      socket.on("send-changes", (args) => {
        socket.broadcast.to(groupID).emit("receive-changes", args);
      });

      socket.on("save-document", async (data) => {
        console.log(document)
        if (document) {
          document.data = data;
          await em.persistAndFlush(document);
        }
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("disconnect: ", reason);
    });
  });

  DI.server = server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

initializeServer();
