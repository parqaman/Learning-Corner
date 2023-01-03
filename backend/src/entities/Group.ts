import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "./BaseEntity";
import { LearnerInCourse } from "./LearnerInCourse";
import { LearnerInGroup } from "./LearnerInGroup";

@Entity()
export class Group extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToMany({
    entity: () => LearnerInCourse,
    pivotEntity: () => LearnerInGroup,
    mappedBy: (e) => e.groups,
  })
  members = new Collection<LearnerInCourse>(this);

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
