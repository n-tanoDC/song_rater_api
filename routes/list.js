const router = require('express').Router();
const List = require('../models/List')

router.route('/')
  .get(async (req, res) => {
    const lists = await List.find({}).populate('author')
    res.json(lists)
  })

module.exports = router;