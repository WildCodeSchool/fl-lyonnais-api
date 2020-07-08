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

  static async getAll (result) {
    return db.query('SELECT freelance.id, firstname, lastname, url_photo, job_title FROM freelance join user u on freelance.user_id = u.id ORDER BY random_id');
  }

  static async updateById (id, freelance) {
    return db.query(
      'UPDATE freelance SET url_photo = ?, phone_number = ?, average_daily_rate = ?, url_web_site = ?, job_title = ?, bio = ?, vat_number = ?, last_modification_date = ? WHERE id = ?',
      [freelance.url_photo, freelance.phone_number, freelance.average_daily_rate, freelance.url_web_site, freelance.job_title, freelance.bio, freelance.vat_number, freelance.last_modification_date, id]
    ).then(() => this.findById(id));
  }

  // static async addFreelance (newFreelance) {
  //   console.log(newFreelance);
  //   // const { url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, is_active, dataAddress.id, user_id: userId } = newFreelance;
  //   return db.query('INSERT INTO freelance SET ?' , newFreelance)
  //     .then(res => {
  //       newFreelance.id = res.insertId;
  //       return newFreelance;
  //     });
  // }



  // { url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date, user_id }
  // static async updateById (id, { url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date }) {
  //   return db.query(
  //     'UPDATE freelance SET url_photo = ?, phone_number = ?, average_daily_rate = ?, url_web_site = ?, job_title = ?, bio = ?, vat_number = ?, last_modification_date = ?, WHERE id = ?',
  //     [ url_photo, phone_number, average_daily_rate, url_web_site, job_title, bio, vat_number, last_modification_date , id]
  //     ).then(() => this.findById(id));
  //     console.log(id)
  //   }

  
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

  static async getAllByPage (result) {
    const { offset, step } = result;
    return db.query('SELECT * FROM freelance JOIN user AS u ON freelance.user_id = u.id WHERE freelance.is_active = 1 and freelance.is_deleted = 0 ORDER BY random_id LIMIT ? OFFSET ?', [parseInt(step), offset]);
  }

  // Cette méthode est à utiliser pour mélanger tous les freelances
  static async randomizeFreelance (req, res) {
    return db.query('UPDATE freelance SET random_id = LEFT(MD5(RAND()), 8);');
  }

  // Ecriture du numéro de la semaine dans la table settings
  static async writeWeekNumber (weekNumber) {
    return db.query('UPDATE settings SET week = ?', [weekNumber]);
  }

  // Lecture du numéro de la semaine
  static async readWeekNumber () {
    return db.query('SELECT week FROM settings');
  }

  // Récupération du nombre de freelance actifs
  static async totalAmountOfActiveFreelances () {
    return db.query('SELECT COUNT(id) AS totalAmoutOfValidFreelances FROM freelance WHERE is_active = 1;');
  }

  static async delete (deleted, id) {
    return db.query('UPDATE freelance SET is_deleted = ? where id = ?', [parseInt(deleted), parseInt(id)]);
  }
}

module.exports = Freelance;
