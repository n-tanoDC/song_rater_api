const User = require('../models/User');
const upload = require('../multer');
const router = require('express').Router();
const passport = require('passport');
const Review = require('../models/Review');

router.route('/:username')
  .get(async (req, res) => {
    const { username } = req.params;
    let user = await User.findOne({ username }, '-password');
    const reviews = await Review.find({ author: user._id });
    res.json({ user, reviews });
  })

router.route('/:username/favorites')
  // add an element to the user's favorites
  .post(async (req, res) => {
    const { id, element_id } = req.body;
    await User.update({ _id: id }, { $addToSet: { favorites: element_id} })
    res.send('POST OK')
  })

router.route('/:username/reviews')
  // get all reviews for 1 user
  .get(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username })
    const reviews = await Review.find({ author: user._id });
    console.log(reviews)
    res.json(reviews)
})

router.route('/account',  passport.authenticate('jwt', { session: false }))
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

module.exports = router;
