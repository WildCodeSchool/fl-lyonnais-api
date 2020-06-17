const freelancersController = require('../controllers/freelancer.controller.js');
const router = require('express').Router();

// Home Page plus searchbar
router.post('/', freelancersController.create);
router.get('/', freelancersController.findAll);
router.get('/:id', freelancersController.findOne);
router.put('/:id', freelancersController.update);
router.delete('/:id', freelancersController.delete);

// Page signin
router.post('/signin', freelancersController.create);

// Page registration
router.post('/registration', freelancersController.create);

// Page listing
router.get('/listing/:page', freelancersController.findAll); // faut il créer une autre méthode ex findListingSearch
router.get('/listing/', freelancersController.findAll);

// Page détail
router.get('/detail/:id', freelancersController.findOne);
router.put('/detail/:id', freelancersController.udpdate);
router.delete('/detail/:id', freelancersController.delete);

// Admin => back-office ?
router.put('/admin/:id', freelancersController.udpdate);
router.delete('/admin/:id', freelancersController.delete);

// Généric en option à écrire plus tard
router.get('/generic/:slug', freelancersController.findOne);
router.post('/generic/:slug', freelancersController.create);
router.put('/generic/:slug', freelancersController.udpdate);
router.delete('/generic/:slug ', freelancersController.delete);

module.exports = router;
