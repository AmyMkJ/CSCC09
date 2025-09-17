import { readFileSync } from "fs";
import chai from "chai";
import chaiHttp from "chai-http";

import { server, getItems } from "../app.mjs";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Testing Static Files", () => {
  after(function () {
    server.close();
  });

  it("it should get index.html", function (done) {
    chai
      .request(server)
      .get("/")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal(
          readFileSync("./static/index.html", "utf-8"),
        );
        done();
      });
  });
});

describe("Testing API", () => {
  const testData = [
    { id: 0, content: "The quick brown Fox jumps over the lazy Dog" },
    { id: 1, content: "A man, a plan, a canal – Panama" },
  ];

  after(function () {
    server.close();
  });

  it("it should add an item", function (done) {
    chai
      .request(server)
      .post("/api/items")
      .set("content-type", "application/json")
      .send({ content: testData[0].content })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(testData[0]);
        expect(getItems()).to.deep.equal([testData[0]]);
        done();
      });
  });

  it("it should add another item", function (done) {
    const content = "Hello World!";
    chai
      .request(server)
      .post("/api/items")
      .set("content-type", "application/json")
      .send({ content: testData[1].content })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(testData[1]);
        expect(getItems()).to.deep.equal(testData);
        done();
      });
  });

  it("it should get all items", function (done) {
    chai
      .request(server)
      .get("/api/items")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(testData);
        done();
      });
  });

  it("it should delete an item", function (done) {
    chai
      .request(server)
      .delete("/api/items/0/")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(testData[0]);
        expect(getItems()).to.deep.equal([testData[1]]);
        done();
      });
  });

  it("it should get the remaining items", function (done) {
    chai
      .request(server)
      .get("/api/items")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal([testData[1]]);
        done();
      });
  });
});
