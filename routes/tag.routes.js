const tagController = require('../controllers/tag.controller.js');
const router = require('express').Router();

router.get('/', tagController.findAll);
router.get('/:id', tagController.findOne);

module.exports = router;
