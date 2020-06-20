const db = require('../db.js');

class Freelancer {
  constructor (freelancer) {
    this.id = freelancer.id;
    this.email = freelancer.email;
    this.last_name = freelancer.last_name;
    this.first_name = freelancer.first_name;
    this.active = freelancer.active;
  }

  get fullName () {
    return `${this.first_name} ${this.last_name}`;
  }

  static async create (newFreelancer) {
    return db.query('INSERT INTO freelancers SET ?', newFreelancer).then(res => { newFreelancer.id = res.insertId; return newFreelancer; });
  }

  static async findById (id) {
    return db.query(`SELECT * FROM freelancers WHERE id = ${id}`)
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
    return db.query('SELECT * FROM freelancers WHERE email = ?', [email])
      .then(rows => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM freelancers');
  }

  static async updateById (id, freelancer) {
    return db.query(
      'UPDATE freelancers SET email = ?, first_name = ?, last_name = ?, active = ? WHERE id = ?',
      [freelancer.email, freelancer.first_name, freelancer.last_name, freelancer.active, id]
    ).then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM freelancers WHERE id = ?', id).then(res => {
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
    return db.query('DELETE FROM freelancers');
  }
}

module.exports = Freelancer;
