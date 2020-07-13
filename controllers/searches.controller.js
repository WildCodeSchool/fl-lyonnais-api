const Search = require('../models/search.model.js');

class SearchController {
  static async search (req, res) {
    const searchItems = req.query.recherche;
    const searchResults = await Search.search(searchItems);
    console.log(searchResults.length);
    console.log(searchResults);
    return searchResults;
  }
}

module.exports = SearchController;
