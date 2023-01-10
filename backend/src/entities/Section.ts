import {Cascade, Collection, Entity, ManyToOne, OneToMany, Property,} from "@mikro-orm/core";
import {object, string} from "yup";
import {BaseEntity} from "./BaseEntity";
import {Course} from "./Course";
import {File} from "./File";
import {Group} from "./Group";

@Entity()
export class Section extends BaseEntity {
  @Property()
  heading: string;

  @Property()
  description: string;

  @Property()
  text: string;

  @ManyToOne({entity: () => Course, nullable: true, onDelete: 'cascade'})
  course?: Course;

  @ManyToOne({entity: () => Group, nullable: true, onDelete: 'cascade'})
  group?: Group;

  @OneToMany({ entity: () => File, mappedBy: (e) => e.section, nullable: true, cascade: [Cascade.ALL]})
  files = new Collection<File>(this);

  constructor({ heading, description, text, course, group }: CreateSectionDTO) {
    super();
    this.heading = heading;
    this.description = description;
    this.text = text;
    this.course = course;
    this.group = group;
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
