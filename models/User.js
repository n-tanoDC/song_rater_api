const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  username: { type: String, required: true },
  email: { type: String, required: true },
  description: String,
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  favorites: [Number]
});

module.exports = mongoose.model('User', userSchema);