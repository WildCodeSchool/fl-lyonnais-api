const User = require('../models/user.model.js');

const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

class UsersController {
  static async create (req, res) {
    const user = req.body;
    if (!user.email || !user.firstname || !user.lastname || !user.siret) {
      return res.status(422).send({ errorMessage: 'Content can not be empty!' });
    }
    if (!validateEmail(user.email)) {
      return res.status(422).send({ errorMessage: 'A valid email is required !' });
    }
    try {
      const userAlreadyExists = await User.emailAlreadyExists(user.email);
      if (userAlreadyExists) {
        res.status(400).send({ errorMessage: 'A user with this email already exists !' });
      } else {
        const data = await User.create(user);
        console.log(data);
        res.status(201).send(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the User.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await User.getAll()).map(c => c);
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving users.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await User.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `User with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error retrieving User with id ' + req.params.id });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await User.updateById(req.params.id, (req.body));
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `User with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating User with id ' + req.params.id });
      }
    }
  }

  static async delete (req, res) {
    try {
      await User.remove(req.params.id);
      res.send({ message: 'User was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: 'Could not delete User with id ' + req.params.id
        });
      }
    }
  }

  static async sendEmail (req, res) {
    try {
      const emailBody = {
        from: '"Toto Letigre" <toto.letigre@test.fr',
        to: 'asterix@test.fr',
        subject: 'Email de test',
        Text: 'Ceci est un test de NodeMailer',
        html: '<p>Ceci est un test de NodeMailer</p>'
      };
      await req.transporter.sendMail(emailBody);
      console.log('Email envoyé');
    } catch (error) {
      console.log('Erreur', error);
    }
  }
}

module.exports = UsersController;
