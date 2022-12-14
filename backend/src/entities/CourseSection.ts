import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { CourseFile } from "./CourseFile";

@Entity()
export class CourseSection extends BaseEntity {
  @Property()
  heading: string;

  @Property()
  description: string;

  @Property()
  text: string;

  @ManyToOne(() => Course)
  course: Course;

  @OneToMany(() => CourseFile, (e) => e.section)
  files = new Collection<File>(this);

  constructor({ heading, description, text, course }: CreateCourseSectionDTO) {
    super();
    this.heading = heading;
    this.description = description;
    this.text = text;
    this.course = course;
  }
}

export const CreateCourseSectionSchema = object({
  heading: string().required(),
  description: string(),
  text: string(),
});

export type CreateCourseSectionDTO = {
  heading: string;
  description: string;
  text: string;
  course: Course;
};
