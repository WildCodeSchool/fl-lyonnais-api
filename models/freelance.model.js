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

  // Récupère tous les tags (nom et id) d'un freelance depuis son id.
  static async getAllTags (freelance_id) {  /* eslint-disable-line */
    return db.query('SELECT tag.id AS id, name FROM tag JOIN freelance_tag ft ON tag.id = ft.tag_id WHERE ft.freelance_id = ?', [freelance_id]);   /* eslint-disable-line */
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
    const { offset, flperpage } = result;
    return db.query('SELECT f.id as id, firstname, lastname, url_photo, job_title FROM freelance AS f JOIN user AS u ON f.user_id = u.id WHERE f.is_active = 1 and u.is_deleted = 0 ORDER BY random_id LIMIT ? OFFSET ?', [parseInt(flperpage), offset]);
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

  // Recherche dans le nom, le prénom, les tags et le job title des freelances
  // Paramètres de la méthode :
  // - searchItems : liste des critères de recherche
  // - flperpage : nombre de freelance à afficher par page
  // - offset : offset pour la pagination
  // - resultLength : FLAG
  //   si = 1 => la requête liste tous les freelances correspondants à la recherche sans pagination (pour obtenir le nombre total de fl concernés afin de calculer le nombre total de pages)
  //   si = 0 => requête paginée
  static async search (searchItems, flperpage, offset, resultLength) {
    const searchItemsTable = searchItems;

    const queryCommon = 'SELECT freelance.id, user.firstname, user.lastname, freelance.job_title, freelance.url_photo FROM freelance JOIN user ON freelance.user_id = user.id WHERE freelance.user_id IN (SELECT DISTINCT freelance.user_id FROM freelance LEFT JOIN user ON freelance.user_id = user.id LEFT JOIN freelance_tag ON freelance_tag.freelance_id = freelance.id LEFT JOIN tag ON freelance_tag.tag_id = tag.id WHERE ';

    let queryWhere = '';
    const queryEscapeTable = [];
    // Boucle sur le nombre de critères de recherche
    let i = 0;
    for (i = 0; i < searchItemsTable.length; i++) {
      queryWhere += 'tag.name LIKE ? OR user.firstname LIKE ? OR user.lastname LIKE ? OR freelance.job_title LIKE ? ';

      // On ajoute OR à la fin de la ligne sauf à la dernière où l'on ferme la parenthèse
      (i < searchItemsTable.length - 1) ? queryWhere += 'OR ' : queryWhere += ') ORDER BY freelance.random_id ';

      // Parce qu'il y a quatre champs pour chaque recherches :
      // user.firstname, user.lastname, tag.name et freelance.job_title
      // Il faut mettre chaque item trois fois de suite.
      let j = 0;
      for (j = 0; j < 4; j++) {
        const k = (4 * i) + j;
        queryEscapeTable[k] = '%' + searchItemsTable[i] + '%';
      }
    }
    if (!resultLength) {
      // Pour obtenir une liste paginée
      queryWhere += 'LIMIT ? OFFSET ?';
      queryEscapeTable.push(parseInt(flperpage));
      queryEscapeTable.push(offset);
    }

    return db.query(queryCommon + queryWhere, queryEscapeTable)
      .then(res => {
        const searchResults = res;
        return searchResults;
      })
      .catch(err => {
        console.error(err);
      });
  }
}

module.exports = Freelance;
