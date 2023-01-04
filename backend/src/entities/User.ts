import { object, string } from "yup";
import {
  Cascade,
  Collection,
  Entity,
  Property,
  ManyToMany,
  OneToMany,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Course } from "./Course";
import { LearnerInCourse } from "./LearnerInCourse";

@Entity()
export class User extends BaseEntity {
  @Property()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({length: 5242880}) //photo max 5 mb
  photo: string;

  @OneToMany(() => Course, (e) => e.lecturer)
  courses = new Collection<Course>(this);

  @ManyToMany({
    entity: () => Course,
    pivotEntity: () => LearnerInCourse,
    inversedBy: (e) => e.participants
  })
  joinedCourses = new Collection<Course>(this);

  constructor({
    email,
    password,
    firstName,
    lastName,
    photo,
  }: RegisterUserDTO) {
    super();
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = photo;
  }
}

export const RegisterUserSchema = object({
  email: string().required(),
  password: string().required().min(8),
  firstName: string().required(),
  lastName: string().required(),
  photo: string().required(),
});

export type RegisterUserDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export const LoginSchema = object({
  email: string().required(),
  password: string().required(),
});

export const ResetPasswortSchema = object({
  id: string().required(),
  newPassword: string().required().min(8),
  currentPassword: string().required(),
});