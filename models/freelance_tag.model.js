const db = require('../db.js');

class FreelanceTag {
  static async create (tag_id) {
    return db.query('INSERT INTO freelance_tag SET ?', tag_id)
      .then(res => {
        tag_id.id = res.insertId;
        return tag_id;
      });
  }

  static async findById (id) {
    return db.query(`SELECT * FROM freelance_tag WHERE freeid = ${id}`)
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

  // static async emailAlreadyExists (email) {
  //   return db.query('SELECT * FROM freelance WHERE url_photo = ?', [email])
  //     .then(rows => {
  //       if (rows.length) {
  //         return Promise.resolve(true);
  //       } else {
  //         return Promise.resolve(false);
  //       }
  //     });
  // }

  // static async getAll (result) {
  //   return db.query('SELECT freelance.id, firstname, lastname, url_photo, job_title FROM freelance join user u on freelance.user_id = u.id');
  // }

  static async updateById (flId, tagId) {
    return db.query(
      'UPDATE freelance_tag SET tag_id = ? WHERE freelance_id = ?',
      [tagId, flId]
    ).then(() => this.findById(flId));
  }

  // static async remove (flid) {
  //   return db.query(`DELETE FROM freelance_tag WHERE freelance_id = ${flid}?`).then(res => {
  //     if (res.affectedRows !== 0) {
  //       return Promise.resolve();
  //     } else {
  //       const err = new Error();
  //       err.kind = 'not_found';
  //       return Promise.reject(err);
  //     }
  //   });
  // }

  // static async removeAllTags (flId) {
  //   console.log(flId)
  //   return db.query(`DELETE FROM freelance_tag WHERE freelance_id = ${flId}?`).then(res => {
  //     if (res.affectedRows !== 0) {
  //       return Promise.resolve();
  //     } else {
  //       console.log('yoooooo')
  //       const err = new Error();
  //       err.kind = 'not_found';
  //       return Promise.reject(err);
  //     }
  //   });
  // }

  static async removeAllTags (flId) {
    console.log(flId);
    return db.query('DELETE FROM freelance_tag WHERE freelance_id= ?', [flId]);
  }
}

module.exports = FreelanceTag;
