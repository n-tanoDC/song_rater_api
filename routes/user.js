const User = require('../models/User');
const upload = require('../multer');
const router = require('express').Router();

router.route('/')
  .get(async (req, res) => {
    res.json({
      message: 'User route.',
      user: req.user,
      token: req.query.secret_token
    })
  })
  .post(upload.single('avatar'), async (req, res) => {
    const avatar = req.file.filename;
    await User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    res.send('POST OK')
  })

router.route('/favorites')
  // add an element to the user's favorites
  .post(async (req, res) => {
    const { id, element_id } = req.body;
    const user = await User.findById(id)
    user.favorites.push(element_id)
    await user.save()
    res.send('POST OK')
  })
  
module.exports = router;
