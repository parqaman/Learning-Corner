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

  @Property()
  photo: string;

  @OneToMany(() => Course, (e) => e.lecturer)
  courses = new Collection<Course>(this);

  @ManyToMany({
    entity: () => Course,
    inversedBy: (e) => e.participants,
    cascade: [Cascade.ALL],
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
  password: string().required(),
  firstName: string().required(),
  lastName: string().required(),
  photo: string(),
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
