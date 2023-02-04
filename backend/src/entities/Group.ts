import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { object, string } from 'yup';
import { BaseEntity } from './BaseEntity';
import { Course } from './Course';
import { LearnerInCourse } from './LearnerInCourse';
import { LearnerInGroup } from './LearnerInGroup';
import { Section } from './Section';

@Entity()
export class Group extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne({ entity: () => Course, onDelete: 'cascade' })
  course: Course;

  @ManyToMany({
    entity: () => LearnerInCourse,
    pivotEntity: () => LearnerInGroup,
    mappedBy: (e) => e.groups,
  })
  members = new Collection<LearnerInCourse>(this);

  @OneToMany(() => Section, (e) => e.group)
  sections? = new Collection<Section>(this);

  constructor({ name, description, course }: CreateGroupDTO) {
    super();
    this.name = name;
    this.description = description;
    this.course = course;
  }
}

export const CreateGroupSchema = object({
  name: string().required(),
  description: string().required(),
});

export type CreateGroupDTO = {
  name: string;
  description: string;
  course: Course;
  sections?: Section[];
};
