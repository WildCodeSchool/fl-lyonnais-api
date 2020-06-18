// const request = require('supertest');
// const app = require('../server.js');

// Sign in




// describe('POST /freelance', () => {
//   describe('when a valid payload is sent', () => {
//     let res;
//     beforeEach(done => connection.query('TRUNCATE user', done));
//   });

//   describe('POST /freelance', () => {
//     describe('when a valid payload is sent', () => {
//       let res;
//       beforeAll(async () => {
//         res = await request(app).post('/freelance').send({
//           first_name: 'John',
//           last_name: 'Doe',
//           email: 'john.doe@gmail.com'
//         });
//       });

//       it('returns 201 status', async () => {
//         expect(res.statusCode).toEqual(201);
//       });

//       it('returns the id of the created freelance', async () => {
//         expect(res.body.data).toHaveProperty('id');
//       });
//     });

//     describe('when a freelance with the same email already exists in DB', () => {
//       let res;
//       beforeAll(async () => {
//         Freelance.create({
//           first_name: 'John',
//           last_name: 'Doe',
//           email: 'john.doe@gmail.com'
//         });
//         res = await request(app).post('/freelance').send({
//           first_name: 'Jane',
//           last_name: 'Doe',
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
//   });
// });

// --------------------------------------------------------------------------------------------------------
// const request = require('supertest');
// const app = require('../server.js');
// const Freelance = require('../models/freelance.model');

// // Test sur /freelance
// // 1) Cas où tout se passe bien, les 4 champs de la table user sont remplis et la case “conditions générales” cochées : status Code 201.
// // 2) Cas d’une requête avec un champ obligatoire manquant : exemple le SIRET,  status Code 422.
// // 3) Cas avec un attribut du mauvais type : erreur dans l’adresse email,  status Code 422.
// // 4)  Cas de deux ressources ajoutées avec le même email ou siret ou combinaison Prénom/Nom : status Code 409.

// describe('POST /freelance', () => {
//   describe('when a valid payload is sent', () => {
//     let res;
//     beforeEach(done => connection.query('TRUNCATE user', done));

// // 1) Test Cas où tout se passe bien, les 4 champs de la table user sont remplis et la case
//   it('returns 201 status les 4 champs sont bien remplis', (done) => {
//       request(app)
//         .post('/freelance')
//         .send({ email: 'toto@toto.fr', firstname: 'to', lastname: 'to', siret: 0000, password:'toto-soWhat?'})
//         .expect(201)
//         .expect('Content-Type', /json/)
//         .then(response => {
//           const expected = { id: expect.any(Number), email: 'toto@toto.fr', firstname: 'to', lastname: 'toto', siret: 0000 };
//           expect(response.body).toEqual(expected);
//           done();
//         })
//         .catch(done);
//   });

// // 2) Cas d’une requête avec un champ obligatoire manquant : exemple le SIRET,  status Code 422.

// it('returns 422 statussi un champs obligatoire est manquant', (done) => {
//   request(app)
//     .post('/freelance')
//     .send({ email: 'toto@toto.fr', firstname: '', lastname: 'to', siret: 0000, password:'toto-soWhat?'})
//     .expect(422)
//     .expect('Content-Type', /json/)
//     .then(response => {
//       const expected = { id: expect.any(Number), email: 'toto@toto.fr', firstname: 'to', lastname: 'toto-soWhat?', siret: 0000 };
//       expect(response.body).toEqual(expected);
//       done();
//     })
//     .catch(done);
// });

// // 3) Cas avec un attribut du mauvais type : erreur dans l’adresse email,  status Code 422.

// it('returns 422 email non conforme', (done) => {
//   request(app)
//     .post('/freelance')
//     .send({ email: 'toto@totofr', firstname: 'to', lastname: 'to', siret: 0000, password:'toto-soWhat?'})
//     .expect(422)
//     .expect('Content-Type', /json/)
//     .then(response => {
//       const expected = { id: expect.any(Number), email: 'toto@toto.fr', firstname: 'to', lastname: 'toto', siret: 0000 };
//       expect(response.body).toEqual(expected);
//       done();
//     })
//     .catch(done);
// });

//   describe('POST /freelance', () => {
//     describe('when a valid payload is sent', () => {
//       let res;
//       beforeAll(async () => {
//         res = await request(app).post('/freelance').send({
//           first_name: 'John',
//           last_name: 'Doe',
//           email: 'john.doe@gmail.com'
//         });
//       });

//       it('returns 201 status', async () => {
//         expect(res.statusCode).toEqual(201);
//       });

//       it('returns the id of the created freelance', async () => {
//         expect(res.body.data).toHaveProperty('id');
//       });
//     });

//     describe('when a freelance with the same email already exists in DB', () => {
//       let res;
//       beforeAll(async () => {
//         Freelance.create({
//           first_name: 'John',
//           last_name: 'Doe',
//           email: 'john.doe@gmail.com'
//         });
//         res = await request(app).post('/freelance').send({
//           first_name: 'Jane',
//           last_name: 'Doe',
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
//   });
