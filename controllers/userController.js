const User = require('../models/User');

const { bodyValidator, deleteAvatar, getMedia } = require('../functions');
const Media = require('../models/Media');

// Edit user info
exports.editAccount = async (req, res) => {
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
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { user } = req;
    await deleteAvatar(user);
    await User.deleteOne({ _id: user._id })
    res.json({ deletedUser: user })
  } catch (error) {
    res.json(error)
  }
};

// Get one user info
exports.getOneUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }, '-password');
  res.json(user);
};

// Follow or unfollow a user
exports.updateSubscription = async (req, res) => {
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
};

// Add an item to user's favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { user, body } = req;

    const media = await getMedia(body)

    const newUser = await User.findByIdAndUpdate(user._id, { $addToSet: { favorites: media._id }}, { new: true })
      .populate({ path: 'favorites', model: 'Media' })

    res.json(newUser.favorites)
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message })
  }
}

// Remove an item from user's favorites
exports.deleteFromFavorites = async (req, res) => {
  try {
    const { params, user } = req;

    const media = await getMedia({ id: params.id })

    const newUser = await User.findByIdAndUpdate(user._id, { $pull: { favorites: media._id }}, { new: true })
      .populate({ path: 'favorites', model: 'Media' })

    res.json(newUser.favorites)
  } catch (error) {
    res.json(error)
  }
}