import { Options } from '@mikro-orm/core';
import { Course } from './entities/Course';
import { Document } from "./entities/Document";
import { File } from './entities/File';
import { Section } from './entities/Section';
import { Group } from './entities/Group';
import { LearnerInCourse } from './entities/LearnerInCourse';
import { LearnerInGroup } from './entities/LearnerInGroup';
import { Message } from './entities/Message';
import { User } from './entities/User';

const options: Options = {
  type: 'postgresql',
  host: 'localhost',
  port: 5433,
  dbName: 'learningCornerDB',
  user: 'lcUser',
  password: 'lcfwe22',
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
    Document
  ],
};

export default options;
