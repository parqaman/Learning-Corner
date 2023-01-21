import { Course, Group, Message, Section, User } from "../src/entities";

export const mockup_user = new User({
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  password: "12345678",
  photo: "profile_empty.png",
});

export const mockup_course = new Course({
  name: "My Course",
  description: "A description",
  lecturer: mockup_user,
});

export const mockup_group = new Group({
  name: "My Group",
  description: "A description",
  course: mockup_course,
});

export const mockup_section = new Section({
  heading: "Mockup Section",
  description: "this is a mockup section",
  text: "section test",
});
