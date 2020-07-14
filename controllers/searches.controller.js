const Search = require('../models/search.model.js');

class SearchController {
  static async search (req, res) {
    try {
      const searchItems = req.query.recherche;
      const searchResults = await Search.search(searchItems);
      // console.log(searchResults.length);
      // console.log(searchResults);
      res.send({ searchResults });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || "La recherche n'a pas abouti."
      });
    }
  }
}

module.exports = SearchController;
