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
import { Group } from "./Group";

@Entity()
export class Section extends BaseEntity {
  @Property()
  heading: string;

  @Property()
  description: string;

  @Property()
  text: string;

  @ManyToOne(() => Course)
  course?: Course;

  @ManyToOne(() => Group)
  group?: Group;

  @OneToMany(() => File, (e) => e.section)
  files = new Collection<File>(this);

  constructor({ heading, description, text }: CreateSectionDTO) {
    super();
    this.heading = heading;
    this.description = description;
    this.text = text;
  }
}

export const CreateSectionSchema = object({
  heading: string().required(),
  description: string().required(),
  text: string().required(),
});

export type CreateSectionDTO = {
  heading: string;
  description: string;
  text: string;
  course?: Course;
  group?: Group;
};
