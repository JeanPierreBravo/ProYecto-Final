const Game = require('../models/game.model');
const Review = require('../models/review.model');

// Obtener todos los juegos con filtros
exports.getGames = async (req, res) => {
  try {
    const { 
      userId, 
      title, 
      developer,
      genre, 
      platform, 
      completed, 
      sortBy,
      sortOrder = 'asc'
    } = req.query;

    // Construir el filtro base
    const filter = {};
    
    // Filtro por usuario
    if (userId) filter.userId = userId;
    
    // Filtro por título
    if (title) filter.title = { $regex: title, $options: 'i' };
    
    // Filtro por desarrollador
    if (developer) filter.developer = { $regex: developer, $options: 'i' };
    
    // Filtro por género
    if (genre && genre !== 'all') filter.genre = genre;
    
    // Filtro por plataforma
    if (platform && platform !== 'all') filter.platform = platform;
    
    // Filtro por estado de completado
    if (completed === 'true') filter.completed = true;
    if (completed === 'false') filter.completed = false;
    
    // Configurar ordenamiento
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.title = 1; // Por defecto ordenar por título ascendente
    }

    const games = await Game.find(filter).sort(sort);
    res.json(games);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Obtener un juego por ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json('Juego no encontrado');
    }
    res.json(game);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Crear un nuevo juego
exports.createGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.json(savedGame);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Actualizar un juego
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json('Juego no encontrado');
    }
    
    // Verificar que el usuario sea el propietario del juego
    if (game.userId !== req.body.userId) {
      return res.status(403).json('No autorizado para editar este juego');
    }
    
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedGame);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};

// Eliminar un juego
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json('Juego no encontrado');
    }
    
    // Verificar que el usuario sea el propietario del juego
    if (game.userId !== req.query.userId) {
      return res.status(403).json('No autorizado para eliminar este juego');
    }
    
    await Review.deleteMany({ gameId: req.params.id });
    await Game.findByIdAndDelete(req.params.id);
    res.json('Juego eliminado correctamente');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
};