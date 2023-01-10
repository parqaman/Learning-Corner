import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { Section } from "./Section";

@Entity()
export class File extends BaseEntity {
  @Property()
  name: string;

  @ManyToOne({entity: () => Section})
  section: Section;

  constructor({ name, section }: CreateFileDTO) {
    super();
    this.name = name;
    this.section = section;
  }
}

export const CreateFileSchema = object({
  name: string().required(),
});

export type CreateFileDTO = {
  name: string;
  section: Section;
};
