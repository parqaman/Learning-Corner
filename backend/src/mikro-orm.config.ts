import { Options } from "@mikro-orm/core";
import { Answer } from "./entities/Answer";
import { Course } from "./entities/Course";
import { File } from "./entities/File";
import { Group } from "./entities/Group";
import { LearnerInCourse } from "./entities/LearnerInCourse";
import { Question } from "./entities/Question";
import { Quiz } from "./entities/Quiz";
import { Section } from "./entities/Section";
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
    File,
    Group,
    LearnerInCourse,
    Question,
    Quiz,
    Section,
    User,
  ],
};

export default options;
