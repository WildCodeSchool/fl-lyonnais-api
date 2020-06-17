const freelancesController = require('../controllers/freelance.controller.js');
const router = require('express').Router();

router.post('/', freelancesController.create);
router.get('/', freelancesController.findAll);
router.get('/:id', freelancesController.findOne);
router.put('/:id', freelancesController.update);
router.delete('/:id', freelancesController.delete);

module.exports = router;
