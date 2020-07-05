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
    return db.query('SELECT * FROM freelance join user u on freelance.user_id = u.id left join address a on freelance.address_id = a.id WHERE freelance.id = ?', [id])
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

  static async getAllTags (freelance_id) {  /* eslint-disable-line */
    return db.query('SELECT id, name  FROM tag join freelance_tag ft on tag.id = ft.tag_id where ft.freelance_id = ?', [freelance_id]);   /* eslint-disable-line */
  }
  static async getAllReferences (freelance_id) {  /* eslint-disable-line */
    return db.query('SELECT id, name, image, url  FROM reference join freelance_reference fr on reference.id = fr.reference_id where freelance_id = ?', [freelance_id] );   /* eslint-disable-line */
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
    return db.query('SELECT freelance.id, firstname, lastname, url_photo, job_title FROM freelance join user u on freelance.user_id = u.id');
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
