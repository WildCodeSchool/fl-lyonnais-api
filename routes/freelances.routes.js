const freelancesController = require('../controllers/freelances.controller.js');
const router = require('express').Router();

// Pour la pagination, format : /page?page=n&step=x
router.get('/page', freelancesController.pagination);

router.post('/', freelancesController.create);
router.get('/', freelancesController.findAll);
router.get('/:id', freelancesController.findOne);
router.put('/:id', freelancesController.update);
router.delete('/:id', freelancesController.delete);

module.exports = router;
