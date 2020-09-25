const router = require('express').Router();
const User = require('../models/User')
const List = require('../models/List')
const Review = require('../models/Review')

router.route('/')
  .get(async (req, res) => {
    const users = await User.find({})
    res.json(users)
  })
  .post(async (req, res) => {
    const { username, email, password } = req.body
    const user = new User({ 
      username: username,
      email: email,
      password: password
    })
    await user.save()
    res.send('OK')
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.query;
      await User.findOneAndDelete({ _id: id })
      res.send('Delete Ok')
    } catch (error) {
      res.send(error)
    }
  })

  router.route('/:username')
    .get(async (req, res) => {
      try {
        const { username } = req.params
        console.log(username);
        const user = await User.findOne({ username: username })
        res.json(user)
      } catch (error) {
        res.send(error)
      }
    })

module.exports = router;
