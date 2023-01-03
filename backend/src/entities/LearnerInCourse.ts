import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
} from "@mikro-orm/core";
import { Course } from "./Course";
import { Group } from "./Group";
import { LearnerInGroup } from "./LearnerInGroup";
import { User } from "./User";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class LearnerInCourse extends BaseEntity {  
  @ManyToOne({ entity: () => User, onDelete: "cascade" })
  learner: User;

  @ManyToOne({ entity: () => Course, onDelete: "cascade" })
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
    super();
    this.learner = learner;
    this.course = course;
  }
}

export type CreateLearnerInCourseDTO = {
  learner: User;
  course: Course;
};
