import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import BudgetModel from '../../models/BudgetModel.js';

const { expect } = chai;
chai.use(chaiHttp);
// budget API tests
describe('Budget API Tests', () => {
  let token;
  let testBudget;
  let testBudgetPOST;

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
  // Create a budget before each test
  beforeEach((done) => {
    const budgetData = {
      name: 'Test budget',
      amount: 100,
      limit: 500,
      period: 'monthly',
      startDate: '2023-06-08',
      endDate: '2023-07-08',
    };

    chai.request(app)
      .post('/api/budget/create')
      .set('Authorization', `Bearer ${token}`) // Set jwt
      .send(budgetData)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        testBudget = res.body;
        return done();
      });
  });
  // delete the created budget before each test from mongodb
  afterEach((done) => {
    if (testBudget) {
      // Delete the created budget after each test
      BudgetModel.findByIdAndDelete({ _id: testBudget._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // Delete the created budget from post req
  after((done) => {
    if (testBudgetPOST) {
      BudgetModel.findByIdAndDelete({ _id: testBudgetPOST._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // test budget POST request
  describe('POST budget', () => {
    it('should create a new budget', (done) => {
      const budget = {
        name: 'Test budget',
        amount: 100,
        limit: 500,
        period: 'monthly',
        startDate: '2023-06-08',
        endDate: '2023-07-08',
      };

      chai.request(app)
        .post('/api/budget/create')
        .set('Authorization', `Bearer ${token}`) // Set jwt
        .send(budget)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testBudgetPOST = res.body; // delete after all tests finished
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('amount');
          expect(res.body.name).to.equal(budget.name);
          expect(res.body.amount).to.equal(budget.amount);
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('period');
          expect(res.body).to.have.property('startDate');
          expect(res.body).to.have.property('endDate');

          return done();
        });
    });
  });

  // test budget GET request
  describe('GET all budgets', () => {
    it('should return all budgets', (done) => {
      chai.request(app)
        .get('/api/budget/all')
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

  describe('PUT budget', () => {
    it('should update the budget', (done) => {
      const updatedBudget = {
        name: 'Test update budget',
        amount: 300,
        period: 'weekly',
        startDate: '2023-07-08',
        endDate: '2023-09-12',
      };

      chai.request(app)
        .put(`/api/budget/update/${testBudget._id}`)
        .set('Authorization', `Bearer ${token}`) // set jwt
        .send(updatedBudget)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testBudget._id);
          expect(res.body.name).to.equal(updatedBudget.name);
          expect(res.body.amount).to.equal(updatedBudget.amount);
          expect(res.body.period).to.equal(updatedBudget.period);
          expect(res.body.startDate).to.equal('2023-07-08T00:00:00.000Z');
          expect(res.body.endDate).to.equal('2023-09-12T00:00:00.000Z');
          return done();
        });
    });
  });

  describe('DELETE budget', () => {
    it('should delete the budget', (done) => {
      chai.request(app)
        .delete(`/api/budget/${testBudget._id}`)
        .set('Authorization', `Bearer ${token}`) // set jwt
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testBudget._id);

          // check if the budget is deleted from mongodb
          BudgetModel.findById(testBudget._id)
            .then((budget) => {
              expect(budget).to.be.null;
              return done();
            })
            .catch((error) => done(error));
        });
    });
  });
});
