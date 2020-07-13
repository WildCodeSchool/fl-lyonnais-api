const freelancesController = require('../controllers/freelances.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');
// Pour la pagination, format : /?page=n&step=x
router.post('/account', requireAuth, freelancesController.create);
router.put('/account', requireAuth, freelancesController.update);
router.get('/account', requireAuth, freelancesController.get);

router.get('/:id', freelancesController.findOne);
router.delete('/:id', requireAuth, freelancesController.delete);
router.put('/:id', requireAuth, freelancesController.ActivateDeactivate);

router.get('/', freelancesController.pagination);

router.post('/account', freelancesController.create);
router.put('/account/:id', freelancesController.update);

module.exports = router;
