const usersController = require('../controllers/users.controller.js');
const authController = require('../controllers/auth.controller.js');
const router = require('express').Router();

router.post('/', usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

// Validation d'un nouveau freelance par son email
router.get('/validation_email/:email/:key', usersController.validationByEmail);

router.post('/connexion', authController.login);


module.exports = router;
