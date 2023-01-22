import Request from "supertest";
import { expect } from "chai";
import {
  mockup_course,
  mockup_section,
  mockup_user,
  mockup_user_2,
} from "./mockupData";
import { Course, Section, User } from "../src/entities";
import path from "path";
import fs from "fs";
import {describe} from 'mocha'

describe("Upload Controller Test", () => {
  const rootURL = "localhost:4000/sections";
  var user: User;
  var course: Course;
  var section: Section;
  var token = "";
  const pathToFile = path.resolve() + "/upload/tmp/profile_empty.png";

  before((done) => {
    //create user acc
    Request("localhost:4000")
      .post("/auth/register")
      .send(mockup_user)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .then((res) => {
        expect(res.statusCode).to.be.equal(201);
        user = res.body;

        //login user
        Request("localhost:4000")
          .post("/auth/login")
          .send({
            email: mockup_user.email,
            password: mockup_user.password,
          })
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .then((res2) => {
            expect(res2.statusCode).to.be.equal(200);
            token = res2.body.accessToken;

            //create a course
            Request("localhost:4000")
              .post("/courses")
              .set("Accept", "application/json")
              .set("Content-Type", "application/json")
              .set("Authorization", token)
              .send(mockup_course)
              .then((res3) => {
                expect(res3.statusCode).to.be.equal(201);
                course = res3.body;

                //create a section in the course
                Request("localhost:4000/courses")
                  .post("/" + course.id + "/section")
                  .set("Accept", "application/json")
                  .set("Content-Type", "application/json")
                  .set("Authorization", token)
                  .send({
                    ...mockup_section,
                    course: course,
                  })
                  .end((err, res) => {
                    expect(res.statusCode).to.be.equal(201);
                    if (err) {
                      throw err;
                    }
                    section = res.body;
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
      .delete("/" + user.id)
      .set("Authorization", token)
      .end((err, res) => {
        //cleaning up file
        fs.unlink(
          path.resolve() + `/upload/files/${section.id}/profile_empty.png`,
          (err) => {
            if (err) throw err;
            //cleaning up directory of file
            fs.rmdir(path.resolve() + `/upload/files/${section.id}`, (err) => {
              if (err) throw err;
            });
          }
        );
        if (err) throw err;
        done();
      });
  });

  describe("Create a new file", () => {
    it("Can create (upload) a new file", (done) => {
      Request(rootURL)
        .post(`/${section.id}/file`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .attach("empty profile img", pathToFile)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) {
            throw err;
          }
          done();
        });
    });
  });
});
