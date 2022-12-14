import { Options } from "@mikro-orm/core";
import { Answer } from "./entities/Answer";
import { Course } from "./entities/Course";
import { CourseFile } from "./entities/CourseFile";
import { CourseSection } from "./entities/CourseSection";
import { Group } from "./entities/Group";
import { LearnerInCourse } from "./entities/LearnerInCourse";
import { Question } from "./entities/Question";
import { Quiz } from "./entities/Quiz";
import { User } from "./entities/User";

const options: Options = {
  type: "postgresql",
  host: "localhost",
  dbName: "learning-corner",
  user: "lcUser",
  password: "fwe_lc",
  debug: true,
  entities: [
    Answer,
    Course,
    CourseFile,
    CourseSection,
    Group,
    LearnerInCourse,
    Question,
    Quiz,
    User,
  ],
};

export default options;
