const db = require('../db.js');

class ReferenceImage {
  // static async create (reference) {
  //   return db.query('INSERT INTO reference SET ?', reference)
  //     .then(res => {
  //       reference.id = res.insertId;
  //       return reference;
  //     });
  // }

  static async findById(id) {
    return db.query('SELECT * FROM freelance  WHERE id = ?', [id])
      .then(rows => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }

  static async updateById(id, { url_photo }) {
    return db.query(
      'UPDATE freelance SET url_photo = ? WHERE id = ?',
      [url_photo, id]
    ).then(() => this.findById(id));
  }
}

module.exports = ReferenceImage;
