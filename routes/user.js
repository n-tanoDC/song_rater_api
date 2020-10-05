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
    await User.update({ _id: id }, { $addToSet: { favorites: element_id} })
    res.send('POST OK')
  })
