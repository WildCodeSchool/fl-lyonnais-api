const freelancesController = require('../controllers/freelances.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');
const handleImageUpload = require('../middlewares/handleImageUpload');
// Pour la pagination, format : /?page=n&step=x
router.post('/account', requireAuth, handleImageUpload, freelancesController.create);
router.put('/account', requireAuth,handleImageUpload, freelancesController.update);
router.get('/account', requireAuth,freelancesController.get);

router.get('/:id', freelancesController.findOne);
router.delete('/:id', requireAuth,freelancesController.delete);

router.get('/', freelancesController.pagination);

module.exports = router;
