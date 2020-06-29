const request = require('supertest');
const app = require('../server.js');
// const connection = require('../db.js')

describe('GET /tag', () => {
  /* describe('Récupération de la liste des tags', () => {
    let res;
    const query = "INSERT INTO `tag` (`name`, `content`, `slug`) VALUES ('Javascript', 'JavaScript', 'js');";
    beforeEach(done => connection.query(query); */

  // Requête de la liste globale des tags
  // Retourne le code 200 et un objet JSON contenant la liste des tags
  it('returns 200 status', async () => {
    return request(app)
      .get('/tag')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { data: [] };
        expect(response.body).toEqual(expected);
      });
  });

  // Requête pour récupérer un tag en particulier
  // Retourne le code 200 et le contenu du tag en question
  // ou le code 404 si l'id n'est pas attribué
  it('returns 200 status if the id exists', async () => {
    return request(app)
      .get('/tag/2')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { data: [] };
        expect(response.body).toEqual(expected);
      });
  });

  it("returns 404 status if the id doesn't exists", async () => {
    return request(app)
      .get('/tag/999999')
      .expect(404)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { errorMessage: 'Tag with id 999999 not found.' };
        expect(response.body).toEqual(expected);
      });
  });
});
