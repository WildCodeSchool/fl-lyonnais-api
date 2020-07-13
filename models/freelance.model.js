const db = require('../db.js');

class Freelance {
  static async create (newFreelance) {
    return db.query('INSERT INTO freelance SET ?', newFreelance)
      .then(res => {
        newFreelance.id = res.insertId;
        return newFreelance;
      });
  }

  static async findByUserId (id) {
    return db.query('SELECT * FROM freelance WHERE user_id = ?', [id])
      .then(rows => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        }
        return Promise.resolve(null);
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
      [freelance.url_photo,freelance.phone_number, freelance.average_daily_rate, freelance.url_web_site, freelance.job_title, freelance.bio, freelance.vat_number, freelance.last_modification_date, id]
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

  static async getAddress (id) {
    return db.query(`SELECT street,zip_code,city FROM freelance join user u on freelance.user_id = u.id join address a on freelance.address_id = a.id WHERE freelance.id = ${id}`)
      .then(rows => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return Promise.resolve({});
        }
      });
  }

  static async getAllByPage (result) {
    const { offset, step } = result;
    return db.query('SELECT f.id as id, firstname, lastname, url_photo, job_title FROM freelance AS f JOIN user AS u ON f.user_id = u.id WHERE f.is_active = 1 and u.is_deleted = 0 ORDER BY random_id LIMIT ? OFFSET ?', [parseInt(step), offset]);
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
    return db.query('SELECT COUNT(f.id) AS totalAmoutOfValidFreelances FROM freelance AS f JOIN user AS u ON f.user_id = u.id WHERE f.is_active = 1 and u.is_deleted = 0;');
  }

  static async delete (deleted, id) {
    return db.query('UPDATE user join freelance f on user.id = f.user_id SET is_deleted = ? where f.id = ?', [parseInt(deleted), parseInt(id)]);
  }

  static async activate (activated, id) {
    return db.query('UPDATE freelance SET is_active = ? where id = ?', [parseInt(activated), parseInt(id)]);

  }
}

module.exports = Freelance;
