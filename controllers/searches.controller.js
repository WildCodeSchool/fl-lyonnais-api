const Search = require('../models/search.model.js');

class SearchController {
  static async search (req, res) {
    console.log('SearchContoller');
    const searchItems = req.searchItems;
    const searchResults = await Search.search(searchItems);
    console.log(searchResults);
    return searchResults;
  }
}

module.exports = SearchController;
