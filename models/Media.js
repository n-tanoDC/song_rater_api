const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./Review');
const User = require('./User');

const functions = require('../functions');

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

mediaSchema.methods.updateAverageRating = async function() {
  const ratings = await Review.find({ 'media.id': this.id }, { rating: 1 })
  console.log(ratings);
}

module.exports = mongoose.model('Media', mediaSchema);