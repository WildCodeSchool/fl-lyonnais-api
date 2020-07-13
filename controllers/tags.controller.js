const Tag = require('../models/tag.model.js');

class TagController {
  static async findAll (req, res) {
    try {
      const data = (await Tag.getAll()).map(c => c);
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving tags.'
      });
    }
  }

  static async findUsedTags (req, res) {
    try {
      const data = (await Tag.getUsedTags()).map(c => c);
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving tags.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Tag.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Tag with id ${req.params.id} not found.` });
      } else {
        res.status(500).send({ errorMessage: 'Error retrieving Tag with id ' + req.params.id });
      }
    }
  }
}

module.exports = TagController;
