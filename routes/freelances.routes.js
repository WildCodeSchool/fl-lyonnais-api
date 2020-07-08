const freelancesController = require('../controllers/freelances.controller.js');
const router = require('express').Router();

// Pour la pagination, format : /?page=n&step=x
router.get('/', freelancesController.pagination);

router.post('/', freelancesController.create);
router.get('/:id', freelancesController.findOne);
router.put('/:id', freelancesController.update);
router.delete('/:id', freelancesController.delete);

module.exports = router;
