const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  developer: { type: String, required: true },
  publisher: { type: String, required: true },
  coverImage: { type: String, required: false },
  completed: { type: Boolean, default: false },
  hoursPlayed: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  userId: { type: String, required: true } // Para identificar al propietario del juego
}, {
  timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;