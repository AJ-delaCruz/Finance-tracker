import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import TransactionModel from '../../models/TransactionModel.js';

const { expect } = chai;
chai.use(chaiHttp);
// Transaction API tests
describe('Transaction API', () => {
  let token;
  let transactionTest;
  let transactionTestForPOST;

  // get user token authentication
  before((done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({ username: 'test3', password: 'test' }) // get user credentials
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        token = res.body.token; // Get the token from the response
        return done();
      });
  });
  beforeEach((done) => {
    // Create a transaction before each test
    const transaction = {
      account: '646148949c3a54da85982a0d',
      category: '64607c0606fccc9dc370addb',
      type: 'expense',
      amount: 50,
      description: 'Coffee',
    };
    chai.request(app)
      .post('/api/transaction/create')
      .set('Authorization', `Bearer ${token}`) // Set jwt
      .send(transaction)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        transactionTest = res.body;
        return done();
      });
  });
  afterEach((done) => {
    if (transactionTest) {
      TransactionModel.findByIdAndDelete(transactionTest._id)
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // Delete the created transaction from POST transaction after tests finished
  after((done) => {
    if (transactionTestForPOST) {
      TransactionModel.findByIdAndDelete(transactionTestForPOST._id)
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // test transaction POST request
  describe('POST transaction', () => {
    it('should create a new transaction', (done) => {
      const transaction = {
        account: '646148949c3a54da85982a0d',
        category: '64607c0606fccc9dc370addb',
        type: 'expense',
        amount: 50,
        description: 'Coffee',
      };

      chai.request(app)
        .post('/api/transaction/create')
        .set('Authorization', `Bearer ${token}`) // Set jwt
        .send(transaction)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          transactionTestForPOST = res.body; // delete after all tests finished
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('account');
          expect(res.body).to.have.property('category');
          expect(res.body).to.have.property('type');
          expect(res.body).to.have.property('amount');

          return done();
        });
    });
  });

  // test transaction GET request
  describe('GET all transactions', () => {
    it('should return all transactions', (done) => {
      chai.request(app)
        .get('/api/transaction/all')
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

  describe('GET transactions by type', () => {
    it('should return all transactions by type', (done) => {
      chai.request(app)
        .get('/api/transaction/byType?type=expense')
        .set('Authorization', `Bearer ${token}`) // set jwt
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          // check if the group of transactions are type expense
          res.body.forEach((transaction) => {
            expect(transaction).to.have.property('type').eq('expense');
          });
          return done();
        });
    });
  });
  describe('PUT transaction', () => {
    it('should update the transaction', (done) => {
      const updateTransaction = {
        account: '646148949c3a54da85982a0d',
        category: '64607c0606fccc9dc370addb',
        type: 'expense',
        amount: 100,
        description: 'DoorDash',
      };

      chai.request(app)
        .put(`/api/transaction/update/${transactionTest._id}`)
        .set('Authorization', `Bearer ${token}`) // Set jwt to get authentication
        .send(updateTransaction)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').eql(transactionTest._id);
          expect(res.body).to.have.property('account');
          expect(res.body).to.have.property('category');
          expect(res.body).to.have.property('type');
          expect(res.body).to.have.property('amount').eq(100);
          expect(res.body).to.have.property('description').eq('DoorDash');

          return done();
        });
    });
  });

  describe('DELETE transaction', () => {
    it('should delete the transaction', (done) => {
      chai.request(app)
        .delete(`/api/transaction/${transactionTest._id}`)
        .set('Authorization', `Bearer ${token}`) // Set jwt
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').eql(transactionTest._id);
          return done();
        });
    });
  });
});
