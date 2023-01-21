import Request from "supertest";
import { expect } from "chai";
import { mockup_user } from "./mockupData";

describe("Auth Controller Test", () => {
  const baseurl = "localhost:4000/auth";
  var userId: string;

  after((done) => {
    
  })

  describe("Register", () => {
    it("can successfully register a new user", (done) => {
      Request(baseurl)
        .post("/register")
        .send(mockup_user)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body.id).not.to.be.null;
          expect(res.body.firstName).to.be.equal(mockup_user.firstName);
          expect(res.body.lastName).to.be.equal(mockup_user.lastName);
          expect(res.body.email).to.be.equal(mockup_user.email);
          expect(res.body.photo).to.be.equal(mockup_user.photo);
          userId = res.body.id;
          if (err) {
            throw err;
          }
          done();
        });
    });
  });
});
