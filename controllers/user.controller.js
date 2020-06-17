const User = require('../models/user.model.js');

class UsersController {
  static async create (req, res) {
    console.log(req.body);
    if (!req.params) {
      return res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.email) {
      return res.status(400).send({ errorMessage: 'Emaillllllllllllll can not be empty!' });
    }

    try {
      const user = new User(req.body);
      if (await User.emailAlreadyExists(user.email)) {
        res.status(400).send({ errorMessage: 'A user with this email already exists !' });
      } else {
        const data = await User.create(user);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the User.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await User.getAll()).map(c => new User(c)).map(c => ({
        id: c.id,
        name: c.fullName
        // email: c.email,
        // active: !!c.active
      }));
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
      const data = await User.updateById(req.params.id, new User(req.body));
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
}

module.exports = UsersController;
