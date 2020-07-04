const request = require('supertest');
const app = require('../server.js');

describe('POST /users', () => {
  describe('when a valid payload is sent', () => {
    it('returns 201 status les 4 champs sont bien remplis', async () => {
      return request(app)
        .post('/users')
        .send({ email: 'toto@toto.fr', firstname: 'to', lastname: 'to', siret: '0000', password: 'toto-soWhat?' })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = {
            id: expect.any(Number),
            email: 'toto@toto.fr',
            firstname: 'to',
            lastname: 'to',
            siret: '0000',
            is_validated: expect.any(Number),
            key: expect.any(String),
            registration_date: expect.any(String)
          };
          expect(response.body).toEqual(expected);
        });
    });

    // 2) Cas d’une requête avec un champ obligatoire manquant : exemple le SIRET,  status Code 422.

    it('returns 422 status si un champs obligatoire est manquant', async () => {
      return request(app)
        .post('/users')
        .send({ email: 'toto@toto.fr', firstname: 'to', lastname: 'to', password: 'toto-soWhat?', siret: '' })
        .expect(422)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { errorMessage: 'Content can not be empty!' };
          expect(response.body).toEqual(expected);
        });
    });
    // 3) Cas avec un attribut du mauvais type : erreur dans l’adresse email,  status Code 422.
    it('returns 422 statussi un champs obligatoire est manquant', async () => {
      return request(app)
        .post('/users')
        .send({ email: 'toto@totofr', firstname: 'to', lastname: 'to', password: 'toto-soWhat?', siret: '0000' })
        .expect(422)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { errorMessage: 'A valid email is required !' };
          expect(response.body).toEqual(expected);
        });
    });

    // 4)  Cas de deux ressources ajoutées avec le même email ou siret ou combinaison Prénom/Nom : status Code 409.
    it('returns 422 statussi un champs obligatoire est manquant', async () => {
      return request(app)
        .post('/users')
        .send({ email: 'toto@totofr', firstname: 'to', lastname: 'to', password: 'toto-soWhat?', siret: '0000' })
        .expect(422)
        .expect('Content-Type', /json/)
        .then(response => {
          const expected = { errorMessage: 'A valid email is required !' };
          expect(response.body).toEqual(expected);
        });
    });
  });
});
