const db = require('../db.js');

class Address {
  static async create (address) {
    return db.query('INSERT INTO address SET ?', address)
      .then(res => {
        address.id = res.insertId;
        return address;
      });
  }

  static async findById (id) {
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

  static async findByAddressId (id) {
    return db.query(`SELECT * FROM address WHERE id = ${id}`)
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

  static async updateById (id, address) {
    return db.query(
      'UPDATE address SET street = ?, zip_code = ?, city = ?, country = ? WHERE id = ?',
      [address.street, address.zip_code, address.city, address.country, id]
    ).then(() => {
      this.findByAddressId(id);
    });
  }
}

module.exports = Address;
