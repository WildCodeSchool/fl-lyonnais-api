const Freelancer = require('../models/freelancer.model.js');

class FreelancersController {
  static async create (req, res) {
    if (!req.body) {
      return res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.email) {
      return res.status(400).send({ errorMessage: 'Email can not be empty!' });
    }

    try {
      const freelancer = new Freelancer(req.body);
      if (await Freelancer.emailAlreadyExists(freelancer.email)) {
        res.status(400).send({ errorMessage: 'A customer with this email already exists !' });
      } else {
        const data = await Freelancer.create(freelancer);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the Freelancer.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Freelancer.getAll()).map(c => new Freelancer(c)).map(c => ({
        id: c.id,
        name: c.fullName,
        email: c.email,
        active: !!c.active
      }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving freelancers.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Freelancer.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelancer with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error retrieving Freelancer with id ' + req.params.id });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Freelancer.updateById(req.params.id, new Freelancer(req.body));
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelancer with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating Freelancer with id ' + req.params.id });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Freelancer.remove(req.params.id);
      res.send({ message: 'Freelancer was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Freelancer with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: 'Could not delete Freelancer with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = FreelancersController;
