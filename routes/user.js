const User = require('../models/User');
const List = require('../models/List');
const upload = require('../multer');
const router = require('express').Router();

router.route('/')
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

router.route('/favorites')
  // add an element to the user's favorites
  .post(async (req, res) => {
    const { id, element_id } = req.body;
    await User.update({ _id: id }, { $addToSet: { favorites: element_id} })
    res.send('POST OK')
  })

router.route('/lists')
// get all users lists
  .get(async (req, res) => {
    const { _id } = req.user;
    const lists = await List.find({ author: _id })
    res.json(lists)
  })
  .post(async (req, res) => {
    const { _id } = req.user;
    const { title, elements } = req.body;
    console.log('Elements : ', typeof elements, elements);
    const list = new List({
      title: title,
      elements: elements,
      author: _id
    })
    await list.save()
    res.json({ message: 'POST OK' })
  })
module.exports = router;
