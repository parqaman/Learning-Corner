import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
} from "@mikro-orm/core";
import { Course } from "./Course";
import { Group } from "./Group";
import { LearnerInGroup } from "./LearnerInGroup";
import { User } from "./User";

@Entity()
export class LearnerInCourse {
  @ManyToOne({ primary: true, entity: () => User, onDelete: "cascade" })
  learner: User;

  @ManyToOne({ primary: true, entity: () => Course })
  course: Course;

  @ManyToMany({
    entity: () => Group,
    pivotEntity: () => LearnerInGroup,
    inversedBy: (e) => e.members,
    cascade: [Cascade.ALL],
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
