import { object, string } from "yup";
import {
  Collection,
  Entity,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Section } from "./Section";
import { Quiz } from "./Quiz";

@Entity()
export class Course extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => User)
  lecturer: User;

  @ManyToMany({
    entity: () => User,
    mappedBy: (e) => e.joinedCourses,
  })
  participants = new Collection<User>(this);

  @OneToMany(() => Section, (e) => e.course)
  sections? = new Collection<Section>(this);

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
};
