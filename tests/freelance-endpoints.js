const request = require('supertest');
const app = require('../server.js');
const Freelance = require('../models/freelance.model');
const User = require('../models/user.model.js');
const { test } = require('jest-circus');

describe('POST /freelances/account', () => {
  it('returns 201 status', async () => {
    await User.create({
      firstname: 'Adèle',
      lastname: 'BLANC-SEC',
      email: 'ab@test.fr',
      password: '123456789',
      siret: '01234567891234',
      last_connection_date: '2020-07-06',
      registration_date: '2020-07-01',
      key: 'KEY',
      is_admin: 0,
      is_validated: 1
    });
    await Freelance.create({
      url_photo: '/photos/0000.adele_blanc-sec.jpg',
      phone_number: '06 06 06 06 06',
      average_daily_rate: 500,
      url_web_site: 'http://wwww.freelance.fr',
      job_title: 'Développeur Web',
      bio: 'Blablabla',
      vat_number: 'FR12345678',
      last_modification_date: '2020-11-11',
      is_active: 1
    });
    request(app)
      .post('/freelances/account')
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        console.log(response.body);
        expect(response.body.id).toEqual(1);
      });
  });
});

/*  it('returns 201 status', async () => {
      const freelance = await Freelance.create({ phone_number: '06 06 06 06 06', url_web_site: 'http://wwww.freelance.fr', last_modification_date: '2020-11-11', is_active:1 })
      request(app)
        .post('/freelances/account')
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.data[phone_number]).toEqual('06 06 06 06 06');
          expect(response.body.data.is_active).toEqual(1);
          expect(response.body.data.url_web_site).toEqual('http://wwww.freelance.fr');
          expect(response.body.data.last_modification_date).toEqual('2020-11-11');
        });
    });  */
/* it('returns 201 status les 4 champs sont bien remplis', async () => {
      return request(app)
      .post('/freelances/account')
      .send({ street:'38 rue du stade', city: 'Bron', zip_code:"69500", phone_number: '06 06 06 06 06', url_web_site: 'http://wwww.freelance.fr', last_modification_date: '2020-11-11', is_active:1 })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { id: expect.any(Number), phone_number: '06 06 06 06 06', url_web_site: 'http://wwww.freelance.fr', last_modification_date: '2020-11-11', is_active:1 }
        expect(response.body).toEqual(expected);
      });
    });
  }) */
