const db = require('../db.js');

class Tag {
  // Récupère tous les tag en base de donnée
  static async getAll (result) {
    return db.query('SELECT * FROM tag');
  }

  // Récupère le tag dont l'id est donné en paramètre d'URL
  static async findById (id) {
    return db.query('SELECT * FROM tag WHERE id = ?', [id])
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
};

module.exports = Tag;
