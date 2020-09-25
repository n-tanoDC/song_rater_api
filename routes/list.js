const router = require('express').Router();
const List = require('../models/List');
const User = require('../models/User');

router.route('/')
  // get all lists
  .get(async (req, res) => {
    const lists = await List.find({}).populate('author')
    res.json(lists)
  })
  .post(async (req, res) => {
    const { title } = req.body
    const list = new List({
      title: title
    })
    await list.save()
    res.send('POST OK')
  })

router.route('/:id')
  // get one list
  .get(async (req, res) => {
    const { id } = req.params; 
    const list = await List.findOne({ _id: id});
    res.json(list);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    await List.findByIdAndDelete(id)
    res.send('DELETE OK')
  })

router.route('/:username')
  // get all lists of one user
  .get(async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username: username})
    const lists = await List.find({ author: user._id })
    res.json(lists)
  })

module.exports = router;