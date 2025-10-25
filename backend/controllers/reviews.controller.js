const Review = require('../models/review.model');

// Obtener todas las reseñas
exports.getReviews = async (req, res) => {
  try {
    const { gameId, userId } = req.query;
    const filter = {};
    
    if (gameId) filter.gameId = gameId;
    if (userId) filter.userId = userId;
    
    const reviews = await Review.find(filter).populate('gameId', 'title platform');
    res.json(reviews);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Obtener una reseña por ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('gameId', 'title platform');
    if (!review) {
      return res.status(404).json('Reseña no encontrada');
    }
    res.json(review);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Crear una nueva reseña
exports.createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Actualizar una reseña
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json('Reseña no encontrada');
    }
    
    // Verificar que el usuario sea el propietario de la reseña
    if (review.userId !== req.body.userId) {
      return res.status(403).json('No autorizado para editar esta reseña');
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json('Reseña no encontrada');
    }
    
    // Verificar que el usuario sea el propietario de la reseña
    if (review.userId !== req.query.userId) {
      return res.status(403).json('No autorizado para eliminar esta reseña');
    }
    
    await Review.findByIdAndDelete(req.params.id);
    res.json('Reseña eliminada correctamente');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};