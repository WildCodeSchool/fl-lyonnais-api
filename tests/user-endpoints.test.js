const request = require('supertest');
const app = require('../server.js');
// const user = require('../models/user.model');
const connection = require('../db.js');

describe('POST /user', () => {
  describe('when a valid payload is sent', () => {
    // let res;
    beforeEach(done => connection.query('TRUNCATE user', done));

    it('returns 201 status les 4 champs sont bien remplis', (done) => {
      request(app)
        .post('/user')
        .send({ email: 'toto@toto.fr', firstname: 'to', lastname: 'to', siret: '0000', password: 'toto-soWhat?' })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { id: expect.any(Number), email: 'toto@toto.fr', firstname: 'to', lastname: 'toto', siret: '0000' };
          expect(response.body).toEqual(expected);
          done();
        })
        .catch(done);
    });

    //   describe('POST /user', () => {
    //     describe('when a valid payload is sent', () => {
    //       let res;
    //       beforeAll(async () => {
    //         res = await request(app).post('/user').send({
    //           firstname: 'John',
    //           lastname: 'Doe',
    //           email: 'john.doe@gmail.com'
    //         });
    //       });

    //       it('returns 201 status', async () => {
    //         expect(res.statusCode).toEqual(201);
    //       });

    //       it('returns the id of the created user', async () => {
    //         expect(res.body.data).toHaveProperty('id');
    //       });
    //     });

    //     describe('when a user with the same email already exists in DB', () => {
    //       let res;
    //       beforeAll(async () => {
    //         Freelance.create({
    //           firstname: 'John',
    //           lastname: 'Doe',
    //           email: 'john.doe@gmail.com'
    //         });
    //         res = await request(app).post('/user').send({
    //           firstname: 'Jane',
    //           lastname: 'Doe',
    //           email: 'john.doe@gmail.com'
    //         });
    //       });

    //       it('returns a 400 status', async () => {
    //         expect(res.status).toBe(400);
    //       });

    //       it('retuns an error message', async () => {
    //         expect(res.body).toHaveProperty('errorMessage');
    //       });
    //     });
  });
});
