const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach((done) => {
// #1
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {


    it("should create a User object with a valid name,email and password", (done) => {
      User.create({
        name: "example rosco",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        expect(user.email).toBe("user@example.com");
        expect(user.name).toBe("example rosco")
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });


    it("should not create a user with invalid email or password", (done) => {
      User.create({
        name: "example rosco",
        email: "Invalid Email",
        password: "1234567890"
      })
      .then((user) => {



        done();
      })
      .catch((err) => {

        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an email already taken", (done) => {

// #5
      User.create({
        name: "Peter Pan",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {

        User.create({
          name: "Batmen",
          email: "user@example.com",
          password: "whaaaat up"
        })
        .then((user) => {



          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        });

        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

});
