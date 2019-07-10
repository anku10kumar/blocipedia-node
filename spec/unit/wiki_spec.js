const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki",() => {

    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({force: true}).then((res) => {

            User.create({
                name: "Maggie Daley",
                email: "mdaley@gmail.com",
                password: "123456789"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "Bayern Munich",
                    body: "This is the Bayern Munich wiki",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                });
            });
        });
    });

    describe("#create()", () => {

        it("should create a wiki object with a title,body,privacy status and assigned user", (done) => {

            Wiki.create({
                title: "Vancouver Whitecaps",
                body: "This is the Caps wiki page",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki.title).toBe("Vancouver Whitecaps");
                expect(wiki.body).toBe("This is the Caps wiki page");
                expect(wiki.private).toBeFalsy();
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a wiki object with a missing title, body or assigned user", (done) => {

            Wiki.create({
                title: "Vancouver Whitecaps"
            })
            .then((wiki) => {

                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                expect(err.message).toContain("Wiki.private cannot be null");
                expect(err.message).toContain("Wiki.userId cannot be null");
                done();
            })
        });

    describe("#setUser()", () => {

        it("should associate a user and a wiki together", (done) => {

            User.create({
                name: "Luis Figo",
                email: "lfigo@gmail.com",
                password: "1234567890"
            })
            .then((newUser) => {
                expect(this.wiki.userId).toBe(this.user.id);

                this.wiki.setUser(newUser)
                .then((wiki) => {
                    expect(wiki.userId).toBe(newUser.id);
                    done();
                });
            })
        });
    })

    describe("getUser", () => {

        it("should return the associated user", (done) => {

            this.wiki.getUser()
            .then((associatedUser) => {
                expect(associatedUser.name).toBe("Maggie Daley");
                done();
            });
        });
    })


    });
});
