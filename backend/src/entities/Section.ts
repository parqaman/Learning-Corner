import { Entity, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Section extends BaseEntity {
  @Property()
  header: string;

  @Property()
  description: string;

  constructor({ header, description }: CreateSectionDTO) {
    super();
    this.header = header;
    this.description = description;
  }
}

export const CreateSectionSchema = object({
    header: string().required(),
    description: string()
})

export type CreateSectionDTO = {
    header: string,
    description: string
}