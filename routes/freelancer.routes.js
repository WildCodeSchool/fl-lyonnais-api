const freelancersController = require('../controllers/freelancer.controller.js');
const router = require('express').Router();

router.post('/', freelancersController.create);
router.get('/', freelancersController.findAll);
router.get('/:id', freelancersController.findOne);
router.put('/:id', freelancersController.update);
router.delete('/:id', freelancersController.delete);

module.exports = router;
