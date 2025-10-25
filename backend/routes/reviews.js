const router = require('express').Router();
const reviewsController = require('../controllers/reviews.controller');

// Rutas para reseñas
router.get('/', reviewsController.getReviews);
router.get('/:id', reviewsController.getReviewById);
router.post('/', reviewsController.createReview);
router.put('/:id', reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;