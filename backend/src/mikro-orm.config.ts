import { Options } from "@mikro-orm/core";
import { Course } from "./entities/Course";
import { CourseFile } from "./entities/CourseFile";
import { CourseSection } from "./entities/CourseSection";
import { Group } from "./entities/Group";
import { LearnerInCourse } from "./entities/LearnerInCourse";
import { User } from "./entities/User";

const options: Options = {
  type: "postgresql",
  host: "localhost",
  dbName: "postgres",
  user: "postgres",
  password: "postgres123",
  debug: true,
  entities: [
    Course,
    CourseFile,
    CourseSection,
    Group,
    LearnerInCourse,
    User,
  ],
};

export default options;
