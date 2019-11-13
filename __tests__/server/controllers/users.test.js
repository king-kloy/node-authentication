const chai = require("chai");
const faker = require("faker");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");
const {
  expect
} = require("chai");

const User = require("../../../server/models/User.model");
const userController = require("../../../server/controllers/user");

chai.use(sinonChai);

let sandbox = null;

describe("Users controller", () => {
  let req = {
    user: {
      id: faker.random.number()
    },
    value: {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
  };

  let res = {
    json: function () {
      return this;
    },
    status: function () {
      return this;
    }
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("secret", () => {
    it("should return resource when called", () => {
      sandbox.spy(console, "log");
      sandbox.spy(res, "json");

      return userController.secret(req, res).then(() => {
        expect(console.log).to.have.called;
        expect(res.json.calledWith({
          secret: "resource"
        })).to.be.ok;
        expect(res.json).to.have.been.calledWith({
          secret: "resource"
        });
      });
    });
  });

  describe("signIn", () => {
    it("should return token when signIn called", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      /* this test we are going to only test for 200.
       * and that res.json was called only ones
       * next test we are going to fake jwt token
       */
      return userController.signIn(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      });
    });

    it("should return fake token using rewire", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");

      // fake jwt token with rewire
      let signToken = userController.__set__("signToken", user => "fakeToken");

      // we expect res json  to have been called  with our fake token
      return userController.signIn(req, res).then(() => {
        expect(res.json).to.have.been.calledWith({
          token: "fakeToken"
        });
        signToken();
      });
    });
  });

  describe("signUp", () => {
    it("should return 403 if user is already save in db.", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve({
        id: faker.random.number()
      }));

      return userController.signUp(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(403);
        expect(res.json).to.have.been.calledWith({
          error: "email is already in use"
        });
      });
    });

    it("should return 200 if user is not in db and it was saved", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox.stub(User.prototype, "save").returns(Promise.resolve({
        id: faker.random.number()
      }));

      return userController.signUp(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      });
    });

    it("should return 200 if user is not in db using callback done", done => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox.stub(User.prototype, "save").returns(Promise.resolve({
        id: faker.random.number()
      }));

      userController.signUp(req, res).then(done());

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json.callCount).to.equal(1);
    });

    it("should return fake token using res.json", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox.stub(User.prototype, "save").returns(Promise.resolve({
        id: faker.random.number()
      }));

      // fake jwt token with rewire
      let signToken = userController.__set__("signToken", user => "fakeTokenNumberTwo");

      // we expect res json  to have been called  with our fake token
      return userController.signUp(req, res).then(() => {
        expect(res.json).to.have.been.calledWith({
          token: "fakeTokenNumberTwo"
        });
        signToken();
      });
    });
  });
});