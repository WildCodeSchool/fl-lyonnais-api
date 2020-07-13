const usersController = require('../controllers/users.controller.js');
const authController = require('../controllers/auth.controller.js');
const router = require('express').Router();

// Validation d'un nouveau freelance par son email
router.get('/validation_email', usersController.validationByEmail);

// Lorsque le freelance demande le renvoi d'un email de validation
router.post('/renvoi_email_validation', usersController.resendValidationEmail);

router.post('/', usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

router.post('/connexion', authController.login);

module.exports = router;
