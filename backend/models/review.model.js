const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;