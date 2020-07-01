const usersController = require('../controllers/users.controller.js');
const setupAccountValidationEmail = require('../middlewares/setupAccountValidationEmail');
const router = require('express').Router();

router.post('/', setupAccountValidationEmail, usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;
