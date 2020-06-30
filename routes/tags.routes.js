const tagController = require('../controllers/tags.controller.js');
const router = require('express').Router();

router.get('/', tagController.findAll);
router.get('/:id', tagController.findOne);
// router.post('/', tagController.create);

module.exports = router;
