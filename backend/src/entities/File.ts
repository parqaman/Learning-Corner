import { Entity, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class File extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  constructor({ name, description }: CreateFileDTO) {
    super();
    this.name = name;
    this.description = description;
  }
}

export const CreateFileSchema = object({
    name: string().required(),
    description: string()
})

export type CreateFileDTO = {
    name: string,
    description: string
}