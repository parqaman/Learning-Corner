import { Entity, ManyToOne } from "@mikro-orm/core";
import { Group } from "./Group";
import { LearnerInCourse } from "./LearnerInCourse";

@Entity()
export class LearnerInGroup {
  @ManyToOne({
    primary: true,
    entity: () => LearnerInCourse,
    onDelete: "cascade",
  })
  learner: LearnerInCourse;

  @ManyToOne({ primary: true, entity: () => Group, onDelete: "cascade" })
  group: Group;

  constructor({ learner, group }: CreateLearnerInGroupDTO) {
    this.learner = learner;
    this.group = group;
  }
}

export type CreateLearnerInGroupDTO = {
  learner: LearnerInCourse;
  group: Group;
};
