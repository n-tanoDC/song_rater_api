const router = require('express').Router();
const fs = require('fs');
const upload = require('../multer');

const User = require('../models/User');
const Review = require('../models/Review');

const { authenticate, bodyValidator, findWithPagination } = require('../functions');

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

        const { error } = (await bodyValidator(body));
        
        if (error) {
          return res.status(400).json({ error })
        }
        

        if (file) {
          if (user.avatar) {
            await deleteAvatar(user)
          }
          body.avatar = file.filename;
        }
        
        if (body.password) {
          return res.status(400).json({ error: 'Modification de mot de passe non supportée.' });
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, body, { new: true });

        res.json(updatedUser)
      } catch (error) {
        console.log(error);
        res.sendStatus(500)
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
      const followedUser = await User.findOneAndUpdate({ username }, { [operator]: { followers: _id }}, { new: true })
      const updatedUser = await User.findByIdAndUpdate(_id, { [operator]: { following: followedUser._id }}, { new: true})

      res.json({ followedUser, updatedUser });
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  })

module.exports = router;
