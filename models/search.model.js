const db = require('../db.js');

class Search {
  static async search (searchItems) {
    const searchItemsTable = searchItems.split(';');

    const queryCommon = 'SELECT user.firstname, user.lastname, freelance.job_title FROM freelance JOIN user ON freelance.user_id = user.id WHERE freelance.user_id IN (SELECT DISTINCT freelance.user_id FROM freelance LEFT JOIN user ON freelance.user_id = user.id LEFT JOIN freelance_tag ON freelance_tag.freelance_id = freelance.id LEFT JOIN tag ON freelance_tag.tag_id = tag.id WHERE ';

    let queryWhere = '';
    const queryEscapeTable = [];
    // Boucle sur le nombre de critères de recherche
    let i = 0;
    for (i = 0; i < searchItemsTable.length; i++) {
      queryWhere += 'tag.name LIKE ? OR user.firstname LIKE ? OR user.lastname LIKE ? ';
      (i < searchItemsTable.length - 1) ? queryWhere += 'OR ' : queryWhere += ')';
      // Parce qu'il y a trois champs pour chaque recherches :
      // user.firstname, user.lastname et tag.name
      // Il faut mettre chaque item trois fois de suite.
      let j = 0;
      for (j = 0; j < 3; j++) {
        const k = (3 * i) + j;
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
