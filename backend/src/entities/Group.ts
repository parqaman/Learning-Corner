import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { LearnerInCourse } from "./LearnerInCourse";

@Entity()
export class Group extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToMany({ entity: () => LearnerInCourse, mappedBy: (e) => e.groups })
  participants? = new Collection<LearnerInCourse>(this);

  constructor({ name, description }: CreateGroupDTO) {
    super();
    this.name = name;
    this.description = description;
  }
}

export const CreateGroupSchema = object({
  name: string().required(),
  description: string().required(),
});

export type CreateGroupDTO = {
  name: string;
  description: string;
};
