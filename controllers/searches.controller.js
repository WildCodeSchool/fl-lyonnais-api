const Search = require('../models/search.model.js');
const Freelance = require('../models/freelance.model.js');

class SearchController {
  static async search (req, res) {
    try {
      const searchItems = req.query.recherche;
      const searchResults = await Search.search(searchItems);
      // console.log(searchResults.length);
      // console.log(searchResults);

      const tags = await Promise.all(searchResults.map(f => Freelance.getAllTags(f.id)));
      for (let i = 0; i < searchResults.length; i++) {
        searchResults[i].tags = tags[i];
      }

      res.send({ searchResults });
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || "La recherche n'a pas abouti."
      });
    }
  }
}

module.exports = SearchController;
