const router = require('express').Router();
const fs = require('fs');
const upload = require('../multer');

const User = require('../models/User');
const Review = require('../models/Review');

const { validator, authenticate } = require('../auth/functions');
const { findWithPagination } = require('./functions');

const deleteAvatar = user => {
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
            await deleteAvatar(user)
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
    .delete(authenticate, async (req, res) => {
      try {
        const { user } = req;
        await deleteAvatar(user);
        await User.deleteOne({ _id: user._id })
        res.json({ deletedUser: user })
      } catch (error) {
        res.json(error)
      }
    })

  router.route('/account/following/reviews')
    .get(authenticate, async (req, res) => {
      try {
        const { page = 1, limit = 5 } = req.query
        const query = { author: { $in : req.user.following }}
        const reviews = await findWithPagination(Review, query, page, limit)
        res.json(reviews);
      } catch (error) {
        res.json(error);
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
    const user = await User.findOne({ username });
    const query = { author: user._id };
    const reviews = await findWithPagination(Review, query, page, limit);
    res.json(reviews)
})


router.route('/:username/:action')
  .get(authenticate, async (req, res) => {
    try {
      const { username, action } = req.params;
      const { _id } = req.user;

      let operator;
      
      // Define the operator to use depending on the action
      switch (action) {
        case 'follow': 
          // Add an element to an array
          operator = '$addToSet';
          break;
        case 'unfollow':
          // Remove an element from an array
          operator = '$pull';
          break;
        default: 
          throw new Error('action not supported')
      }

      // Find user by username, apply operator to the corresponding array of data
      const followedUser = await User.findOneAndUpdate({ username }, { [operator]: { followers: _id }})
      await User.updateOne({ _id }, { [operator]: { following: followedUser._id }})

      res.sendStatus(200);
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  })

module.exports = router;
