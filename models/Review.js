const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema ( {
  title: String,
  content: String,
  element: { 
    id: String,
    element_type: String,
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