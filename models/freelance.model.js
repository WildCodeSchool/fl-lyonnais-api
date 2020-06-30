const db = require('../db.js');

class Freelance {
  static async create (newFreelance) {
    return db.query('INSERT INTO freelance SET ?', newFreelance)
      .then(res => {
        newFreelance.id = res.insertId;
        return newFreelance;
      });
  }

  static async findById (id) {
    return db.query(`SELECT * FROM freelance WHERE id = ${id}`)
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

  static async emailAlreadyExists (email) {
    return db.query('SELECT * FROM freelance WHERE url_photo = ?', [email])
      .then(rows => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM freelance');
  }

  static async updateById (id, freelance) {
    return db.query(
      'UPDATE freelance SET url_photo = ?, phone_number = ?, average_daily_rate = ?, url_web_site = ?, job_title = ?, bio = ?, vat_number = ? WHERE id = ?',
      [freelance.url_photo, freelance.phone_number, freelance.average_daily_rate, freelance.url_web_site, freelance.job_title, freelance.bio, id]
    ).then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM freelance WHERE id = ?', id).then(res => {
      if (res.affectedRows !== 0) {
        return Promise.resolve();
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async removeAll (result) {
    return db.query('DELETE FROM freelance WHERE id = ?');
  }
}

module.exports = Freelance;
