const User = require('../models/User');

const router = require('express').Router();

router.route('/')
  .get(async (req, res) => {
    res.json({
      message: 'User route.',
      user: req.user,
      token: req.query.secret_token
    })
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
