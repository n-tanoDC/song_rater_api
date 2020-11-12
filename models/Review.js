const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema ( {
  title: { type: String, minlength: 5, maxlength: 70 },
  content: { type: String, minlength: 10, maxlength: 5000 },
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
  rating: { type: Number, min: 1, max: 10, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Review', reviewSchema);