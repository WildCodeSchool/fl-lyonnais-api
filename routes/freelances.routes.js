const freelancesController = require('../controllers/freelances.controller.js');
const router = require('express').Router();

// Pour la pagination, format : /?page=n&step=x
router.get('/', freelancesController.pagination);

router.get('/:id', freelancesController.findOne);
router.put('/:id', freelancesController.update);
router.delete('/:id', freelancesController.delete);

router.post('/account', freelancesController.create);
router.put('/account/:id', freelancesController.update);

module.exports = router;
