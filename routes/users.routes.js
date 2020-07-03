const usersController = require('../controllers/users.controller.js');
const authController = require('../controllers/auth.controller.js');
const router = require('express').Router();

router.post('/', usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

router.post('/connexion', authController.login);

module.exports = router;
