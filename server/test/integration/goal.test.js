import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import GoalModel from '../../models/GoalModel.js';

const { expect } = chai;
chai.use(chaiHttp);
// Goal API tests
describe('Goal API Tests', () => {
  let token;
  let testGoal;
  let testGoalPOST;

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
  // Create a Goal before each test
  beforeEach((done) => {
    const GoalData = {
      name: 'Test goal',
      description: 'This is a test goal',
      currentAmount: 0,
      targetAmount: 500,
      targetDate: '2023-07-30',
      completed: false,
    };

    chai.request(app)
      .post('/api/Goal/create')
      .set('Authorization', `Bearer ${token}`) // Set jwt
      .send(GoalData)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        testGoal = res.body;
        return done();
      });
  });
  // delete the created Goal before each test from mongodb
  afterEach((done) => {
    if (testGoal) {
      // Delete the created Goal after each test
      GoalModel.findByIdAndDelete({ _id: testGoal._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // Delete the created Goal from post req
  after((done) => {
    if (testGoalPOST) {
      GoalModel.findByIdAndDelete({ _id: testGoalPOST._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  // test Goal POST request
  describe('POST Goal', () => {
    it('should create a new Goal', (done) => {
      const goal = {
        name: 'Test goal',
        description: 'This is a test goal',
        currentAmount: 0,
        targetAmount: 500,
        targetDate: '2023-07-30',
        completed: false,
      };

      chai.request(app)
        .post('/api/Goal/create')
        .set('Authorization', `Bearer ${token}`) // Set jwt
        .send(goal)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testGoalPOST = res.body; // delete after all tests finished
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id');
          expect(res.body.name).to.equal(goal.name);
          expect(res.body.description).to.equal(goal.description);
          expect(res.body.currentAmount).to.equal(goal.currentAmount);
          expect(res.body.targetAmount).to.equal(goal.targetAmount);
          expect(res.body.targetDate).to.equal('2023-07-30T00:00:00.000Z');
          expect(res.body).to.have.property('completed');

          return done();
        });
    });
  });

  // test Goal GET request
  describe('GET all Goals', () => {
    it('should return all Goals', (done) => {
      chai.request(app)
        .get('/api/Goal/all')
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
  describe('PUT Goal', () => {
    it('should update the Goal', (done) => {
      const updatedGoal = {
        name: 'Test update goal',
        description: 'This is a test goal for update',
        currentAmount: 100,
        targetAmount: 900,
        targetDate: '2023-09-30',
        completed: false,
      };

      chai.request(app)
        .put(`/api/Goal/update/${testGoal._id}`)
        .set('Authorization', `Bearer ${token}`) // set jwt
        .send(updatedGoal)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testGoal._id);
          expect(res.body.name).to.equal(updatedGoal.name);
          expect(res.body.description).to.equal(updatedGoal.description);
          expect(res.body.currentAmount).to.equal(updatedGoal.currentAmount);
          expect(res.body.targetAmount).to.equal(updatedGoal.targetAmount);
          expect(res.body.targetDate).to.equal('2023-09-30T00:00:00.000Z');
          expect(res.body.completed).to.equal(updatedGoal.completed);
          return done();
        });
    });
  });

  // test delete api
  describe('DELETE Goal', () => {
    it('should delete the Goal', (done) => {
      chai.request(app)
        .delete(`/api/Goal/${testGoal._id}`)
        .set('Authorization', `Bearer ${token}`) // set jwt
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('_id').equal(testGoal._id);

          // check if the Goal is deleted from mongodb
          GoalModel.findById(testGoal._id)
            .then((Goal) => {
              expect(Goal).to.be.null;
              return done();
            })
            .catch((error) => done(error));
        });
    });
  });
});
