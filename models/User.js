const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  avatar: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  description: String,
  favorites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isAdmin: { type: Boolean, default: false }
});

userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password)
  return compare;
}

module.exports = mongoose.model('User', userSchema);