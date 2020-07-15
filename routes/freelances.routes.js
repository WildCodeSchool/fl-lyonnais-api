const router = require('express').Router();
const freelancesController = require('../controllers/freelances.controller.js');
// const imagesController = require('../controllers/images.controller.js');
const requireAuth = require('../middlewares/requireAuth');
const handleImageUpload = require('../middlewares/handleImageUpload');

router.get('/account', requireAuth, freelancesController.get);
router.post('/account', requireAuth, handleImageUpload, freelancesController.create);
router.patch('/account', requireAuth, handleImageUpload, freelancesController.update);
router.delete('/account', requireAuth, freelancesController.delete);

// pas de post image de profil car la 1er requete post sur un fl est un post sans image
router.post('/account/image', requireAuth, handleImageUpload, freelancesController.setImagesToUploadsFile);

router.get('/:id', freelancesController.findOne);

router.put('/:id', requireAuth, freelancesController.ActivateDeactivate);

router.get('/', freelancesController.pagination);

router.post('/account', freelancesController.create);
router.put('/account/:id', freelancesController.update);

module.exports = router;
