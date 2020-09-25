const router = require('express').Router();

router.route('/')
  .get(async (req, res) => {
    res.json({
      message: 'User route.',
      user: req.user,
      token: req.query.secret_token
    })
  })

module.exports = router;
