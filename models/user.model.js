const db = require('../db.js');
const argon2 = require('argon2');
// const jwt = require('jsonwebtoken');

class User {
  get fullName () {
    return `${this.firstname} ${this.lastname}`;
  }

  static async create (newUser) {
    const hash = await argon2.hash(newUser.password);
    console.log(hash);
    const addUser = { ...newUser, password: hash };
    console.log('Log Toi !!!!!!!!!!');
    console.log(addUser);
    return db.query('INSERT INTO user (lastname, firstname, email, password, siret) VALUES (?, ?, ?, ?, ?)', [addUser.lastname, addUser.firstname, addUser.email, addUser.password, addUser.siret])
      .then(res => {
        newUser.id = res.insertId;
        return newUser;
      });
  }

  static async findById (id) {
    return db.query('SELECT * FROM user WHERE id = ?', [id])
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
    return db.query('SELECT * FROM user WHERE email = ?', [email])
      .then(rows => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM user');
  }

  static async updateById (id, user) {
    return db.query(
      'UPDATE user SET email = ?, firstname = ?, lastname = ?, siret = ? WHERE id = ?',
      [user.email, user.firstname, user.lastname, user.siret, id]
    ).then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM user WHERE id = ?', id).then(res => {
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
    return db.query('DELETE FROM user WHERE id = ?');
  }
}

module.exports = User;