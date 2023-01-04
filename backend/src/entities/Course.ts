import { object, string } from "yup";
import {
  Collection,
  Entity,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Property, Unique, Filter,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { CourseSection } from "./CourseSection";
import { Quiz } from "./Quiz";
import { LearnerInCourse } from "./LearnerInCourse";

@Entity()
@Filter({ name: 'name', cond: args => ({ name: { $like: `%${args.name}%` } }) })
export class Course extends BaseEntity {
  @Property()
  @Unique()
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => User)
  lecturer: User;

  @ManyToMany({
    entity: () => User,
    pivotEntity: () => LearnerInCourse,
    mappedBy: (e) => e.joinedCourses,
  })
  participants = new Collection<User>(this);

  @OneToMany(() => CourseSection, (e) => e.course)
  sections? = new Collection<CourseSection>(this);

  @OneToMany(() => Quiz, (e) => e.course)
  quizzes? = new Collection<Quiz>(this);

  constructor({ name, description, lecturer }: CreateCourseDTO) {
    super();
    this.name = name;
    this.description = description;
    this.lecturer = lecturer;
  }
}

export const CreateCourseSchema = object({
  name: string().required(),
  description: string().required(),
});

export type CreateCourseDTO = {
  name: string;
  description: string;
  lecturer: User;
  participants?: User[]
  sections?: CourseSection[]
};
