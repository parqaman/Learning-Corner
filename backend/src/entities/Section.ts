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
import { File } from "./File";

@Entity()
export class Section extends BaseEntity {
  @Property()
  header: string;

  @Property()
  description: string;

  @Property()
  text: string;

  @ManyToOne(() => Course)
  course: Course;

  @OneToMany(() => File, (e) => e.section)
  files = new Collection<File>(this);

  constructor({ header, description, text, course }: CreateSectionDTO) {
    super();
    this.header = header;
    this.description = description;
    this.text = text;
    this.course = course;
  }
}

export const CreateSectionSchema = object({
  header: string().required(),
  description: string(),
  text: string(),
});

export type CreateSectionDTO = {
  header: string;
  description: string;
  text: string;
  course: Course;
};
