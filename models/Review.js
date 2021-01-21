const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema ( {
  title: { type: String, maxlength: 70 },
  content: { type: String, maxlength: 5000 },
  media: { type: Schema.Types.ObjectId, ref: 'Media' },
  created_at: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 10, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

reviewSchema.methods.upvote = async function(id) {
  if (this.upvotes.includes(id)) {
    removeItem(this.upvotes, id)
  } else {
    removeItem(this.downvotes, id)
    this.upvotes.push(id)
  }
  this.save()
}

reviewSchema.methods.downvote = async function(id) {
  if (this.downvotes.includes(id)) {
    removeItem(this.downvotes, id)
  } else {
    removeItem(this.upvotes, id)
    this.downvotes.push(id)
  }
  this.save()
}

const removeItem = (array, item) => {
  const index = array.indexOf(item)
  if (index !== -1) {
    array.splice(index, 1)
  }
  return array
}

module.exports = mongoose.model('Review', reviewSchema);