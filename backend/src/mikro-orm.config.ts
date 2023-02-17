import { Options } from "@mikro-orm/core";
import { Course } from "./entities/Course";
import { File } from "./entities/File";
import { Section } from "./entities/Section";
import { Group } from "./entities/Group";
import { LearnerInCourse } from "./entities/LearnerInCourse";
import { LearnerInGroup } from "./entities/LearnerInGroup";
import { Message } from "./entities/Message";
import { User } from "./entities/User";

const options: Options = {
  type: "postgresql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT!) || 5433,
  dbName: process.env.DB_NAME || "learningCornerDB",
  user: process.env.DB_USER || "lcUser",
  password: process.env.DB_PASSWORD || "lcfwe22",
  debug: true,
  entities: [
    Course,
    File,
    Section,
    Group,
    LearnerInCourse,
    LearnerInGroup,
    Message,
    User,
  ],
};

export default options;
