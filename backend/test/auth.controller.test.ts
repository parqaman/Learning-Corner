import Request from "supertest";
import { expect } from "chai";
import { mockup_user } from "./mockupData";

describe("Auth Controller Test", () => {
  const baseurl = "localhost:4000/auth";
  var userId: string;
  var token: string;

  // Delete user
  after((done) => {
    Request("localhost:4000/users")
      .delete("/" + userId)
      .set("Authorization", token)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

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
          if (err) throw err;
          done();
        });
    });

    it("cannot register a new user with a registered email", (done) => {
      Request(baseurl)
        .post("/register")
        .send(mockup_user)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          if (err) throw err;
          done();
        });
    });
  });

  describe("Login", () => {
    it("can succesfully log in", (done) => {
      Request(baseurl)
        .post("/login")
        .send({
          email: mockup_user.email,
          password: mockup_user.password,
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          token = res.body.accessToken;
          if (err) throw err;
          done();
        });
    });

    it("cannot log in with an unregistered email", (done) => {
      Request(baseurl)
        .post("/login")
        .send({
          email: "test@mail.com",
          password: mockup_user.password,
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          if (err) throw err;
          done();
        });
    });

    it("cannot log in with a wrong password", (done) => {
      Request(baseurl)
        .post("/login")
        .send({
          email: mockup_user.email,
          password: "wrongPassword",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) throw err;
          done();
        });
    });
  });

  describe("Reset password", () => {
    it("can successfully reset the password", (done) => {
      Request(baseurl)
        .put("/resetpassword")
        .send({
          id: userId,
          newPassword: "newPassword",
          currentPassword: mockup_user.password,
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          if (err) throw err;
          done();
        });
    });

    it("cannot reset the password of an unregistered user", (done) => {
      Request(baseurl)
        .put("/resetpassword")
        .send({
          id: 2,
          newPassword: "newPassword",
          currentPassword: mockup_user.password,
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(400);
          if (err) throw err;
          done();
        });
    });

    it("cannot reset the password with a wrong current password", (done) => {
      Request(baseurl)
        .put("/resetpassword")
        .send({
          id: userId,
          newPassword: "newPassword",
          currentPassword: "wrongPassword",
        })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(401);
          if (err) throw err;
          done();
        });
    });
  });
});
