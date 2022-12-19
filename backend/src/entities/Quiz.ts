import { object, string } from "yup";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Question } from "./Question";
import { Course } from "./Course";

@Entity()
export class Quiz extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => Course)
  course: Course;

  @OneToMany(() => Question, (e) => e.quiz)
  questions = new Collection<Question>(this);

  constructor({ name, description, course, questions }: CreateQuizDTO) {
    super();
    this.name = name;
    this.description = description;
    this.course = course;
    this.questions = questions;
  }
}

export const CreateQuizSchema = object({
  name: string().required(),
  description: string(),
});

export type CreateQuizDTO = {
  name: string;
  description: string;
  course: Course;
  questions: Collection<Question>;
};
