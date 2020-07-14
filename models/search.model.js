const db = require('../db.js');

class Search {
  static async search (searchItems) {
    const searchItemsTable = searchItems.split(';');

    const queryCommon = 'SELECT freelance.id AS freelance_id, user.firstname, user.lastname, freelance.job_title, freelance.url_photo FROM freelance JOIN user ON freelance.user_id = user.id WHERE freelance.user_id IN (SELECT DISTINCT freelance.user_id FROM freelance LEFT JOIN user ON freelance.user_id = user.id LEFT JOIN freelance_tag ON freelance_tag.freelance_id = freelance.id LEFT JOIN tag ON freelance_tag.tag_id = tag.id WHERE ';

    let queryWhere = '';
    const queryEscapeTable = [];
    // Boucle sur le nombre de critères de recherche
    let i = 0;
    for (i = 0; i < searchItemsTable.length; i++) {
      queryWhere += 'tag.name LIKE ? OR user.firstname LIKE ? OR user.lastname LIKE ? OR freelance.job_title LIKE ? ';

      // On ajoute OR à la fin de la ligne sauf à la dernière où l'on ferme la parenthèse
      (i < searchItemsTable.length - 1) ? queryWhere += 'OR ' : queryWhere += ')';

      // Parce qu'il y a quatre champs pour chaque recherches :
      // user.firstname, user.lastname, tag.name et freelance.job_title
      // Il faut mettre chaque item trois fois de suite.
      let j = 0;
      for (j = 0; j < 4; j++) {
        const k = (4 * i) + j;
        queryEscapeTable[k] = '%' + searchItemsTable[i] + '%';
      }
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

module.exports = Search;
