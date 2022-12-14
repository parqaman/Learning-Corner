import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { Section } from "./Section";

@Entity()
export class File extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => Section)
  section: Section;

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
  section: Section;
};
