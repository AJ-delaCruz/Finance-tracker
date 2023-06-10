import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import BillModel from '../../models/BillModel.js';

const { expect } = chai;
chai.use(chaiHttp);
describe('Bill API Tests', () => {
  let token;
  let testBill;
  let testBillForPOST;

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

  // Create a bill before each test
  beforeEach((done) => {
    const billData = {
      name: 'Test bill',
      amount: 100,
      dueDate: '2023-06-08',
    };

    chai.request(app)
      .post('/api/bill/create')
      .set('Authorization', `Bearer ${token}`) // Set jwt
      .send(billData)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        testBill = res.body;
        return done();
      });
  });
  // delete the created bill before each test from mongodb
  afterEach((done) => {
    if (testBill) {
      // Delete the created bill after each test
      BillModel.findByIdAndDelete({ _id: testBill._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // Delete the created bill from post req
  after((done) => {
    if (testBillForPOST) {
      BillModel.findByIdAndDelete({ _id: testBillForPOST._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // test bill POST request
  describe('POST bill', () => {
    it('should create a new bill', (done) => {
      const billData = {
        name: 'Test bill',
        amount: 100,
        dueDate: '2023-06-08',
      };

      chai.request(app)
        .post('/api/bill/create')
        .set('Authorization', `Bearer ${token}`) // Set jwt
        .send(billData)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testBillForPOST = res.body; // save bill to be deleted after
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('amount');
          expect(res.body).to.have.property('dueDate');
          expect(res.body).to.have.property('isPaid');
          return done();
        });
    });
  });
  // test bill GET request
  describe('GET all bills', () => {
    it('should return all bills', (done) => {
      chai.request(app)
        .get('/api/bill/all')
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

  // test marking bill as paid
  describe('Update bill status', () => {
    it('should mark bill as paid', (done) => {
      const payBill = {
        isPaid: true,
      };

      chai.request(app)
        .put(`/api/bill/${testBill._id}/pay`)
        .set('Authorization', `Bearer ${token}`) // Set jwt to get authentication
        .send(payBill)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testBill._id);
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('amount');
          expect(res.body).to.have.property('dueDate');
          expect(res.body).to.have.property('isPaid').equal(true);
          return done();
        });
    });
  });

  // test update bill
  describe('PUT bill', () => {
    it('should update the bill', (done) => {
      const updateBill = {
        name: 'Test update bill',
        amount: 200,
        dueDate: '2023-07-09',
      };

      chai.request(app)
        .put(`/api/bill/update/${testBill._id}`)
        .set('Authorization', `Bearer ${token}`) // Set jwt to get authentication
        .send(updateBill)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testBill._id);
          expect(res.body).to.have.property('name').equal('Test update bill');
          expect(res.body).to.have.property('amount').equal(200);
          expect(res.body).to.have.property('dueDate').equal('2023-07-09T00:00:00.000Z');
          expect(res.body).to.have.property('isPaid');
          return done();
        });
    });
  });

  // test delete bill
  describe('DELETE bill', () => {
    it('should delete the bill', (done) => {
      chai.request(app)
        .delete(`/api/bill/${testBill._id}`)
        .set('Authorization', `Bearer ${token}`) // Set jwt to get authentication
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testBill._id);

          // check if the bill is deleted from mongodb
          BillModel.findById(testBill._id)
            .then((bill) => {
              expect(bill).to.be.null;
              done();
            }).catch((error) => done(error));
        });
    });
  });
});
