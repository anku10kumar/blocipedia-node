const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require ("../../src/db/models/index").sequelize;
const User = require ("../../src/db/models").User;
const Wiki = require ("../../src/db/models").Wiki;

describe ("routes : wikis", () => {

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
                    title: "FC Barcelona Wiki",
                    body: "This is Barca's wiki page",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err,res,body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect(body).toContain("FC Barcelona Wiki");
                done();
            });
        });
    });

    describe("GET /wikis/new", () => {

       it("should render a new wiki form", (done) => {
            request.get(`${base}/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", () => {

       it("should create a new wiki and redirect", (done) => {
            const options = {
                url: `${base}/create`,
                form: {
                    title: "Real Madrid Wiki Page",
                    body: "Real Madrid is a Football Club",
                    private: false,
                    userId: this.user.id
                }
            }
            request.post(options, (res, err, body) => {
                Wiki.findOne({where: {title: "Real Madrid Wiki Page"}})
                .then((wiki) => {
                    expect(res.statusCode).toBe(303);
                    expect(wiki.title).toBe("Real Madrid Wiki Page");
                    expect(wiki.body).toBe("Real Madrid is a Football Club");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("FC Barcelona Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/:id/destroy", () => {

        it("should delete the wiki with the associated id", (done) => {

            Wiki.all()
            .then((wikis) => {
                const wikiCountBeforeDelete = wikis.length;

                expect(wikiCountBeforeDelete).toBe(1);

                request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
                    Wiki.all()
                    .then((wikis) => {
                        expect(err).toBeNull();
                        expect(wikis.length).toBe(wikiCountBeforeDelete -1);
                        done();
                    });
                });
            });
        });
    });

    describe("GET /wikis/:id/edit", () => {

        it("should render a view with an edit wiki form", (done) => {

            request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("FC Barcelona Wiki");
                done();
            });
        });
    });

    describe(" POST /wikis/:id/update", () => {

        it("should update the wiki with the given values", (done) => {
            const options = {
                url: `${base}/${this.wiki.id}/update`,
                form: {
                    title: "FC Barcelona Wiki",
                    body: "This is Barca's wiki page",
                    private: false,
                    userId: this.user.id
                }
            };
            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                Wiki.findOne({
                    where: { id: this.wiki.id}
                })
                .then((wiki) => {
                    expect(wiki.title).toBe("FC Barcelona Wiki");
                    done();
                });
            });
        });
    });
})
