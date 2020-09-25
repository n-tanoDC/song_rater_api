const router = require('express').Router();
const User = require('../models/User')

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

module.exports = router;
