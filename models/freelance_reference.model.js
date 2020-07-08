const db = require('../db.js');

class FreelanceReference {
  static async create (reference_id) {
    return db.query('INSERT INTO freelance_reference SET ?', reference_id)
      .then(res => {
        reference_id = res.insertId;
        return reference_id;
      });
  }

  static async findById (freelance_id) {
    return db.query(`SELECT * FROM freelance join user u on freelance.user_id = u.id join address a on freelance.address_id = a.id WHERE freelance.id = ${id}`)
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

  static async updateById (freelance_id, reference_id) {
    return db.query(
      'UPDATE freelance_reference SET reference_id = ? WHERE freelance_id = ?',
      [reference_id, freelance_id]
    ).then(() => this.findById(freelance_id));
  }

  // static async remove (id) {
  //   return db.query('DELETE FROM freelance WHERE id = ?', id).then(res => {
  //     if (res.affectedRows !== 0) {
  //       return Promise.resolve();
  //     } else {
  //       const err = new Error();
  //       err.kind = 'not_found';
  //       return Promise.reject(err);
  //     }
  //   });
  // }
  static async removeAllRefetences (flId) {
    return db.query('DELETE FROM freelance_reference WHERE freelance_id= ?', [flId]);
  }

}

module.exports = FreelanceReference;
