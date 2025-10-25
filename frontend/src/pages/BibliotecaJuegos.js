import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, InputGroup, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import TarjetaJuego from '../components/TarjetaJuego';
import { getGames, deleteGame } from '../services/gameService';

const BibliotecaJuegos = ({ userId }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener géneros y plataformas únicas para los filtros
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    loadGames();
  }, [userId]);

  useEffect(() => {
    if (games.length > 0) {
      // Extraer géneros y plataformas únicas
      const uniqueGenres = [...new Set(games.map(game => game.genre))];
      const uniquePlatforms = [...new Set(games.map(game => game.platform))];
      
      setGenres(uniqueGenres);
      setPlatforms(uniquePlatforms);
    }
  }, [games]);

  useEffect(() => {
    applyFilters();
  }, [games, searchTerm, filterCompleted, filterGenre, filterPlatform, sortBy]);

  const loadGames = async () => {
    try {
      const response = await getGames(userId);
      setGames(response.data);
    } catch (error) {
      console.error('Error al cargar los juegos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este juego?')) {
      try {
        await deleteGame(id, userId);
        loadGames();
      } catch (error) {
        console.error('Error al eliminar el juego:', error);
      }
    }
  };

  const applyFilters = () => {
    let result = [...games];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado de completado
    if (filterCompleted !== 'all') {
      result = result.filter(game => 
        filterCompleted === 'completed' ? game.completed : !game.completed
      );
    }

    // Filtrar por género
    if (filterGenre !== 'all') {
      result = result.filter(game => game.genre === filterGenre);
    }

    // Filtrar por plataforma
    if (filterPlatform !== 'all') {
      result = result.filter(game => game.platform === filterPlatform);
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'releaseYear':
          return b.releaseYear - a.releaseYear;
        case 'hoursPlayed':
          return b.hoursPlayed - a.hoursPlayed;
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredGames(result);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCompleted('all');
    setFilterGenre('all');
    setFilterPlatform('all');
    setSortBy('title');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mi Biblioteca de Juegos</h1>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-2" /> Filtros
          </Button>
          <Link to="/agregar-juego" className="btn btn-success">
            <FaPlus className="me-2" /> Agregar Juego
          </Link>
        </div>
      </div>

      {showFilters && (
        <Card className="filters-container mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Buscar</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Título o desarrollador"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select 
                    value={filterCompleted}
                    onChange={(e) => setFilterCompleted(e.target.value)}
                  >
                    <option value="all">Todos los juegos</option>
                    <option value="completed">Completados</option>
                    <option value="pending">Pendientes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Género</Form.Label>
                  <Form.Select 
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                  >
                    <option value="all">Todos los géneros</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Plataforma</Form.Label>
                  <Form.Select 
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                  >
                    <option value="all">Todas las plataformas</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ordenar por</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSortAmountDown />
                    </InputGroup.Text>
                    <Form.Select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="title">Título (A-Z)</option>
                      <option value="rating">Puntuación (Mayor a menor)</option>
                      <option value="releaseYear">Año de lanzamiento (Reciente primero)</option>
                      <option value="hoursPlayed">Horas jugadas (Mayor a menor)</option>
                      <option value="recent">Añadidos recientemente</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end justify-content-end">
                <Button variant="outline-danger" onClick={resetFilters} className="me-2">
                  Limpiar filtros
                </Button>
                <Button variant="outline-light" onClick={loadGames}>
                  Actualizar
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {filteredGames.length === 0 ? (
        <div className="text-center py-5">
          <h3>No se encontraron juegos</h3>
          <p>Agrega juegos a tu biblioteca o ajusta los filtros de búsqueda.</p>
        </div>
      ) : (
        <Row>
          {filteredGames.map(game => (
            <Col key={game._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <TarjetaJuego game={game} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BibliotecaJuegos;