import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { Course } from "./Course";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class LearnerInCourse {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne({ primary: true, entity: () => User})
  user: User;

  @ManyToOne({ primary: true, entity: () => Course  })
  course: Course;

  @ManyToMany({
    entity: () => Group,
    inversedBy: (e) => e.members,
    cascade: [Cascade.ALL],
  }) 
  groups = new Collection<Group>(this);

  constructor({ user, course }: CreateLearnerInCourseDTO) {
    this.user = user;
    this.course = course;
  }
}

export type CreateLearnerInCourseDTO = {
  user: User;
  course: Course;
};
