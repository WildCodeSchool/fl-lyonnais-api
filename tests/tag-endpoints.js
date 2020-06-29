const request = require('supertest');
const app = require('../server.js');
const connection = require('../db.js')

describe('GET /tag', () => {
  describe('Récupération de la liste des tags', () => {
    let res;
    const query = "INSERT INTO `tag` (`name`, `content`, `slug`) VALUES ('Javascript', 'JavaScript', 'js');";
    beforeEach(done => connection.query(query);

    // Requête de la liste globale des tags
    it('returns 200 status', async () => {

    });
  });
});
