import { v4 } from "uuid";
import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey
} from "@mikro-orm/core";
import { Course } from "./Course";
import { Group } from "./Group";
import { LearnerInGroup } from "./LearnerInGroup";
import { User } from "./User";

@Entity()
export class LearnerInCourse {
  @PrimaryKey()
  id: string = v4();
  
  @ManyToOne({ entity: () => User, onDelete: "cascade" })
  learner: User;

  @ManyToOne({ entity: () => Course, onDelete: "cascade" })
  course: Course;

  @ManyToMany({
    entity: () => Group,
    pivotEntity: () => LearnerInGroup,
    inversedBy: (e) => e.members,
    nullable: true,
  })
  groups = new Collection<Group>(this);

  constructor({ learner, course }: CreateLearnerInCourseDTO) {
    this.learner = learner;
    this.course = course;
  }
}

export type CreateLearnerInCourseDTO = {
  learner: User;
  course: Course;
};
