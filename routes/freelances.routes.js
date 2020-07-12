const freelancesController = require('../controllers/freelances.controller.js');
const imagesController = require('../controllers/images.controller.js');
const imagesReferencesController = require('../controllers/imagesreferences.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');
const handleImageUpload = require('../middlewares/handleImageUpload');
const handleImagesUpload = require('../middlewares/handleImagesUpload');

router.post('/account', requireAuth, handleImageUpload, freelancesController.create);
router.patch('/account', requireAuth, handleImageUpload, freelancesController.update);

//pas de post image de profil car la 1er requete post sur un fl est un post sans image
router.patch('/account/image', requireAuth, handleImageUpload, imagesController.update);

router.patch('/account/imageReferences', requireAuth, handleImagesUpload, imagesReferencesController.update);

router.get('/account', requireAuth,freelancesController.get);

router.get('/:id', freelancesController.findOne);
router.delete('/:id', requireAuth,freelancesController.delete);

router.get('/', freelancesController.pagination);

module.exports = router;
