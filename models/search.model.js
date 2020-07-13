const db = require('../db.js');

class Search {
  static async search (searchItems) {
    console.log('search');
    return db.query('SELECT user.firstname, user.lastname, freelance.job_title FROM freelance JOIN user ON freelance.user_id = user.id WHERE freelance.user_id IN (SELECT DISTINCT freelance.user_id FROM freelance LEFT JOIN user ON freelance.user_id = user.id LEFT JOIN freelance_tag ON freelance_tag.freelance_id = freelance.id LEFT JOIN tag ON freelance_tag.tag_id = tag.id WHERE tag.name LIKE "%meyer%" OR user.firstname LIKE "%meyer%" OR user.lastname LIKE "%meyer%")')
      .then(res => {
        const searchResults = res;
        return searchResults;
      });
  }
}

module.exports = Search;
