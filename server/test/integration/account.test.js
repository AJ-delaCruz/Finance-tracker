import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import AccountModel from '../../models/AccountModel.js';

const { expect } = chai;
chai.use(chaiHttp);
// Account API tests
describe('Account API Tests', () => {
  let token;
  let testAccount;
  let testAccountPOST;

  // get user token authentication
  before((done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({ username: 'new', password: 'test' }) // get user credentials
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        token = res.body.token; // Get the token from the response
        return done();
      });
  });
  // Create a Account before each test
  beforeEach((done) => {
    const AccountData = {
      type: 'Checking',
      name: 'Test account',
      balance: 300,
      creditLimit: 5000,
    };

    chai.request(app)
      .post('/api/Account/create')
      .set('Authorization', `Bearer ${token}`) // Set jwt
      .send(AccountData)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        testAccount = res.body;
        return done();
      });
  });
  // delete the created Account before each test from mongodb
  afterEach((done) => {
    if (testAccount) {
      // Delete the created Account after each test
      AccountModel.findByIdAndDelete({ _id: testAccount._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // Delete the created Account from post req
  after((done) => {
    if (testAccountPOST) {
      AccountModel.findByIdAndDelete({ _id: testAccountPOST._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // test Account POST request
  describe('POST Account', () => {
    it('should create a new Account', (done) => {
      const AccountData = {
        type: 'Credit Card',
        name: 'Test account',
        balance: 300,
        creditLimit: 5000,
      };

      chai.request(app)
        .post('/api/Account/create')
        .set('Authorization', `Bearer ${token}`) // Set jwt
        .send(AccountData)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testAccountPOST = res.body; // delete after all tests finished
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id');
          expect(res.body.name).to.equal(AccountData.name);
          expect(res.body.type).to.equal(AccountData.type);
          expect(res.body.balance).to.equal(AccountData.balance);
          expect(res.body.creditLimit).to.equal(AccountData.creditLimit);

          return done();
        });
    });
  });

  // test Account GET request
  describe('GET all Accounts', () => {
    it('should return all Accounts', (done) => {
      chai.request(app)
        .get('/api/Account/all')
        .set('Authorization', `Bearer ${token}`) // set jwt
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          return done();
        });
    });
  });

  // test put api
  describe('PUT Account', () => {
    it('should update the Account', (done) => {
      const updatedAccount = {
        name: 'Test update account',
        balance: 500,
        creditLimit: 10000,
      };

      chai.request(app)
        .put(`/api/Account/update/${testAccount._id}`)
        .set('Authorization', `Bearer ${token}`) // set jwt
        .send(updatedAccount)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testAccount._id);
          expect(res.body.name).to.equal(updatedAccount.name);
          expect(res.body.balance).to.equal(updatedAccount.balance);
          expect(res.body.creditLimit).to.equal(updatedAccount.creditLimit);

          return done();
        });
    });
  });

  // test delete api
  describe('DELETE Account', () => {
    it('should delete the Account', (done) => {
      chai.request(app)
        .delete(`/api/account/${testAccount._id}`)
        .set('Authorization', `Bearer ${token}`) // set jwt
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testAccount._id);

          // check if the Account is deleted from mongodb
          AccountModel.findById(testAccount._id)
            .then((Account) => {
              expect(Account).to.be.null;
              return done();
            })
            .catch((error) => done(error));
        });
    });
  });
});
