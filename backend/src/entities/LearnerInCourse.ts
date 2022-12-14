import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
} from "@mikro-orm/core";
import { Course } from "./Course";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class LearnerInCourse {
  @ManyToOne({ primary: true, entity: () => User, onDelete: "cascade" })
  learner: User;

  @ManyToOne({ primary: true, entity: () => Course })
  course: Course;

  @ManyToMany({
    entity: () => Group,
    inversedBy: (e) => e.participants,
    cascade: [Cascade.ALL],
  })
  groups? = new Collection<Group>(this);

  constructor(learner: User, course: Course) {
    this.learner = learner;
    this.course = course;
  }
}
