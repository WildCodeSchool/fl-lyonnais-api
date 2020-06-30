const Freelance = require('../models/freelance.model.js');

class FreelancesController {
  static async create (req, res) {
    try {
      const freelance = req.body;
      const data = await Freelance.create(freelance);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the Freelance.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Freelance.getAll()).map(c => c);
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving freelances.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Freelance.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error retrieving Freelance with id ' + req.params.id });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Freelance.updateById(req.params.id, new Freelance(req.body));
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Freelance with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error updating Freelance with id ' + req.params.id });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Freelance.remove(req.params.id);
      res.send({ message: 'Freelance was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Freelance with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: 'Could not delete Freelance with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = FreelancesController;
