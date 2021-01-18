require('dotenv').config({ path: './.env.local'});
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');

describe('API tests',() => {
  const dataBaseName = 'test_songrater';
  let user = null;

  // Triggers before any test
  beforeAll(async () => {
    // Create a new test database
    await mongoose.connect('mongodb://localhost:27017/' + dataBaseName, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  it('Create DB', () => {
    // Testing the creation of the database
    expect(mongoose.connection.name).toBe(dataBaseName)
  })

  describe('POST endpoints', () => {

    // Testing the root and make sure we can't make POST request on it
    it('POST /', done => {
      request.post('/')
        .expect(404)
        .end(done)
    })

    // Authenticating user
    /* 
      Input : an object 
      Expected result : Status code 201 + an object containing the user data and a token
    */
    it('POST /auth/signup', done => {
      request.post('/auth/signup')
        .send({ username: 'JestTest', email: 'JestTest@mail.com', password: 'JestTest1'})
        .then(res => {
          expect(res.status).toBe(201)
          user = JSON.parse(res.text)
          expect(typeof user).toBe('object')
          expect(user).toHaveProperty('token')
          done()
        })
    })

    // Posting a review
    /* 
      Input : an object
      Expected result : status code 201 + a review object
    */
    it('POST /reviews', done => {
      // We create a proper body to post a review
      const body = { 
        title: 'Test jest',
        content: 'Review test with jest',
        rating: 10,
        media: {
          id: 1,
          link: 'link',
          media_type: 'artist',
          name: 'test',
        }
      };

      // A request without auth should return a 401 status code (Unauthorized)
      request.post('/reviews')
        .send(body)
        .expect(401)

      // A request with auth and no body should return a 404 status code (Bad Request)
      request.post('/reviews')
        .set('Authorization', 'Bearer ' + user.token)
        .expect(404)

      // A request with auth should return a 201 status code (Created)
      request.post('/reviews')
        .set('Authorization', 'Bearer ' + user.token)
        .send(body)
        .then(res => {
          expect(res.status).toBe(201)
          expect(res.body).toHaveProperty('_id')
          done()
        })
      })

  })

  describe('GET endpoints', () => {
  
    // Testing the route to get all reviews
    it('GET /reviews', done => {
      request.get('/reviews')
        .then(res => {
          // We check if the request went well (status code = 200)
          expect(res.status).toBe(200);
          // We check if the API return the right data
          expect(res.body).toHaveProperty('next');
          expect(res.body).toHaveProperty('reviews');
          // We make sure the review has been correctly posted
          expect(res.body.reviews).toHaveLength(1)
          done();
        })
    })
  })

  // Triggers only when every test suites are done
  afterAll(async () => {
    // delete and close the database after all the tests are done
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close();

    // disconnect the app from MongoDB
    await mongoose.disconnect()
  });
});