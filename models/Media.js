const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

const mediaSchema = new Schema ({
  id: { type: String, required: true },
  link: { type: String, required: true },
  media_type: { type: String, required: true },
  name: { type: String, required: true },
  average_rating: { type: Number },
  artists: [{
    id: String,
    name: String,
  }],
  image: { type: String },
});

mediaSchema.methods.getPopularity = async function() {
  const popularity = await User.countDocuments({ 'favorites.id': this.id })
  return popularity;
} 

module.exports = mongoose.model('Media', mediaSchema);