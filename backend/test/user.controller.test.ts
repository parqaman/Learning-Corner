import Request from "supertest";
import { expect } from "chai";
import { mockup_course, mockup_group, mockup_user } from "./mockupData";
import { Course } from "../src/entities";

describe("User Controller Test", () => {
  const baseurl = "localhost:4000/users";
  var userId: string;
  var token: string;
  var course: Course;
  var courseId: string;
  var groupId: string;

  // create user, course and group
  before((done) => {
    Request("localhost:4000")
      .post("/auth/register")
      .send(mockup_user)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .then((res) => {
        userId = res.body.id;

        Request("localhost:4000")
          .post("/auth/login")
          .send({
            email: mockup_user.email,
            password: mockup_user.password,
          })
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .end((err, res) => {
            token = res.body.accessToken;

            Request("localhost:4000")
              .post("/courses")
              .send(mockup_course)
              .set("Accept", "application/json")
              .set("Content-Type", "application/json")
              .set("Authorization", token)
              .end((err, res) => {
                course = res.body;
                courseId = res.body.id;
                Request("localhost:4000")
                  .put(`/users/${userId}/course/${courseId}`)
                  .set("Accept", "application/json")
                  .set("Content-Type", "application/json")
                  .set("Authorization", token)
                  .end((err, res) => {
                    Request("localhost:4000")
                      .post("/groups")
                      .set("Accept", "application/json")
                      .set("Content-Type", "application/json")
                      .set("Authorization", token)
                      .send({
                        ...mockup_group,
                        course: course,
                      })
                      .end((err, res) => {
                        groupId = res.body.id;
                        if (err) {
                          throw err;
                        }
                        done();
                      });
                  });
              });
          });
      })
      .catch((err) => {
        throw err;
      });
  });

  describe("Get a user by ID", () => {
    it("can successfully get a user", (done) => {
      Request(baseurl)
        .get(`/${userId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.id).to.be.equal(userId);
          expect(res.body.firstName).to.be.equal(mockup_user.firstName);
          expect(res.body.lastName).to.be.equal(mockup_user.lastName);
          expect(res.body.email).to.be.equal(mockup_user.email);
          expect(res.body.photo).to.be.equal(mockup_user.photo);
          if (err) throw err;
          done();
        });
    });

    it("cannot get a user with an invalid id", (done) => {
      Request(baseurl)
        .get(`/2`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(204);
          if (err) throw err;
          done();
        });
    });
  });

  describe("Update a user", () => {
    it("can successfully update a user", (done) => {
      Request(baseurl)
        .put(`/${userId}`)
        .send({ lastName: "Mustermann" })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.lastName).to.be.equal("Mustermann");
          if (err) throw err;
          done();
        });
    });

    it("cannot update a user with an invalid id", (done) => {
      Request(baseurl)
        .put(`/2`)
        .send({ lastName: "Mustermann" })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });
  });

  describe("Get user groups", () => {
    it("can successfully get user groups", (done) => {
      Request(baseurl)
        .get(`/${userId}/groups`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) throw err;
          done();
        });
    });

    it("cannot get groups of user with an invalid id", (done) => {
      Request(baseurl)
        .get(`/2/groups`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });
  });

  describe("User's Course Interaction", () => {
    var userId2: string;
    var token2: string;

    // Create user
    before((done) => {
      Request("localhost:4000")
        .post("/auth/register")
        .send({ ...mockup_user, email: "test@mail.com" })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .then((res) => {
          userId2 = res.body.id;

          Request("localhost:4000")
            .post("/auth/login")
            .send({
              email: "test@mail.com",
              password: mockup_user.password,
            })
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .end((err, res) => {
              token2 = res.body.accessToken;
              if (err) {
                throw err;
              }
              done();
            });
        })
        .catch((err) => {
          throw err;
        });
    });

    // Delete user
    after((done) => {
      Request(baseurl)
        .delete("/" + userId2)
        .set("Authorization", token2)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

    it("Can join a course", (done) => {
      Request(baseurl)
        .put(`/${userId2}/course/${courseId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token2)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("Cannot join an already joined course", (done) => {
      Request(baseurl)
        .put(`/${userId2}/course/${courseId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token2)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(409);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("Can leave a course", (done) => {
      Request(baseurl)
        .delete(`/${userId2}/course/${courseId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token2)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(204);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("Cannot leave a left course", (done) => {
      Request(baseurl)
        .delete(`/${userId2}/course/${courseId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token2)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(409);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("User's Group Interaction", () => {
    it("Can join a group", (done) => {
      Request(baseurl)
        .put(`/${userId}/course/${courseId}/group/${groupId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) {
            console.log(err);
            throw err;
          }
          done();
        });
    });

    it("Cannot join an already joined group", (done) => {
      Request(baseurl)
        .put(`/${userId}/course/${courseId}/group/${groupId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(409);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("Can leave a group", (done) => {
      Request(baseurl)
        .delete(`/${userId}/course/${courseId}/group/${groupId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(204);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("Cannot leave a left group", (done) => {
      Request(baseurl)
        .delete(`/${userId}/course/${courseId}/group/${groupId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(409);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Favorite course", () => {
    it("can toggle favorite course of a user", (done) => {
      Request(baseurl)
        .put(`/${userId}/course/${courseId}/favorite`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) throw err;
          done();
        });
    });

    it("cannot toggle favorite course of a user with an invalid id", (done) => {
      Request(baseurl)
        .put(`/2/course/${courseId}/favorite`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });

    it("cannot toggle favorite of a course with an invalid id", (done) => {
      Request(baseurl)
        .put(`/${userId}/course/7/favorite`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });

    it("cannot toggle favorite of a course that have not joined yet", (done) => {
      Request(baseurl)
        .put(`/${userId}/course/1/favorite`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });

    it("can get favorite courses of a user", (done) => {
      Request(baseurl)
        .get(`/${userId}/favorite`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) throw err;
          done();
        });
    });

    it("cannot get favorite courses of a user with an invalid id", (done) => {
      Request(baseurl)
        .get(`/2/favorite`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });
  });

  describe("Delete a user", () => {
    it("cannot delete a user with an invalid id", (done) => {
      Request(baseurl)
        .delete(`/2`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) throw err;
          done();
        });
    });

    it("can successfully delete a user", (done) => {
      Request(baseurl)
        .delete(`/${userId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(204);
          if (err) throw err;
          done();
        });
    });
  });
});
