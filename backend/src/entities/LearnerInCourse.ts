import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class LearnerInCourse extends BaseEntity {
  @ManyToOne({ primary: true, entity: () => User, onDelete: "cascade" })
  learner: User;

  @ManyToOne({ primary: true, entity: () => Course })
  course: Course;

  @ManyToMany({
    entity: () => Group,
    inversedBy: (e) => e.members,
    cascade: [Cascade.ALL],
  })
  groups = new Collection<Group>(this);

  constructor({ learner, course }: CreateLearnerInCourseDTO) {
    super();
    this.learner = learner;
    this.course = course;
  }
}

export type CreateLearnerInCourseDTO = {
  learner: User;
  course: Course;
};
