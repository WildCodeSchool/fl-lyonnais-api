const searchesController = require('../controllers/searches.controller');
const router = require('express').Router();
// const requireAuth = require('../middlewares/requireAuth');

router.get('/', searchesController.search);

module.exports = router;
