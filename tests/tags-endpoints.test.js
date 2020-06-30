const request = require('supertest');
const app = require('../server.js');
const Tag = require('../models/tag.model');
// const connection = require('../db.js')

describe('GET /tags', () => {
  // Requête de la liste globale des tags
  // Retourne le code 200 et un objet JSON contenant la liste des tags
  it('returns 200 status', async () => {
    await Promise.all([
      Tag.create({ name: 'JavaScript', content: 'JS', slug: 'javascript' }),
      Tag.create({ name: 'PHP', content: 'PHP', slug: 'php' })
    ]);
    return request(app)
      .get('/tags')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.data.length).toEqual(2);
      });
  });

  // Requête pour récupérer un tag en particulier
  // Retourne le code 200 et le contenu du tag en question
  it('returns 200 status with one tag', async () => {
    await Promise.all([
      Tag.create({ name: 'JavaScript', content: 'JS', slug: 'javascript' }),
      Tag.create({ name: 'PHP', content: 'PHP', slug: 'php' })
    ]);
    return request(app)
      .get('/tags/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.data.id).toEqual(1);
      });
  });

  // ou le code 404 si l'id n'est pas attribué
  it("returns 404 status when id doesn't exist", async () => {
    return request(app)
      .get('/tags/1')
      .expect(404)
      .expect('Content-Type', /json/)
      .then(response => {
        console.log(response.body);
        expect(response.body).toEqual({ errorMessage: 'Tag with id 1 not found.' });
      });
  });
});
