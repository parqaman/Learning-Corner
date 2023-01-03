import { Options } from "@mikro-orm/core";
import { Course } from "./entities/Course";
import { CourseFile } from "./entities/CourseFile";
import { CourseSection } from "./entities/CourseSection";
import { Group } from "./entities/Group";
import { LearnerInCourse } from "./entities/LearnerInCourse";
import { LearnerInGroup } from "./entities/LearnerInGroup";
import { User } from "./entities/User";

const options: Options = {
  type: "postgresql",
  host: "localhost",
  port: 5433,
  dbName: "learningCornerDB",
  user: "lcUser",
  password: "lcfwe22",
  debug: true,
  entities: [
    Course,
    CourseFile,
    CourseSection,
    Group,
    LearnerInCourse,
    LearnerInGroup,
    User,
  ],
};

export default options;
