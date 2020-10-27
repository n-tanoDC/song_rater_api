const router = require('express').Router();
const fs = require('fs');
const upload = require('../multer');

const User = require('../models/User');
const Review = require('../models/Review');

const { validator, authenticate } = require('../auth/functions');

const deletePreviousAvatar = user => {
  const path = './uploads/' + user.avatar;
  return fs.unlink(path, error => {
    console.log(error);
  })
}

router.route('/account')
  .put(authenticate, upload.single('avatar'), 
    async (req, res) => {
      try {
        let { user, body, file } = req;
        let updatedUser;
        // We update only the fields sent in the request body
        for (const [key, value] of Object.entries(body)) {
          if (key === 'username' || key === 'email' || key === 'password') {
            if (!validator(value, key)) {
              throw ({ type: 'syntax', key })
            }
          }
        }
        
        // Update the avatar field only if a file is provided in the request
        if (file) {
          // Delete the previous avatar if the user already has one
          if (user.avatar) {
            await deletePreviousAvatar(user)
          }
          body.avatar = file.filename;
        }

        // The password is automatically crypted on save(), so we have to check if it is provided in the request body to act accordingly :
        // - We use save() if we want to hash a new password.
        // - We use updateOne() if we dont want the password to change.
        if (body.password) {
          console.log('Password modification not supported yet.');
        } else {
          updatedUser = await User.findByIdAndUpdate(user._id, body, { new: true });
        }

        res.json(updatedUser)
      } catch (error) {
        console.log(error, error.message);
        if (error.code === 11000) {
          res.status(400).json({ type: 'duplicate', key: Object.keys(error.keyValue)[0] })
        } else if (error.type === 'syntax') {
          res.status(400).json(error) 
        } else {
          res.sendStatus(500)
        }
      }
    })

router.route('/:username')
  .get(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }, '-password');
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

router.route('/:username/:action')
  .get(authenticate, async (req, res) => {
    try {
      const { username, action } = req.params;
      let operator;
      
      switch (action) {
        case 'follow': 
          operator = '$addToSet';
          break;
        case 'unfollow':
          operator = '$pull';
          break;
        default: 
          throw new Error('action not supported')
      }

      const user = await User.findOneAndUpdate({ username }, { [operator]: { followers: req.user._id }})
      await User.updateOne({ _id: req.user._id }, { [operator]: { following: user._id }})

      res.sendStatus(200);
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  })

module.exports = router;
