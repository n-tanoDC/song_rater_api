const router = require('express').Router();
const upload = require('../multer');

const { checkAuth } = require('../auth/auth');

const controller = require('../controllers/userController');

router.route('/account')
  .put(checkAuth, upload.single('avatar'), controller.editAccount)
  .delete(checkAuth, controller.deleteAccount)

router.route('/account/favorites/:id')
  .post(checkAuth, controller.addToFavorites)
  .delete(checkAuth, controller.deleteFromFavorites)

router.route('/:username')
  .get(controller.getOneUser)

router.route('/:username/:action')
  .get(checkAuth, controller.updateSubscription)


module.exports = router;
