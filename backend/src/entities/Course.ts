import { object, string } from "yup";
import {
  Collection,
  Entity,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
  Filter,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Section } from "./Section";
import { Quiz } from "./Quiz";
import { LearnerInCourse } from "./LearnerInCourse";
import { Group } from "./Group";

@Entity()
@Filter({
  name: "name",
  cond: (args) => ({ name: { $ilike: `%${args.name}%` } }),
})
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

  @OneToMany(() => Section, (e) => e.course)
  sections? = new Collection<Section>(this);

  @OneToMany(() => Group, (e) => e.course)
  groups? = new Collection<Group>(this);

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
  participants?: User[];
  sections?: Section[];
};
