import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { Group } from "./Group";
import { LearnerInCourse } from "./LearnerInCourse";

@Entity()
export class LearnerInGroup {
  @ManyToOne({
    primary: true,
    entity: () => LearnerInCourse,
    onDelete: "cascade",
  })
  member: LearnerInCourse;

  @ManyToOne({ primary: true, entity: () => Group, onDelete: "cascade" })
  group: Group;

  constructor({ learner, group }: CreateLearnerInGroupDTO) {
    this.member = learner;
    this.group = group;
  }
}

export type CreateLearnerInGroupDTO = {
  learner: LearnerInCourse;
  group: Group;
};
