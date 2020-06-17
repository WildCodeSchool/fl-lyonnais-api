const request = require('supertest');
const app = require('../server.js');
const Customer = require('../models/customer.model.js');


// Test sur /registration
// 1) Cas où tout se passe bien, les 4 champs de la table user sont remplis et la case “conditions générales” cochées : status Code 201.
// 1) Cas d’une requête avec un champ obligatoire manquant : exemple le SIRET,  status Code 422.
// 3) Cas avec un attribut du mauvais type : erreur dans l’adresse email,  status Code 422.
// 4)  Cas de deux ressources ajoutées avec le même email ou siret ou combinaison Prénom/Nom : status Code 409.

// Test Cas où tout se passe bien, les 4 champs de la table user sont remplis et la case 
  describe('POST /registration', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeEach(done => connection.query('TRUNCATE user', done));
      });

      it('returns 201 status les 4 champs sont bien remplis', (done) => {
        request(app)
          .post('/registration')
          .send({ email: 'toto@toto.fr', firstname: 'to', lastname: 'toto', siret: 0000, password:'toto'})
          .expect(201)
          .expect('Content-Type', /json/)
          .then(response => {
            const expected = { id: expect.any(Number), email: 'toto@toto.fr', firstname: 'to', lastname: 'toto', siret: 0000 };
            expect(response.body).toEqual(expected);
            done();
          })
          .catch(done);

      it('returns the id of the created customer', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a customer with the same email already exists in DB', () => {
      let res;
      beforeAll(async () => {
        Customer.create({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@gmail.com'
        });
        res = await request(app).post('/customers').send({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'john.doe@gmail.com'
        });
      });

      it('returns a 400 status', async () => {
        expect(res.status).toBe(400);
      });

      it('retuns an error message', async () => {
        expect(res.body).toHaveProperty('errorMessage');
      });
    });
  });

