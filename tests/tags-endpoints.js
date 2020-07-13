const request = require('supertest');
const app = require('../server.js');
const Tag = require('../models/tag.model');

describe('tags', () => {
  // Requête de la liste globale des tags
  // Retourne le code 200 et un objet JSON contenant la liste des tags
  describe('GET /tags', () => {
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
  });

  describe('GET /tags/:id', () => {
    // Requête pour récupérer un tag en particulier
    // Retourne le code 200 et le contenu du tag en question
    it('returns 200 status with one tag', async () => {
      const tag = await Tag.create({ name: 'JavaScript', content: 'JS', slug: 'javascript' });
      return request(app)
        .get('/tags/' + tag.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.data.id).toEqual(tag.id);
          expect(response.body.data.name).toEqual(tag.name);
          expect(response.body.data.content).toEqual(tag.content);
          expect(response.body.data.slug).toEqual(tag.slug);
        });
    });

    // ou le code 404 si l'id n'est pas attribué
    it("returns 404 status when id doesn't exist", async () => {
      return request(app)
        .get('/tags/1')
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({ errorMessage: 'Tag with id 1 not found.' });
        });
    });
  });
});
