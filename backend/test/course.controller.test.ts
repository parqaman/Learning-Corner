import Request from "supertest";
import { expect } from "chai";
import {
  mockup_course,
  mockup_section,
  mockup_user,
  mockup_user_2,
} from "./mockupData";
import { Course, Section } from "../src/entities";

describe("Course Controller Test", () => {
  const rootURL = "localhost:4000/courses";
  var userID = "";
  var userID_2 = "";
  var localCourse: Course;
  var localSection: Section;
  var token = "";
  var token_2 = "";

  before((done) => {
    //create user 1 acc
    Request("localhost:4000")
      .post("/auth/register")
      .send(mockup_user)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .then((res) => {
        expect(res.statusCode).to.be.equal(201);
        userID = res.body.id;

        //create user 2 acc
        Request("localhost:4000")
          .post("/auth/register")
          .send(mockup_user_2)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .then((res2) => {
            expect(res2.statusCode).to.be.equal(201);
            userID_2 = res2.body.id;

            //login user 1
            Request("localhost:4000")
              .post("/auth/login")
              .send({
                email: mockup_user.email,
                password: mockup_user.password,
              })
              .set("Accept", "application/json")
              .set("Content-Type", "application/json")
              .then((res3) => {
                expect(res3.statusCode).to.be.equal(200);
                token = res3.body.accessToken;

                //login user 2
                Request("localhost:4000")
                  .post("/auth/login")
                  .send({
                    email: mockup_user_2.email,
                    password: mockup_user_2.password,
                  })
                  .set("Accept", "application/json")
                  .set("Content-Type", "application/json")
                  .end((err, res4) => {
                    expect(res4.statusCode).to.be.equal(200);
                    token_2 = res4.body.accessToken;
                    if (err) {
                      throw err;
                    }
                    done();
                  });
              });
          });
      })
      .catch((err) => {
        throw err;
      });
  });

  after((done) => {
    Request("localhost:4000/users")
      .delete("/" + userID)
      .set("Authorization", token)
      .then((res) => {
        Request("localhost:4000/users")
          .delete("/" + userID_2)
          .set("Authorization", token_2)
          .end((err, res) => {
            if (err) throw err;
            done();
          });
      });
  });

  //CRUD test for course
  describe("Course CRUD test", () => {
    describe("Create a new course", () => {
      it("Can create a new course", (done) => {
        Request(rootURL)
          .post("/")
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .send(mockup_course)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(201);
            expect(res.body.id).to.be.not.null;
            if (err) {
              throw err;
            }
            localCourse = res.body;
            done();
          });
      });

      it("Cannot create a new course with an existing course name", (done) => {
        Request(rootURL)
          .post("/")
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .send(mockup_course)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(409);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });

    describe("Read a course", () => {
      it("Can read an existing course", (done) => {
        Request(rootURL)
          .get("/" + localCourse.id)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.id).to.be.equal(localCourse.id);
            expect(res.body.name).to.be.equal(mockup_course.name);
            expect(res.body.description).to.be.equal(mockup_course.description);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });

    describe("Update a course", () => {
      it("Can update an existing course", (done) => {
        var newCourseName = "New test course ";
        var newCourseDesc = "This is a new description";

        Request(rootURL)
          .put("/" + localCourse.id)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .send({
            name: newCourseName,
            description: newCourseDesc,
          })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.id).to.be.equal(localCourse.id);
            expect(res.body.name).to.be.equal(newCourseName);
            expect(res.body.description).to.be.equal(newCourseDesc);
            expect(res.body.lecturer).to.be.equal(userID);
            if (err) {
              throw err;
            }
            done();
          });
      });

      it("Cannot update other person's course", (done) => {
        var newCourseName = "New test course ";
        var newCourseDesc = "This is a new description";

        Request(rootURL)
          .put("/" + localCourse.id)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token_2)
          .send({
            name: newCourseName,
            description: newCourseDesc,
          })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(401);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });

    describe("Delete a course", () => {
      it("Cannot delete an other person's course", (done) => {
        Request(rootURL)
          .delete("/" + localCourse.id)
          .set("Authorization", token_2)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(401);
            if (err) {
              throw err;
            }
            done();
          });
      });

      it("Can delete an existing course", (done) => {
        Request(rootURL)
          .delete("/" + localCourse.id)
          .set("Authorization", token)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(204);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });
  });

  //CUD test for section (No Read Operation, since not created/not needed)
  describe("Section in a Course CRUD test", () => {
    before((done) => {
      Request(rootURL)
        .post("/")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(mockup_course)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body.id).to.be.not.null;
          if (err) {
            throw err;
          }
          localCourse = res.body;
          done();
        });
    });

    describe("Create a new section", () => {
      it("Can create a new section in a course", (done) => {
        Request(rootURL)
          .post("/" + localCourse.id + "/section")
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .send({
            ...mockup_section,
            course: localCourse,
          })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(201);
            expect(res.body.id).to.be.not.null;
            if (err) {
              throw err;
            }
            localSection = res.body;
            done();
          });
      });

      it("Can not create a new section in an unexisting course", (done) => {
        Request(rootURL)
          .post("/" + "invalid-course-id" + "/section")
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .send(mockup_section)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(404);
            if (err) {
              throw err;
            }
            done();
          });
      });

      it("Can not create a new section in other person's course", (done) => {
        Request(rootURL)
          .post("/" + localCourse.id + "/section")
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token_2)
          .send(mockup_section)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(401);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });

    describe("Update a section", () => {
      it("Can update an existing section in a course", (done) => {
        var newSectionName = "New test section ";
        var newSectionDesc = "This is a new description";

        Request(rootURL)
          .put("/" + localCourse.id + "/section/" + localSection.id)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token)
          .send({
            heading: newSectionName,
            description: newSectionDesc,
          })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.heading).to.be.equal(newSectionName);
            expect(res.body.description).to.be.equal(newSectionDesc);
            if (err) {
              throw err;
            }
            done();
          });
      });

      it("Cannot update a section in other person's course", (done) => {
        var newSectionName = "New test section ";
        var newSectionDesc = "This is a new description";

        Request(rootURL)
          .put("/" + localCourse.id + "/section/" + localSection.id)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", token_2)
          .send({
            heading: newSectionName,
            description: newSectionDesc,
          })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(401);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });

    describe("Delete a section", () => {
      it("Cannot delete a section in other person's course", (done) => {
        Request(rootURL)
          .delete("/" + localCourse.id + "/section/" + localSection.id)
          .set("Authorization", token_2)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(401);
            if (err) {
              throw err;
            }
            done();
          });
      });

      it("Can delete an existing section in a  course", (done) => {
        Request(rootURL)
          .delete("/" + localCourse.id + "/section/" + localSection.id)
          .set("Authorization", token)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(204);
            if (err) {
              throw err;
            }
            done();
          });
      });
    });
  });

  //Read operation test for chat messages in a course
  describe("Chat messages in a course test", () => {
    before((done) => {
      Request("localhost:4000")
        .put(`/users/${userID}/course/${localCourse.id}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          done();
        });
    });

    it("Can sucessfully read messages that belongs to a course", (done) => {
      Request(rootURL)
        .get("/" + localCourse.id + "/message")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("Cannot read messages that belongs to a course he/she did not join", (done) => {
      Request(rootURL)
        .get("/" + localCourse.id + "/message")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token_2)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });
});
