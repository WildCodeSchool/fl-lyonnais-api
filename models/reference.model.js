const db = require('../db.js');

class Reference {
  static async create (reference) {
    return db.query('INSERT INTO reference SET ?', reference)
      .then(res => {
        reference.id = res.insertId;
        return reference;
      });
  }
}

module.exports = Reference;
