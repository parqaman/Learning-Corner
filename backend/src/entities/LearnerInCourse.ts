import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Course } from "./Course";
import { Group } from "./Group";
import { LearnerInGroup } from "./LearnerInGroup";
import { User } from "./User";
import { v4 } from "uuid";

@Entity()
export class LearnerInCourse {
  @Property()
  @Unique()
  id: string = v4();

  @ManyToOne({ primary: true, entity: () => User, })
  learner: User;

  @ManyToOne({ primary: true, entity: () => Course  })
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
