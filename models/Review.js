const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema ( {
  title: String,
  content: String,
  media: { 
    id: String,
    link: String,
    media_type: String,
    name: String,
    artists: [{
      id: String,
      name: String,
    }],
    image: String,
  },
  created_at: { type: Date, default: Date.now },
  rating: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Review', reviewSchema);