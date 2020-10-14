const User = require('../models/User');
const upload = require('../multer');
const router = require('express').Router();
const passport = require('passport');
const Review = require('../models/Review');

router.route('/:username')
  .get(async (req, res) => {
    const { username } = req.params;
    let user = await User.findOne({ username }, '-password');
    res.json(user);
  })

router.route('/:username/reviews')
  // get all reviews for 1 user
  .get(async (req, res) => {
    const { page = 1, limit = 5 } = req.query
    const { username } = req.params;
    const user = await User.findOne({ username })
    const reviews = await Review.find({ author: user._id })
      .populate('author')
      .sort({ created_at: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec()
    
      const count = await Review.countDocuments()
    // get total amount of pages possible with the limit defined in the request
    const totalPages = Math.ceil(count / limit)
    // generate a url for the next page if there's any page left
    const next = page < totalPages ? (parseInt(page) + 1) : null
    res.json({ reviews, next })
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
