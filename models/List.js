const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema ( {
  title: { type: String, required: true },
  description : String,
  elements: [Number],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('List', listSchema);