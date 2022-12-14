import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { CourseSection } from "./CourseSection";

@Entity()
export class CourseFile extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => CourseSection)
  section: CourseSection;

  constructor({ name, description, section }: CreateFileDTO) {
    super();
    this.name = name;
    this.description = description;
    this.section = section;
  }
}

export const CreateFileSchema = object({
  name: string().required(),
  description: string(),
});

export type CreateFileDTO = {
  name: string;
  description: string;
  section: CourseSection;
};
