const tagController = require('../controllers/tags.controller.js');
const router = require('express').Router();

router.get('/', tagController.findAll);
router.get('/:id', tagController.findOne);

module.exports = router;
