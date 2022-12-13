import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";

@Entity()
export class Group extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => Course)
  course: Course;

  constructor({ name, description, course }: CreateGroupDTO) {
    super();
    this.name = name;
    this.description = description;
    this.course = course;
  }
}

export const CreateGroupSchema = object({
  name: string().required(),
  description: string().required(),
});

export type CreateGroupDTO = {
  name: string;
  description: string;
  course: Course;
};
