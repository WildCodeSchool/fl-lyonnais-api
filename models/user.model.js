const db = require('../db.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

class User {
  static async create (newUser) {
    const hash = await argon2.hash(newUser.password);
    const addUser = { ...newUser, password: hash };
    return db.query('INSERT INTO user (email, firstname, lastname, password, siret, is_validated, registration_date, `key`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [addUser.email, addUser.firstname, addUser.lastname, addUser.password, addUser.siret, addUser.is_validated, addUser.registration_date, addUser.key])
      .then(res => {
        newUser.id = res.insertId;
        const { password, ...addUser } = newUser;
        return addUser;
      });
  }

  static async findById (id) {
    return db.query('SELECT * FROM user WHERE id = ?', [id])
      .then(rows => {
        if (rows.length) {
          return Promise.resolve({ ...rows[0], password: '' });
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }

  static async findByEmail (email) {
    return db.query('SELECT * FROM user WHERE email = ?', [email])
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
    console.log(email);
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
    return db.query('SELECT * FROM user')
      .then(rows => rows.map(row => ({ ...row, password: '' })));
  }

  static async updateById (id, user) {
    return db.query(
      'UPDATE user SET email = ?, firstname = ?, lastname = ?, siret = ?, is_validated = ?, last_connection_date = ? WHERE id = ?',
      [user.email, user.firstname, user.lastname, user.siret, user.is_validated, user.last_connection_date, id]
    ).then(() => this.findById(id));
  }

  static async login (email, password) {
    let user = await User.findByEmail(email);

    if (!user) {
      throw new Error('user not found');
    } else {
      console.log(user.password);
      console.log(password);
      const passwordIsValid = await argon2.verify(user.password, password);
      if (!passwordIsValid) {
        throw new Error('incorrect password');
      } else {
        const data = { name: user.name, id: user.id };
        const token = jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '48h' });
        const userWithoutPassord = { password: '', ...user };
        user = { ...userWithoutPassord, last_connection_date: new Date().toISOString().slice(0, 10) };
        await User.updateById(data.id, user);
        return Promise.resolve({ token, data, user });
      }
    }
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
