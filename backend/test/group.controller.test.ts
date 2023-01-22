import Request from "supertest";
import { expect } from "chai";
import {
  mockup_course,
  mockup_group,
  mockup_section,
  mockup_user,
} from "./mockupData";
import { Course, Group, Section } from "../src/entities";
import {describe} from 'mocha'

describe("Group Controller Test", () => {
  const baseurl = "localhost:4000/groups";
  var userId: string;
  var token: string;
  var course: Course;
  var group: Group;
  var section: Section;
  var falseUserId: string;
  var falseToken: string;

  // Create user1 and course
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
                Request("localhost:4000")
                  .put(`/users/${userId}/course/${course.id}`)
                  .set("Accept", "application/json")
                  .set("Content-Type", "application/json")
                  .set("Authorization", token)
                  .end((err, res) => {
                    done();
                  });
              });
          });
      })
      .catch((err) => {
        throw err;
      });
  });

  // Create user2
  before((done) => {
    Request("localhost:4000")
      .post("/auth/register")
      .send({ ...mockup_user, email: "test@mail.com" })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end((err, res) => {
        falseUserId = res.body.id;

        Request("localhost:4000")
          .post("/auth/login")
          .send({
            email: "test@mail.com",
            password: mockup_user.password,
          })
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .end((err, res) => {
            falseToken = res.body.accessToken;
            if (err) throw err;
            done();
          });
      });
  });

  // Delete user1
  after((done) => {
    Request("localhost:4000/users")
      .delete("/" + userId)
      .set("Authorization", token)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  // Delete user2
  after((done) => {
    Request("localhost:4000/users")
      .delete("/" + falseUserId)
      .set("Authorization", falseToken)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  describe("Create a new group", () => {
    it("can successfully create a new group", (done) => {
      Request(baseurl)
        .post("/")
        .send({ ...mockup_group, course: course })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body.id).not.to.be.null;
          expect(res.body.name).to.be.equal(mockup_group.name);
          expect(res.body.description).to.be.equal(mockup_group.description);
          group = res.body;
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot create a group without authorization", (done) => {
      Request(baseurl)
        .post("/")
        .send({ ...mockup_group, course: course })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot create a group in a course with an invalid id", (done) => {
      Request(baseurl)
        .post("/")
        .send({
          ...mockup_group,
          course: {
            id: "7",
          },
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Get a group by ID", () => {
    it("can successfully get a group", (done) => {
      Request(baseurl)
        .get("/" + group.id)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.id).not.to.be.null;
          expect(res.body.name).to.be.equal(mockup_group.name);
          expect(res.body.description).to.be.equal(mockup_group.description);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot get a group with an invalid id", (done) => {
      Request(baseurl)
        .get("/1")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Update a group", () => {
    it("can successfully update a group", (done) => {
      Request(baseurl)
        .put("/" + group.id)
        .send({
          description: "an updated description",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.description).to.be.equal("an updated description");
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot update a group without authorization", (done) => {
      Request(baseurl)
        .put("/" + group.id)
        .send({
          description: "an updated description",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot update a group with an invalid id", (done) => {
      Request(baseurl)
        .put("/1")
        .send({
          description: "an updated description",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Create a section in a group", () => {
    // Join group
    before((done) => {
      Request("localhost:4000")
        .put(`/users/${userId}/course/${course.id}/group/${group.id}`)
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

    it("can successfully create a section in a group", (done) => {
      Request(baseurl)
        .post(`/${group.id}/section`)
        .send(mockup_section)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body.id).not.to.be.null;
          expect(res.body.heading).to.be.equal(mockup_section.heading);
          expect(res.body.description).to.be.equal(mockup_section.description);
          expect(res.body.text).to.be.equal(mockup_section.text);
          section = res.body;
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot create a section in a group without authorization", (done) => {
      Request(baseurl)
        .post(`/${group.id}/section`)
        .send(mockup_section)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot create a section in a group with an invalid id", (done) => {
      Request(baseurl)
        .post("/1/section")
        .send(mockup_section)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Update a section in a group", () => {
    it("can successfully update a section in a group", (done) => {
      Request(baseurl)
        .put(`/${group.id}/section/${section.id}`)
        .send({
          heading: "Updated Mockup Section",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.heading).to.be.equal("Updated Mockup Section");
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot update a section in a group without authorization", (done) => {
      Request(baseurl)
        .put(`/${group.id}/section/${section.id}`)
        .send({
          heading: "Updated Mockup Section",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot update a section in a group with an invalid id", (done) => {
      Request(baseurl)
        .put(`/1/section/${section.id}`)
        .send({
          heading: "Updated Mockup Section",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot update a section with an invalid id in a group", (done) => {
      Request(baseurl)
        .put(`/${group.id}/section/1`)
        .send({
          heading: "Updated Mockup Section",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Delete a section in a group", () => {
    it("can successfully delete a section in a group", (done) => {
      Request(baseurl)
        .delete(`/${group.id}/section/${section.id}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(204);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot delete a section in a group without authorization", (done) => {
      Request(baseurl)
        .delete(`/${group.id}/section/${section.id}`)
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot delete a section in a group with an invalid id", (done) => {
      Request(baseurl)
        .delete(`/1/section/${section.id}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot delete a section with an invalid id in a group", (done) => {
      Request(baseurl)
        .delete(`/${group.id}/section/1`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Get messages", () => {
    it("can successfully get a messages in a group", (done) => {
      Request(baseurl)
        .get(`/${group.id}/message`)
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

    it("cannot get a messages in a group without authorization", (done) => {
      Request(baseurl)
        .get(`/${group.id}/message`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot get a messages in a group with an invalid id", (done) => {
      Request(baseurl)
        .get("/1/message")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe("Delete a group", () => {
    it("cannot delete a group without authorization", (done) => {
      Request(baseurl)
        .delete("/" + group.id)
        .set("Authorization", falseToken)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("cannot delete a group with an invalid id", (done) => {
      Request(baseurl)
        .delete("/1")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(404);
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("can successfully delete a group", (done) => {
      Request(baseurl)
        .delete("/" + group.id)
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
