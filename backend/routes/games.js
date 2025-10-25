const router = require('express').Router();
const gamesController = require('../controllers/games.controller');

// Rutas para juegos
router.get('/', gamesController.getGames);
router.get('/:id', gamesController.getGameById);
router.post('/', gamesController.createGame);
router.put('/:id', gamesController.updateGame);
router.delete('/:id', gamesController.deleteGame);

module.exports = router;